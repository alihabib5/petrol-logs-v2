/* Service form, shared by the phone app (bottom sheet) and the portal (main panel).
   Fields: date, odometer, work done, service charge, products bought outside the workshop (name, qty, unit price)
   with an optional "replace every N km / N months" per product (filled in from this vehicle's history or the usual interval
   when a product name is entered), and an optional next-service reminder. The totals update as you type; the saved total is worked out again by ServiceLogService. */
const SVC_WORK=["General service","Oil change","Tuning","Brake service","Wheel alignment","AC service","Battery check"];
const SVC_PRODUCTS=["Engine oil","Oil filter","Air filter","Fuel filter","Spark plug","Brake pads","Coolant","Battery","Tyre","Wiper blades","Gear oil","Brake oil"];
const svcSummary=x=>x.work||x.items.map(i=>i.name).join(", ")||"Service";
const plusMonths=(n)=>{const t=new Date();t.setMonth(t.getMonth()+n);return isoOf(t.getFullYear(),t.getMonth(),t.getDate())};
const svcLastOdo=()=>Math.max(0,...(S.data?S.data.rows:[]).map(x=>x.odometer||0),...(S.svc||[]).map(x=>x.odometer||0));

function svcItemRow(it){
  return `<div class="si-r"><input class="si-n" list="s_pl" maxlength="80" autocomplete="off" placeholder="Product, e.g. Engine oil" aria-label="Product name" value="${it?esc(it.name):""}">
  <input class="si-q num" type="number" inputmode="decimal" step="any" min="0" aria-label="Quantity" placeholder="1" value="${it?it.qty:""}">
  <input class="si-p num" type="number" inputmode="decimal" step="0.01" min="0" aria-label="Unit price (${Prefs.sym()})" placeholder="Price" value="${it?it.price:""}">
  <span class="si-t num" aria-label="Line total">${money(0)}</span>
  <button type="button" class="ghost si-x" data-si="rm" aria-label="Remove product">${CROSS_SM}</button>
  <div class="si-e"><span>Replace every</span><input class="si-ek num" type="number" inputmode="numeric" min="0" step="100" aria-label="Replace every (km)" placeholder="km" value="${it&&it.everyKm?it.everyKm:""}"><span>km or</span>
  <input class="si-em num" type="number" inputmode="numeric" min="0" step="1" aria-label="Replace every (months)" placeholder="months" value="${it&&it.everyMonths?it.everyMonths:""}"><span>months</span><small class="si-eh" aria-live="polite"></small></div></div>`;
}
const CROSS_SM='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

function svcFormHTML(e){
  const odo=svcLastOdo(),rem=!!(e&&(e.nextDate||e.nextKm!=null)),items=e&&e.items.length?e.items:[null];
  return `<div class="two"><div><label for="s_d_b">Service date</label>${dateField("s_d",e?e.date:todayISO())}</div>
  <div><label for="s_o">Odometer (km)</label><input id="s_o" type="number" inputmode="numeric" min="0" placeholder="${odo?"Last: "+odo:"Optional"}" value="${e&&e.odometer!=null?e.odometer:""}"></div></div>
  <label for="s_w">Work done</label><input id="s_w" list="s_wl" maxlength="200" autocomplete="off" placeholder="e.g. Oil change, tuning" value="${e?esc(e.work):""}">
  <datalist id="s_wl">${SVC_WORK.map(w=>`<option value="${w}">`).join("")}</datalist><datalist id="s_pl">${SVC_PRODUCTS.map(w=>`<option value="${w}">`).join("")}</datalist>
  <label for="s_c">Service charge (${Prefs.sym()}) <span style="font-weight:500">(workshop labour, optional)</span></label><input id="s_c" class="num" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0" value="${e&&e.charge?e.charge:""}">
  <div class="si"><div class="si-h"><b>Products bought</b><span>Bought outside the workshop for this service</span></div>
  <div class="si-cols" aria-hidden="true"><span>Product</span><span>Qty</span><span>Unit price</span><span>Amount</span><span></span></div>
  <div id="s_items">${items.map(svcItemRow).join("")}</div>
  <button type="button" class="ghost si-add" data-si="add">+ Add product</button></div>
  <div class="card si-sum"><div><span>Service charge</span><b class="num" id="s_tc">${money(0)}</b></div><div><span>Products</span><b class="num" id="s_tp">${money(0)}</b></div><div class="si-tot"><span>Total</span><b class="num" id="s_tt">${money(0)}</b></div></div>
  <div class="sw"><label id="s_rl" for="s_r">Remind me of the next service</label><input id="s_r" type="checkbox" role="switch" aria-labelledby="s_rl" ${rem?"checked":""}></div>
  <div id="s_rw" ${rem?"":"hidden"}><div class="two"><div><label for="s_n_b">Next service date</label>${dateField("s_n",e&&e.nextDate?e.nextDate:plusMonths(3))}</div>
  <div><label for="s_k">Or at (km) <span style="font-weight:500">(optional)</span></label><input id="s_k" type="number" inputmode="numeric" min="0" placeholder="${odo?"e.g. "+(odo+3000):"Optional"}" value="${e&&e.nextKm!=null?e.nextKm:""}"></div></div></div>
  <div class="err" id="ferr" role="alert"></div>`;
}

/* live totals, add/remove product rows; root = the element holding the form */
function svcCalc(root){
  const box=root.querySelector("#s_items");if(!box)return;let p=0;
  box.querySelectorAll(".si-r").forEach(r=>{const q=r.querySelector(".si-q").value,pr=+r.querySelector(".si-p").value||0,l=(q===""?1:+q||0)*pr;p+=l;r.querySelector(".si-t").textContent=money(l)});
  const c=+root.querySelector("#s_c").value||0;
  root.querySelector("#s_tc").textContent=money(c);root.querySelector("#s_tp").textContent=money(p);root.querySelector("#s_tt").textContent=money(c+p);
}
function bindSvcForm(root){
  if(!root._svc){root._svc=1;                         /* the container outlives the form, so its listeners are added once */
    root.addEventListener("input",ev=>{if(ev.target.closest(".si-r")||ev.target.id==="s_c")svcCalc(root)});
    root.addEventListener("change",ev=>{
      if(ev.target.id==="s_r")root.querySelector("#s_rw").hidden=!ev.target.checked;
      if(ev.target.classList.contains("si-n"))svcFillInterval(ev.target.closest(".si-r"));
    });
    root.addEventListener("click",ev=>{
      const b=ev.target.closest("[data-si]"),box=root.querySelector("#s_items");if(!b||!box)return;
      if(b.dataset.si==="add"){box.insertAdjacentHTML("beforeend",svcItemRow());box.lastElementChild.querySelector(".si-n").focus()}
      if(b.dataset.si==="rm"){const r=b.closest(".si-r");if(box.children.length>1)r.remove();else r.querySelectorAll("input").forEach(i=>i.value="");svcCalc(root)}
    });
  }
  svcCalc(root);
}

/* A product name was entered: if its interval fields are empty, offer the interval used last time on this vehicle, or the usual one */
function svcFillInterval(r){
  const ek=r.querySelector(".si-ek"),em=r.querySelector(".si-em"),h=r.querySelector(".si-eh");h.textContent="";
  if(ek.value||em.value||!S.vid)return;
  const iv=ServiceLogService.interval(S.vid,r.querySelector(".si-n").value);if(!iv)return;
  ek.value=iv.everyKm||"";em.value=iv.everyMonths||"";
  h.textContent=iv.from==="history"?"Same as last time":"Usual interval. Change it to match your manual, or clear it to stop tracking";
}
function readSvcForm(root,vid){
  const v=s=>root.querySelector(s).value,rem=root.querySelector("#s_r").checked;
  return{vehicleId:vid,date:v("#s_d"),odometer:v("#s_o"),work:v("#s_w"),charge:v("#s_c"),
    items:[...root.querySelectorAll("#s_items .si-r")].map(r=>({name:r.querySelector(".si-n").value,qty:r.querySelector(".si-q").value,price:r.querySelector(".si-p").value,everyKm:r.querySelector(".si-ek").value,everyMonths:r.querySelector(".si-em").value})),
    nextDate:rem?v("#s_n"):"",nextKm:rem?v("#s_k"):""};
}

/* Parts due: one row per part that has an interval, most urgent first, with a bar showing how much of the interval is used.
   limit = show only the first n rows (phone Home). */
const SVC_ST={overdue:["Overdue","bad"],soon:["Due soon","soon"],ok:["OK","good"]};
function partsHTML(parts,limit){
  if(!parts.length)return`<div class="empty">No parts tracked yet. Set "Replace every" on a product (for example engine oil every 3,000 km) and its next change shows here.</div>`;
  const rows=(limit?parts.slice(0,limit):parts).map(p=>{
    const st=SVC_ST[p.status],due=[];
    if(p.dueKm!=null)due.push(`${p.dueKm.toLocaleString()} km${p.kmLeft!=null?` <span class="${p.kmLeft<0?"bad":""}">(${p.kmLeft<0?(-p.kmLeft).toLocaleString()+" km over":p.kmLeft.toLocaleString()+" km to go"})</span>`:""}`);
    if(p.dueDate)due.push(`${fmtDate(p.dueDate)} <span class="${p.daysLeft<0?"bad":""}">(${p.daysLeft<0?(-p.daysLeft)+" days over":p.daysLeft===0?"today":"in "+p.daysLeft+" days"})</span>`);
    const every=[p.everyKm?p.everyKm.toLocaleString()+" km":"",p.everyMonths?p.everyMonths+" month"+(p.everyMonths>1?"s":""):""].filter(Boolean).join(" or ");
    return`<div class="pd-r"><div class="pd-h"><b>${esc(p.name)}</b><span class="pd-st ${st[1]}">${st[0]}</span></div>
    <div class="pd-m"><span>Changed ${fmtDate(p.date)}${p.odometer!=null?" at "+p.odometer.toLocaleString()+" km":""} · every ${every}</span><span class="num">Due ${due.join(" or ")}</span></div>
    <div class="pd-bar ${st[1]}" role="progressbar" aria-label="${esc(p.name)} interval used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(Math.min(p.used,1)*100)}"><i style="width:${Math.min(p.used,1)*100}%"></i></div></div>`;
  }).join("");
  return rows+(limit&&parts.length>limit?`<div class="pd-more">+ ${parts.length-limit} more part${parts.length-limit>1?"s":""} tracked</div>`:"");
}
