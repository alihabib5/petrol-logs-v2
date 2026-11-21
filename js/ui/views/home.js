/* home view */
function viewHome(){
  const d=S.data;let h="";
    h=`<h1>Petrol Log</h1>${picker()}`;
    if(!S.vid)h+=`<div class="card empty" style="margin-top:14px">Add a vehicle to start tracking.<br><br><button class="pri" data-act="addcar">Add vehicle</button></div>`;
    else{
      h+=`<div class="card gauge" style="margin-top:14px">${gauge(d.avg)}<div class="big num">${f1(d.avg,d.approx)}</div><div class="unit">${d.approx?"estimated":"average"} km / litre</div>${d.approx?`<div class="hint">Estimated from odometer readings. Fill the tank fully twice in a row for an exact average.</div>`:""}</div>
      <div class="grid"><div class="card stat"><div class="v num">${f1(d.last,d.approx)}</div><div class="l">Last fill km/L</div></div>
      <div class="card stat"><div class="v num">${f1(d.best,d.approx)}</div><div class="l">Best km/L</div></div>
      <div class="card stat"><div class="v num">${d.costKm?"Rs "+d.costKm.toFixed(1):"–"}</div><div class="l">Cost per km</div></div>
      <div class="card stat"><div class="v num">${money(d.spend)}</div><div class="l">Total spent (after subsidy)</div></div></div>`;
      const e=d.rows.filter(x=>x.eff!==null).slice(-10),mx=Math.max(...e.map(x=>x.eff),1);
      h+=`<h2>Efficiency by fill</h2><div class="card">${e.length?`<div class="bars">${e.map((x,i)=>`<div class="bar" style="height:${x.eff/mx*100}%;--td:${i*.05}s" data-prop="--s" data-to="1" title="${x.date}"><span class="num">${x.eff.toFixed(1)}</span></div>`).join("")}</div>`:`<div class="empty">Log two full-tank fills to see efficiency.</div>`}</div>`;
      h+=serviceSection();
    }
  return h;
}

/* Service: last visit, the next one due (by date and/or km), and the history with edit/delete */
const daysBetween=(a,b)=>Math.round((Date.UTC(...b.split("-").map((n,i)=>i===1?n-1:+n))-Date.UTC(...a.split("-").map((n,i)=>i===1?n-1:+n)))/864e5);
const ago=n=>n===0?"today":n===1?"yesterday":n>0?n+" days ago":"in "+(-n)+" days";
function serviceSection(){
  const list=S.svc||[],last=list[0],today=todayISO();
  const odo=Math.max(0,...(S.data?S.data.rows:[]).map(x=>x.odometer||0),...list.map(x=>x.odometer||0)); /* latest known reading */
  let h=`<h2>Service</h2><div class="card">`;
  if(!last)h+=`<div class="empty">No service recorded yet. Add one after each workshop visit to remember when it was done and when the next one is due.</div>`;
  else{
    const due=[];
    if(last.nextDate){const n=daysBetween(today,last.nextDate);due.push(`<span class="${n<0?"bad":""}">${fmtDate(last.nextDate)} · ${n<0?"overdue by "+(-n)+" day"+(n===-1?"":"s"):n===0?"due today":"in "+n+" day"+(n===1?"":"s")}</span>`)}
    if(last.nextKm!=null){const k=last.nextKm-odo;due.push(`<span class="${odo&&k<0?"bad":""}">at ${last.nextKm.toLocaleString()} km${odo?` · ${k<0?"overdue by "+(-k).toLocaleString()+" km":k.toLocaleString()+" km to go"}`:""}</span>`)}
    h+=`<div class="row" style="padding-top:0"><div><div class="s">Last service</div><div class="t num">${fmtDate(last.date)} <span class="s">· ${ago(daysBetween(last.date,today))}</span></div><div class="s">${esc(svcSummary(last))}</div></div></div>
    <div class="row"><div><div class="s">Next service</div><div class="t num svc-due">${due.length?due.join(""):`<span class="s">No reminder set</span>`}</div></div></div>`;
  }
  h+=`<div class="btns"><button class="pri" data-act="addsvc">Add service</button></div></div>`;
  const parts=ServiceLogService.parts(S.vid,odo,today);
  if(parts.length)h+=`<h2>Parts due</h2><div class="card">${partsHTML(parts,3)}</div>`;
  if(list.length)h+=`<h2>Service history</h2><div class="card">${list.map(x=>`<div class="row"><div style="min-width:0"><div class="t num">${fmtDate(x.date)}${x.odometer!=null?" · "+x.odometer.toLocaleString()+" km":""}</div><div class="s">${esc(svcSummary(x))}${x.items.length?" · "+x.items.length+" product"+(x.items.length>1?"s":""):""}${x.total?" · "+money(x.total):""}</div></div>
    <div style="display:flex;flex:none"><button class="ghost" style="padding:0 12px" aria-label="Edit service on ${fmtDate(x.date)}" data-sedit="${esc(x.id)}">${PEN}</button><button class="ghost" style="padding:0 12px" aria-label="Delete service on ${fmtDate(x.date)}" data-sdel="${esc(x.id)}">${CROSS}</button></div></div>`).join("")}</div>`;
  return h;
}
