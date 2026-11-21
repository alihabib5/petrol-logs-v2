/* Portal: a desktop-style dashboard over the same data as the app.
   Sidebar (collapsible): Users, Service; the signed-in user at the bottom. Signing in happens in the app (index.html);
   the portal reuses that session from this browser. */
const P={view:"service",form:null,flash:"",collapsed:false};
try{P.collapsed=localStorage.getItem("petrol-portal-side")==="1";P.view=localStorage.getItem("petrol-portal-view")||"service"}catch(e){}
const PIC={
  users:'<path d="M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c0-4 3-6 7-6s7 2 7 6M16 3.5a4 4 0 010 7.5M22 21c0-3-1.5-5-4-5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  service:'<path d="M14.7 6.3a4 4 0 005 5L21 13l-8 8-3-3 6.3-6.3a4 4 0 01-5-5L9 4.4 7.6 3 3 7.6 4.4 9l2.3-2.3a4 4 0 005 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'};
const PVIEWS=[["users","Users"],["service","Service"]];
const daysBetween=(a,b)=>Math.round((Date.UTC(...b.split("-").map((n,i)=>i===1?n-1:+n))-Date.UTC(...a.split("-").map((n,i)=>i===1?n-1:+n)))/864e5);

async function refresh(){
  S.vehicles=await api("GET","/vehicles");
  if(!S.vehicles.find(v=>v.id===S.vid))S.vid=S.vehicles[0]?.id||null;
  S.data=S.vid?await api("GET","/analytics?vehicle="+encodeURIComponent(S.vid)):null;
  S.svc=S.vid?await api("GET","/services?vehicle="+encodeURIComponent(S.vid)):[];
  render();
}

function render(){
  $("#pt").classList.toggle("collapsed",P.collapsed);
  const col=document.querySelector(".pt-col");col.setAttribute("aria-expanded",!P.collapsed);col.setAttribute("aria-label",P.collapsed?"Expand sidebar":"Collapse sidebar");
  $("#ptNav").innerHTML=PVIEWS.map(([k,l])=>`<button data-pv="${k}" ${P.view===k?'aria-current="page"':""} title="${l}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">${PIC[k]}</svg><span>${l}</span></button>`).join("");
  const g=Auth.mode==="google",u=Auth.user||{};
  $("#ptUser").innerHTML=Auth.mode?`${u.picture?`<img src="${esc(u.picture)}" alt="" width="36" height="36" referrerpolicy="no-referrer">`:`<span class="pt-av" aria-hidden="true">${esc((g?u.name||"G":"O")[0])}</span>`}
    <div class="pt-who"><b>${g?esc(u.name||"Google account"):"Offline mode"}</b><small>${g?esc(u.email||""):"Data stays in this browser"}</small></div>`:"";
  if(!Auth.mode){
    $("#ptTop").innerHTML=`<h1>Portal</h1>`;
    $("#ptView").innerHTML=`<div class="card pt-empty"><b>Sign in first</b><p>The portal uses the account you signed in with in the Petrol Log app on this browser.</p><a class="lnk" href="index.html">Open the app to sign in</a></div>`;
    return;
  }
  const veh=S.vehicles.length&&P.view==="service"&&!P.form?`<select id="veh" aria-label="Vehicle">${S.vehicles.map(v=>`<option value="${esc(v.id)}" ${v.id===S.vid?"selected":""}>${esc(v.plate)} · ${esc(v.name)}</option>`).join("")}</select>`:"";
  const title=P.view==="users"?"Users":P.form?(P.form==="new"?"New service":"Edit service"):"Service";
  $("#ptTop").innerHTML=`<h1>${title}</h1><div class="pt-tools">${veh}${P.view==="service"&&!P.form&&S.vid?`<button class="pri" data-pa="new">+ New service</button>`:""}</div>`;
  const v=$("#ptView");
  if(P.form&&v.querySelector(".pt-form")){                    /* a form being filled stays as typed; only the reconnect banner updates */
    const old=v.querySelector(".recon"),b=reconnectBanner();
    if(old)old.outerHTML=b;else if(b)v.insertAdjacentHTML("afterbegin",b);
    return;
  }
  v.innerHTML=reconnectBanner()+(P.flash?`<div class="pt-flash" role="status">${P.flash}</div>`:"")+(P.view==="users"?viewUsers():P.form?viewSvcForm():viewService());
  if(P.form){bindSvcForm(v);setTimeout(()=>$("#s_o")?.focus(),30)}
}

/* ---- Service ---- */
function viewService(){
  if(!S.vid)return`<div class="card pt-empty"><b>No vehicles yet</b><p>Add a vehicle in the app first, then record its services here.</p><a class="lnk" href="index.html">Open the app</a></div>`;
  const list=S.svc,today=todayISO(),last=list[0],odo=svcLastOdo();
  const spent=list.reduce((s,x)=>s+(x.total||0),0),prod=list.reduce((s,x)=>s+svcItemsTotal(x.items),0),nItems=list.reduce((s,x)=>s+x.items.length,0);
  let due="No reminder set",dueBad=false;
  if(last&&last.nextDate){const n=daysBetween(today,last.nextDate);dueBad=n<0;due=fmtDate(last.nextDate)+" · "+(n<0?"overdue by "+(-n)+" d":n===0?"due today":"in "+n+" days")}
  else if(last&&last.nextKm!=null){const k=last.nextKm-odo;dueBad=!!odo&&k<0;due="At "+last.nextKm.toLocaleString()+" km"+(odo?" · "+(k<0?"overdue":k.toLocaleString()+" km to go"):"")}
  const stat=(l,v,s,bad)=>`<div class="card pt-stat"><span class="l">${l}</span><b class="num ${bad?"bad":""}">${v}</b><small>${s}</small></div>`;
  let h=`<div class="pt-stats">
    ${stat("Last service",last?fmtDate(last.date):"–",last?(daysBetween(last.date,today)===0?"today":daysBetween(last.date,today)+" days ago"):"Nothing recorded")}
    ${stat("Next service",last&&(last.nextDate||last.nextKm!=null)?due.split(" · ")[0]:"–",last&&(last.nextDate||last.nextKm!=null)?due.split(" · ")[1]||"":"No reminder set",dueBad)}
    ${stat("Spent on service",money(spent),list.length+" visit"+(list.length===1?"":"s"))}
    ${stat("Products bought",money(prod),nItems+" item"+(nItems===1?"":"s")+" outside the workshop")}</div>`;
  const parts=ServiceLogService.parts(S.vid,odo,today);
  if(list.length)h+=`<h2>Parts due</h2><div class="card pt-parts"><div class="pd-g">${partsHTML(parts)}</div></div><h2>Service history</h2>`;
  if(!list.length)return h+`<div class="card pt-empty"><b>No services yet</b><p>Record each workshop visit: the date, odometer, and the products you bought for it. The total is added up for you.</p><button class="pri" data-pa="new">+ New service</button></div>`;
  h+=`<div class="card pt-table" role="table" aria-label="Service history"><div class="pt-tr pt-th" role="row"><span role="columnheader">Date</span><span role="columnheader">Odometer</span><span role="columnheader">Work and products</span><span role="columnheader" class="r">Service charge</span><span role="columnheader" class="r">Products</span><span role="columnheader" class="r">Total</span><span role="columnheader"><span class="sr">Actions</span></span></div>`;
  h+=list.map(x=>`<div class="pt-tr" role="row"><span role="cell" class="num"><b>${fmtDate(x.date)}</b></span><span role="cell" class="num">${x.odometer!=null?x.odometer.toLocaleString()+" km":"–"}</span>
    <span role="cell" class="pt-wk">${x.work?`<b>${esc(x.work)}</b>`:""}${x.items.length?`<span class="pt-chips">${x.items.map(i=>`<span class="chip num">${esc(i.name)} × ${i.qty} · ${money(i.qty*i.price)}</span>`).join("")}</span>`:""}</span>
    <span role="cell" class="num r" data-l="Service charge">${money(x.charge||0)}</span><span role="cell" class="num r" data-l="Products">${money(svcItemsTotal(x.items))}</span><span role="cell" class="num r pt-total" data-l="Total">${money(x.total||0)}</span>
    <span role="cell" class="pt-act"><button class="ghost" data-pedit="${esc(x.id)}" aria-label="Edit service on ${fmtDate(x.date)}">${PEN}</button><button class="ghost" data-pdel="${esc(x.id)}" aria-label="Delete service on ${fmtDate(x.date)}">${CROSS}</button></span></div>`).join("");
  return h+`<div class="pt-tr pt-tf" role="row"><span role="cell">All visits</span><span></span><span></span><span role="cell" class="num r" data-l="Service charge">${money(list.reduce((s,x)=>s+(x.charge||0),0))}</span><span role="cell" class="num r" data-l="Products">${money(prod)}</span><span role="cell" class="num r pt-total" data-l="Total">${money(spent)}</span><span></span></div></div>`;
}
function viewSvcForm(){
  const e=P.form==="new"?null:S.svc.find(x=>x.id===P.form),v=S.vehicles.find(x=>x.id===S.vid);
  return`<div class="card pt-form"><div class="pt-fveh">Vehicle <b>${esc(v.plate)} · ${esc(v.name)}</b></div>${svcFormHTML(e)}
  <div class="pt-fbtn"><button class="ghost" data-pa="cancel">Cancel</button><button class="pri" data-pa="save" ${e?`data-id="${esc(e.id)}"`:""}>${e?"Save changes":"Submit service"}</button></div></div>`;
}

/* ---- Users: the person signed in on this browser ---- */
function viewUsers(){
  const g=Auth.mode==="google",u=Auth.user||{};
  const rows=S.vehicles.map(v=>{const l=FuelLogService.list(v.id),s=ServiceLogService.list(v.id);
    return`<div class="pt-tr pt-vr" role="row"><span role="cell"><b>${esc(v.plate)}</b></span><span role="cell">${esc(v.name)}</span><span role="cell" class="num r" data-l="Fill-ups">${l.length}</span><span role="cell" class="num r" data-l="Services">${s.length}</span><span role="cell" class="num" data-l="Last service">${s[0]?fmtDate(s[0].date):"–"}</span><span role="cell" class="num r" data-l="Service spend">${money(s.reduce((a,x)=>a+(x.total||0),0))}</span></div>`}).join("");
  return`<div class="card pt-prof">${u.picture?`<img src="${esc(u.picture)}" alt="" width="64" height="64" referrerpolicy="no-referrer">`:`<span class="pt-av big" aria-hidden="true">${esc((g?u.name||"G":"O")[0])}</span>`}
    <div class="pt-who"><b>${g?esc(u.name||"Google account"):"Offline mode"}</b><small>${g?esc(u.email||""):"Data stays in this browser only"}</small><span class="pill ${g?"":"na"}">${g?"GOOGLE DRIVE":"LOCAL"}</span></div>
    <div class="pt-pbtn">${g&&Gs.id?`<a class="lnk" href="https://docs.google.com/spreadsheets/d/${Gs.id}" target="_blank" rel="noopener">Open my Google Sheet</a>`:""}${g?`<button class="ghost" data-pa="sync" ${S.syncing?'disabled aria-busy="true"':""}>${S.syncing?'<span class="spin" aria-hidden="true"></span>Syncing':"Sync now"}</button>`:""}<a class="lnk" href="index.html">Open the app</a></div>
    ${S.sync?`<small class="pt-sync ${/fail|Could not/i.test(S.sync)?"bad":""}" role="status">${esc(S.sync)}</small>`:""}</div>
  <h2>Vehicles</h2>${S.vehicles.length?`<div class="card pt-table" role="table" aria-label="Vehicles"><div class="pt-tr pt-vr pt-th" role="row"><span role="columnheader">Plate</span><span role="columnheader">Name</span><span role="columnheader" class="r">Fill-ups</span><span role="columnheader" class="r">Services</span><span role="columnheader">Last service</span><span role="columnheader" class="r">Service spend</span></div>${rows}</div>`:`<div class="card pt-empty"><p>No vehicles yet. Add one in the app.</p></div>`}`;
}

/* ---- Events ---- */
document.addEventListener("click",async ev=>{
  const t=ev.target.closest("button");if(!t)return;
  if(t.dataset.cal)return Cal.open(t);
  if(t.dataset.pv){P.view=t.dataset.pv;P.form=null;P.flash="";try{localStorage.setItem("petrol-portal-view",P.view)}catch(e){}return render()}
  if(t.dataset.pedit){P.form=t.dataset.pedit;P.flash="";return render()}
  if(t.dataset.pdel){const x=S.svc.find(s=>s.id===t.dataset.pdel);if(!x||!confirm("Delete the service on "+fmtDate(x.date)+"? This cannot be undone."))return;
    try{await api("DELETE","/services/"+x.id);P.flash="Service on "+fmtDate(x.date)+" deleted"}catch(e){alert(e.message)}return refresh()}
  const a=t.dataset.pa||t.dataset.act;
  if(a==="collapse"){P.collapsed=!P.collapsed;try{localStorage.setItem("petrol-portal-side",P.collapsed?"1":"0")}catch(e){}return render()}
  if(a==="new"){P.form="new";P.flash="";return render()}
  if(a==="cancel"){P.form=null;return render()}
  if(a==="save"){
    if(t.disabled)return;t.disabled=true;$("#ferr").textContent="";
    try{const id=t.dataset.id,r=await api(id?"PUT":"POST",id?"/services/"+id:"/services",readSvcForm($("#ptView"),S.vid));
      P.form=null;P.flash=`<b>Service ${id?"updated":"saved"}.</b> ${fmtDate(r.date)} · Total ${money(r.total)}${r.items.length?` (service charge ${money(r.charge)} + ${r.items.length} product${r.items.length>1?"s":""} ${money(svcItemsTotal(r.items))})`:""}`;scrollTo(0,0);refresh()}
    catch(e){t.disabled=false;$("#ferr").textContent=e.message}
    return}
  if(a==="sync"){if(S.syncing)return;S.syncing=true;S.sync="";render();try{await SyncService.pull();S.sync="Synced with Google Drive ✓"}catch(e){S.sync="Sync failed: "+e.message}S.syncing=false;return refresh()}
  if(a==="reconnect"){if(S.reconnecting)return;S.reconnecting=true;render();try{await Auth.request(false);await SyncService.pull();S.sync="Synced with Google Drive ✓"}catch(e){Auth.needsReconnect=true;S.sync="Could not reconnect: "+e.message}S.reconnecting=false;return refresh()}
});
document.addEventListener("change",ev=>{if(ev.target.id==="veh"){S.vid=ev.target.value;P.flash="";refresh()}});
document.addEventListener("keydown",ev=>{if(ev.key==="Escape"&&P.form&&!$("#cal").classList.contains("on")){P.form=null;render()}});

/* ---- Start: reuse the app's session in this browser ---- */
(async()=>{
  const m=localStorage.getItem("petrol-mode");
  if(m==="local"){Auth.mode="local";DB.load()}
  else if(m==="google"&&Auth.configured()&&Auth.restore())DB.load();
  await refresh();
  if(Auth.mode==="google"&&!Auth.needsReconnect){try{await SyncService.pull();refresh()}catch(e){}}
})();
