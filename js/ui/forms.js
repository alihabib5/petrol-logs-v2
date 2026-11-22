/* Bottom-sheet forms */
function sheet(html){$("#sheetBody").innerHTML=html;$("#sheet").classList.add("on");setTimeout(()=>$("#sheetBody input:not([type=hidden])")?.focus(),50)}
function closeSheet(){$("#sheet").classList.remove("on")}
function logForm(e){
  const v=curV(),last=S.data?.rows.filter(r=>r.src!=="home").at(-1),lastOdo=S.data?.rows.filter(r=>r.odometer!=null).at(-1),L=UL(v),ev=isEV(v); /* labels follow the vehicle type */
  const showSub=vType(v)==="petrol"||!!(e&&e.subsidy);           /* government subsidy applies to petrol only */
  let src="";if(ev){try{src=e?(e.src||"public"):(localStorage.getItem("petrol-src")||"home")}catch(_){src="home"}}
  sheet(`<h1 style="font-size:24px;margin:0 0 4px">${e?"Edit "+L.fill:"New "+L.fill}</h1>
  ${ev?`<div class="seg" role="group" aria-label="Where did you charge?" style="margin-top:10px"><button type="button" data-src="home" aria-pressed="${src==="home"}">Home</button><button type="button" data-src="public" aria-pressed="${src==="public"}">Public charger</button></div>`:""}
  <label for="f_d_b">Date</label>${dateField("f_d",e?e.date:todayISO())}
  <label for="f_o">Odometer (km) <span id="f_on" style="font-weight:500">(optional)</span></label><input id="f_o" type="number" inputmode="numeric" min="0" placeholder="${lastOdo?lastOdo.odometer:"Optional"}" value="${e&&e.odometer!=null?e.odometer:""}">
  ${ev?`<div class="two"><div><label for="f_bs">Battery % at plug-in</label><input id="f_bs" type="number" inputmode="numeric" min="0" max="100" placeholder="e.g. 20" value="${e&&e.bs!=null?e.bs:""}"></div>
  <div><label for="f_be">Battery % at unplug</label><input id="f_be" type="number" inputmode="numeric" min="0" max="100" placeholder="e.g. 90" value="${e&&e.be!=null?e.be:""}"></div></div><div class="hint" id="f_bh"></div>`:""}
  <div id="f_pub">
  <div class="two"><div><label>Price per ${L.per} (${Prefs.sym()})</label><input id="f_p" type="number" inputmode="decimal" step="0.01" min="0" value="${e&&e.src!=="home"?e.price:last?last.price:""}"></div><div><label>Total amount (${Prefs.sym()})</label><input id="f_a" type="number" inputmode="decimal" step="0.01" min="0"></div></div>
  <label>${L.amount}${ev?" charged":""}</label><input id="f_l" type="number" inputmode="decimal" step="0.01" min="0" value="${e&&e.src!=="home"?e.liters:""}">
  <div class="hint" id="f_h" aria-live="polite" hidden></div>
  ${showSub?`<div class="sw"><label id="f_subl" for="f_sub">Government subsidy applied?</label><input id="f_sub" type="checkbox" role="switch" aria-labelledby="f_subl" ${e&&e.subsidy?"checked":""}></div>
  <div id="f_sw" ${e&&e.subsidy?"":"hidden"}><label for="f_s">Subsidy amount (${Prefs.sym()}, deducted from total)</label><input id="f_s" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0" oninput="tot()" value="${e&&e.subsidy?e.subsidy:""}"></div>`:""}
  <div class="card" style="margin-top:12px;display:flex;justify-content:space-between"><span style="color:var(--mute)">Net payable</span><b class="num" id="f_t">${money(0)}</b></div>
  <div class="sw"><label for="f_f">${L.fullQ}</label><input id="f_f" type="checkbox" role="switch" ${!e||e.full?"checked":""}></div>
  </div>
  ${ev?`<div class="card ev-sum" id="f_home" aria-live="polite"></div>`:""}
  <div class="err" id="ferr"></div>
  <div class="two" style="margin-top:8px"><button data-act="close">Cancel</button><button class="pri" data-act="savelog" ${e?`data-id="${esc(e.id)}"`:""} data-src="${src}">Save</button></div>`);
  const sub=$("#f_sub");if(sub)sub.addEventListener("change",e=>{const on=e.target.checked;$("#f_sw").hidden=!on;if(on)$("#f_s").focus();else $("#f_s").value="";tot()});
  bindFillLinks({price:$("#f_p"),total:$("#f_a"),liters:$("#f_l"),hint:$("#f_h"),onChange:tot,unit:L,touched:e&&e.src!=="home"?["price","liters"]:["price"]});
  if(ev){
    const setSrc=s=>{src=s;$("#sheetBody [data-act=savelog]").dataset.src=s;
      document.querySelectorAll("#sheetBody [data-src]:not([data-act])").forEach(b=>b.setAttribute("aria-pressed",b.dataset.src===s));
      $("#f_pub").hidden=s==="home";$("#f_home").hidden=s!=="home";
      $("#f_on").textContent=s==="home"?"(needed for home charging)":"(optional)";
      $("#f_bh").textContent=s==="home"?"":"Optional: with both, Safri learns your battery size from this receipt.";evSum()};
    const evSum=()=>{
      const bs=$("#f_bs").value,be=$("#f_be").value,add=bs!==""&&be!==""?be-bs:null,cap=evCap(v),rate=v.rate>0?v.rate:null;
      let h=add>0?`<b>Added ${add}% of the battery</b>`:`<b>Enter the battery % at plug-in and at unplug</b>`;
      if(add>0&&cap){const k=add/100*cap;h+=`<span class="num">≈ ${k.toFixed(1)} kWh into the battery${evCap(v)&&!(v.cap>0)?" (battery size learned from your public charges)":""}</span>`;
        h+=rate?`<span class="num">≈ ${(k/CHARGE_LOSS).toFixed(1)} units from your meter × Rs ${rate} = <b>≈ ${money(k/CHARGE_LOSS*rate)}</b></span>`:`<span>Add your electricity rate in Vehicles → Charging settings to see the cost.</span>`}
      else if(add>0)h+=`<span>Add your battery size (or log one public charge with its receipt) and your electricity rate in Vehicles → Charging settings to see kWh and cost. Efficiency works without them.</span>`;
      $("#f_home").innerHTML=h};
    document.querySelectorAll("#sheetBody [data-src]:not([data-act])").forEach(b=>b.addEventListener("click",()=>setSrc(b.dataset.src)));
    ["#f_bs","#f_be"].forEach(x=>$(x).addEventListener("input",evSum));
    setSrc(src);
  }
}
function tot(){const s=$("#f_sub"),n=(+$("#f_l").value||0)*(+$("#f_p").value||0)-(s&&s.checked?+$("#f_s").value||0:0);$("#f_t").textContent=money(Math.max(n,0))}
/* EV charging settings: battery size and the home electricity rate, worked out from the owner's bill if they like */
function evForm(v){
  const lc=learnedCap(v.id),num='type="number" inputmode="decimal" step="any" min="0"';
  sheet(`<h1 style="font-size:24px;margin:0 0 4px">Charging settings</h1><p class="hint" style="margin:0">${esc(v.plate)} · ${esc(v.name)}. Used to turn battery % into kWh and cost for home charging.</p>
  <label for="e_c">Battery size (kWh) <span style="font-weight:500">(optional)</span></label><input id="e_c" ${num} placeholder="${lc?"Learned: "+lc.toFixed(1):"e.g. 51"}" value="${v.cap>0?v.cap:""}">
  <div class="hint">${lc?`Safri learned about ${lc.toFixed(1)} kWh from your public charge receipts. Leave this empty to keep using it.`:"From your car's manual or dealer. Or leave it empty: log one public charge with its kWh and battery %, and Safri works it out."}</div>
  <label for="e_r">Home electricity rate (${Prefs.sym()} per unit)</label><input id="e_r" ${num} placeholder="e.g. 60" value="${v.rate>0?v.rate:""}">
  <div class="card bill"><b>Work it out from your electricity bill</b><span class="hint" style="margin:0">Your bill (K-Electric, LESCO, IESCO or any other) shows the units used and the amount payable.</span>
    <div class="two"><div><label for="e_u">Units used</label><input id="e_u" ${num} placeholder="e.g. 350"></div><div><label for="e_a">Amount payable (${Prefs.sym()})</label><input id="e_a" ${num} placeholder="e.g. 21000"></div></div>
    <div class="hint num" id="e_h" aria-live="polite"></div></div>
  <div class="err" id="ferr"></div>
  <div class="two" style="margin-top:8px"><button data-act="close">Cancel</button><button class="pri" data-act="saveev" data-id="${esc(v.id)}">Save</button></div>`);
  const calc=()=>{const u=+$("#e_u").value,a=+$("#e_a").value;if(u>0&&a>0){const r=Math.round(a/u*10)/10;$("#e_r").value=r;$("#e_h").textContent=`${money(a)} ÷ ${u} units = ${Prefs.sym()} ${r} per unit`}else $("#e_h").textContent=""};
  ["#e_u","#e_a"].forEach(x=>$(x).addEventListener("input",calc));
}
function carForm(){
  sheet(`<h1 style="font-size:24px;margin:0 0 4px">New vehicle</h1><label>Plate number (required, used as the sheet tab name)</label><input id="c_p" placeholder="e.g. LEA-1234" autocapitalize="characters" autocomplete="off"><label>Vehicle name</label><input id="c_n" placeholder="e.g. Suzuki Alto">
  <label for="c_t">Type</label><select id="c_t">${VTYPES.map(([k,l])=>`<option value="${k}">${l}</option>`).join("")}</select>
  <div class="hint" style="margin-top:6px">Electric vehicles log charging in kWh and show km per kWh.</div><div class="err" id="ferr"></div>
  <div class="two" style="margin-top:8px"><button data-act="close">Cancel</button><button class="pri" data-act="savecar">Save</button></div>`);
}
async function guard(fn){try{await fn()}catch(e){const el=$("#ferr");if(el)el.textContent=e.message;else alert(e.message)}}
