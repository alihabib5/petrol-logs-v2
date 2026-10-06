/* Bottom-sheet forms */
function sheet(html){$("#sheetBody").innerHTML=html;$("#sheet").classList.add("on");setTimeout(()=>$("#sheetBody input")?.focus(),50)}
function closeSheet(){$("#sheet").classList.remove("on")}
function logForm(){
  const last=S.data?.rows.at(-1);
  sheet(`<h1 style="font-size:24px;margin:0 0 4px">New fill-up</h1><label>Date</label><input id="f_d" type="date" value="${new Date().toISOString().slice(0,10)}">
  <div class="two"><div><label>Odometer (km)</label><input id="f_o" type="number" inputmode="numeric" placeholder="${last?last.odometer:"0"}"></div><div><label>Litres</label><input id="f_l" type="number" inputmode="decimal" step="0.01" oninput="tot()"></div></div>
  <label>Price per litre (Rs)</label><input id="f_p" type="number" inputmode="decimal" step="0.01" oninput="tot()" value="${last?last.price:""}">
  <label>Government subsidy (Rs, deducted from total)</label><input id="f_s" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0" oninput="tot()">
  <div class="card" style="margin-top:12px;display:flex;justify-content:space-between"><span style="color:var(--mute)">Net payable</span><b class="num" id="f_t">Rs 0</b></div>
  <div class="sw"><span>Filled to full tank</span><input id="f_f" type="checkbox" role="switch" checked></div><div class="err" id="ferr"></div>
  <div class="two" style="margin-top:8px"><button data-act="close">Cancel</button><button class="pri" data-act="savelog">Save</button></div>`);
}
function tot(){const n=(+$("#f_l").value||0)*(+$("#f_p").value||0)-(+$("#f_s").value||0);$("#f_t").textContent=money(Math.max(n,0))}
function carForm(){
  sheet(`<h1 style="font-size:24px;margin:0 0 4px">New vehicle</h1><label>Plate number (required, used as the sheet tab name)</label><input id="c_p" placeholder="e.g. LEA-1234" autocapitalize="characters" autocomplete="off"><label>Vehicle name</label><input id="c_n" placeholder="e.g. Suzuki Alto"><div class="err" id="ferr"></div>
  <div class="two" style="margin-top:8px"><button data-act="close">Cancel</button><button class="pri" data-act="savecar">Save</button></div>`);
}
async function guard(fn){try{await fn()}catch(e){const el=$("#ferr");if(el)el.textContent=e.message;else alert(e.message)}}
