/* service view: its own tab. Stat cards, parts due, service history table, and the add/edit form in the page.
   S.svcForm: null = list, "new" = new service, "<id>" = editing that service. S.flash: one-line confirmation after save/delete. */
function viewService(){
  const top=(title,tools)=>`<div class="pt-top"><h1>${title}</h1><div class="pt-tools">${tools}</div></div>`;
  const flash=S.flash?`<div class="pt-flash" role="status">${S.flash}</div>`:"";
  if(!S.vid)return top("Service","")+`<div class="card pt-empty"><b>No vehicles yet</b><p>Add a vehicle first, then record its services here.</p><button class="pri" data-act="addcar">Add vehicle</button></div>`;
  if(S.svcForm){
    const e=S.svcForm==="new"?null:S.svc.find(x=>x.id===S.svcForm),v=S.vehicles.find(x=>x.id===S.vid);
    return top(e?"Edit service":"New service","")+`<div class="card pt-form"><div class="pt-fveh">Vehicle <b>${esc(v.plate)} · ${esc(v.name)}</b></div>${svcFormHTML(e)}
    <div class="pt-fbtn"><button class="ghost" data-act="svccancel">Cancel</button><button class="pri" data-act="savesvc" ${e?`data-id="${esc(e.id)}"`:""}>${e?"Save changes":"Submit service"}</button></div></div>`;
  }
  const veh=`<select id="veh" aria-label="Vehicle">${S.vehicles.map(v=>`<option value="${esc(v.id)}" ${v.id===S.vid?"selected":""}>${esc(v.plate)} · ${esc(v.name)}</option>`).join("")}</select>`;
  let h=top("Service",veh+`<button class="pri" data-act="addsvc">+ New service</button>`)+flash;
  const list=S.svc,today=todayISO(),last=list[0],odo=svcLastOdo();
  const spent=list.reduce((s,x)=>s+(x.total||0),0),prod=list.reduce((s,x)=>s+svcItemsTotal(x.items),0),nItems=list.reduce((s,x)=>s+x.items.length,0);
  let due="",dueSub="No reminder set",dueBad=false;
  if(last&&last.nextDate){const n=isoDays(today,last.nextDate);dueBad=n<0;due=fmtDate(last.nextDate);dueSub=n<0?"overdue by "+(-n)+" days":n===0?"due today":"in "+n+" days"}
  else if(last&&last.nextKm!=null){const k=last.nextKm-odo;dueBad=!!odo&&k<0;due=last.nextKm.toLocaleString()+" km";dueSub=odo?(k<0?"overdue by "+(-k).toLocaleString()+" km":k.toLocaleString()+" km to go"):""}
  const stat=(l,v,s,bad)=>`<div class="card pt-stat"><span class="l">${l}</span><b class="num ${bad?"bad":""}">${v}</b><small>${s}</small></div>`;
  const ago=last?isoDays(last.date,today):0;
  h+=`<div class="pt-stats">
    ${stat("Last service",last?fmtDate(last.date):"–",last?(ago===0?"today":ago===1?"yesterday":ago+" days ago")+" · "+esc(svcSummary(last)):"Nothing recorded")}
    ${stat("Next service",due||"–",dueSub,dueBad)}
    ${stat("Spent on service",money(spent),list.length+" visit"+(list.length===1?"":"s"))}
    ${stat("Products bought",money(prod),nItems+" item"+(nItems===1?"":"s")+" outside the workshop")}</div>`;
  if(!list.length)return h+`<div class="card pt-empty"><b>No services yet</b><p>Record each workshop visit: the date, odometer, and the products you bought for it. The total is added up for you.</p><button class="pri" data-act="addsvc">+ New service</button></div>`;
  h+=`<h2>Parts due</h2><div class="card pt-parts"><div class="pd-g">${partsHTML(ServiceLogService.parts(S.vid,odo,today))}</div></div><h2>Service history</h2>`;
  h+=`<div class="card pt-table" role="table" aria-label="Service history"><div class="pt-tr pt-th" role="row"><span role="columnheader">Date</span><span role="columnheader">Odometer</span><span role="columnheader">Work and products</span><span role="columnheader" class="r">Service charge</span><span role="columnheader" class="r">Products</span><span role="columnheader" class="r">Total</span><span role="columnheader"><span class="sr">Actions</span></span></div>`;
  h+=list.map(x=>`<div class="pt-tr" role="row"><span role="cell" class="num"><b>${fmtDate(x.date)}</b></span><span role="cell" class="num">${x.odometer!=null?x.odometer.toLocaleString()+" km":"–"}</span>
    <span role="cell" class="pt-wk">${x.work?`<b>${esc(x.work)}</b>`:""}${x.items.length?`<span class="pt-chips">${x.items.map(i=>`<span class="chip num">${esc(i.name)} × ${i.qty} · ${money(i.qty*i.price)}</span>`).join("")}</span>`:""}</span>
    <span role="cell" class="num r" data-l="Service charge">${money(x.charge||0)}</span><span role="cell" class="num r" data-l="Products">${money(svcItemsTotal(x.items))}</span><span role="cell" class="num r pt-total" data-l="Total">${money(x.total||0)}</span>
    <span role="cell" class="pt-act"><button class="ghost" data-sedit="${esc(x.id)}" aria-label="Edit service on ${fmtDate(x.date)}">${PEN}</button><button class="ghost" data-sdel="${esc(x.id)}" aria-label="Delete service on ${fmtDate(x.date)}">${CROSS}</button></span></div>`).join("");
  return h+`<div class="pt-tr pt-tf" role="row"><span role="cell">All visits</span><span></span><span></span><span role="cell" class="num r" data-l="Service charge">${money(list.reduce((s,x)=>s+(x.charge||0),0))}</span><span role="cell" class="num r" data-l="Products">${money(prod)}</span><span role="cell" class="num r pt-total" data-l="Total">${money(spent)}</span><span></span></div></div>`;
}

/* Sidebar (wide screens): the same tabs as the phone bar, the signed-in user at the bottom */
function renderSide(){
  const side=$("#side");if(!side)return;
  document.body.classList.toggle("dash",!!Auth.mode);document.body.classList.toggle("collapsed",!!S.side);
  if(!Auth.mode){side.innerHTML="";return}
  const g=Auth.mode==="google",u=Auth.user||{};
  side.innerHTML=`<div class="pt-brand"><span class="pt-logo" aria-hidden="true"></span><b class="pt-name">Sawari</b>
    <button class="pt-col" data-act="side" aria-label="${S.side?"Expand":"Collapse"} sidebar" aria-expanded="${!S.side}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 4v16M18 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
  <nav class="pt-nav" aria-label="Main">${TABS.map(([k,l,dl])=>`<button data-t="${k}" ${S.tab===k?'aria-current="page"':""} title="${dl||l}"><svg viewBox="0 0 24 24" aria-hidden="true">${IC[k==="cars"?"car":k]}</svg><span>${dl||l}</span></button>`).join("")}</nav>
  <div class="pt-user">${u.picture?`<img src="${esc(u.picture)}" alt="" width="36" height="36" referrerpolicy="no-referrer">`:`<span class="pt-av" aria-hidden="true">${esc((g?u.name||"G":"O")[0])}</span>`}
    <div class="pt-who"><b>${g?esc(u.name||"Google account"):"Offline mode"}</b><small>${g?esc(u.email||""):"Data stays in this browser"}</small></div></div>`;
}
