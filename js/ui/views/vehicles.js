/* vehicles view */
function viewVehicles(){
  const d=S.data;let h="";
    h=`<h1>Vehicles</h1><div class="card">${S.vehicles.map(v=>`<div class="row"><div><div class="t">${esc(v.plate)}</div><div class="s">${esc(v.name)} · ${vTypeName(v)}</div></div><span class="btns" style="margin:0;flex-wrap:nowrap">${isEV(v)?`<button class="ghost" data-evset="${esc(v.id)}">Charging settings</button>`:""}<button class="ghost" data-rmcar="${esc(v.id)}">Remove</button></span></div>`).join("")||`<div class="empty">No vehicles.</div>`}</div><div class="btns"><button class="pri" data-act="addcar">Add vehicle</button></div>`;
  return h;
}
