/* home view */
function viewHome(){
  const d=S.data;let h="";
    h=`<h1>Petrol Log</h1>${picker()}`;
    if(!S.vid)h+=`<div class="card empty" style="margin-top:14px">Add a vehicle to start tracking.<br><br><button class="pri" data-act="addcar">Add vehicle</button></div>`;
    else{
      h+=`<div class="card gauge" style="margin-top:14px">${gauge(d.avg)}<div class="big num">${f1(d.avg)}</div><div class="unit">average km / litre</div></div>
      <div class="grid"><div class="card stat"><div class="v num">${f1(d.last)}</div><div class="l">Last fill km/L</div></div>
      <div class="card stat"><div class="v num">${f1(d.best)}</div><div class="l">Best km/L</div></div>
      <div class="card stat"><div class="v num">${d.costKm?"Rs "+d.costKm.toFixed(1):"–"}</div><div class="l">Cost per km</div></div>
      <div class="card stat"><div class="v num">${money(d.spend)}</div><div class="l">Total spent (after subsidy)</div></div></div>`;
      const e=d.rows.filter(x=>x.eff!==null).slice(-10),mx=Math.max(...e.map(x=>x.eff),1);
      h+=`<h2>Efficiency by fill</h2><div class="card">${e.length?`<div class="bars">${e.map(x=>`<div class="bar" style="height:${x.eff/mx*100}%" title="${x.date}"><span class="num">${x.eff.toFixed(1)}</span></div>`).join("")}</div>`:`<div class="empty">Log two full-tank fills to see efficiency.</div>`}</div>`;
    }
  return h;
}
