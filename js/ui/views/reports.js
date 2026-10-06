/* reports view */
function viewReports(){
  const d=S.data;let h="";
    const R=S.report||{items:[],t:{}},t=R.t;
    h=`<h1>Reports</h1><div class="two"><div><label style="margin-top:0">Month</label><input id="rm" type="month" value="${S.month}"></div><div><label style="margin-top:0">Vehicle</label><select id="rv"><option value="*">All vehicles</option>${S.vehicles.map(v=>`<option value="${esc(v.id)}" ${v.id===S.rv?"selected":""}>${esc(v.plate)}</option>`).join("")}</select></div></div>
    <div class="grid"><div class="card stat"><div class="v num">${f1(t.avg)}</div><div class="l">Avg km/L</div></div><div class="card stat"><div class="v num">${t.fills||0}</div><div class="l">Fill-ups</div></div><div class="card stat"><div class="v num">${(t.litres||0).toFixed(1)} L</div><div class="l">Litres</div></div><div class="card stat"><div class="v num">${money(t.net||0)}</div><div class="l">Net cost${t.subsidy?` (after ${money(t.subsidy)} subsidy)`:""}</div></div></div>
    <h2>By vehicle</h2><div class="card">${R.items.length?R.items.map(i=>`<div class="row"><div><div class="t">${esc(i.v.plate)}</div><div class="s num">${i.s.fills} fills · ${i.s.litres.toFixed(1)} L · ${money(i.s.net)}</div></div><span class="pill num ${i.s.avg===null?"na":""}">${f1(i.s.avg)}</span></div>`).join(""):`<div class="empty">No vehicles yet.</div>`}</div>
    <h2>Download</h2><div class="btns"><button class="pri" data-act="xlsx">Excel</button><button class="pri" data-act="pdf">PDF</button><button class="ghost" data-act="csv">CSV</button></div>`;
  return h;
}
