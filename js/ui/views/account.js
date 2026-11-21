/* account view */
function viewAccount(){
  const g=Auth.mode==="google",u=Auth.user||{};
  const th=Prefs.d.theme;
  const wide=matchMedia("(min-width:900px)").matches; /* the sidebar calls this page Users */
  const veh=S.vehicles.map(v=>{const l=FuelLogService.list(v.id),s=ServiceLogService.list(v.id);
    return`<div class="pt-tr pt-vr" role="row"><span role="cell"><b>${esc(v.plate)}</b></span><span role="cell">${esc(v.name)}</span><span role="cell" class="num r" data-l="Fill-ups">${l.length}</span><span role="cell" class="num r" data-l="Services">${s.length}</span><span role="cell" class="num" data-l="Last service">${s[0]?fmtDate(s[0].date):"–"}</span><span role="cell" class="num r" data-l="Service spend">${money(s.reduce((a,x)=>a+(x.total||0),0))}</span></div>`}).join("");
  const vehicles=S.vehicles.length?`<h2>Vehicles</h2><div class="card pt-table" role="table" aria-label="Vehicles"><div class="pt-tr pt-vr pt-th" role="row"><span role="columnheader">Plate</span><span role="columnheader">Name</span><span role="columnheader" class="r">Fill-ups</span><span role="columnheader" class="r">Services</span><span role="columnheader">Last service</span><span role="columnheader" class="r">Service spend</span></div>${veh}</div>`:"";
  return `<h1>${wide?"Users":"Account"}</h1><div class="card"><div class="row" style="padding-top:0"><div style="display:flex;gap:12px;align-items:center">${u.picture?`<img src="${esc(u.picture)}" alt="" width="44" height="44" style="border-radius:50%" referrerpolicy="no-referrer">`:""}<div><div class="t">${g?esc(u.name||"Google account"):"Offline mode"}</div><div class="s">${g?esc(u.email||""):"Data stays on this device only"}</div></div></div><span class="pill ${g?"":"na"}">${g?"DRIVE":"LOCAL"}</span></div>
  <div class="btns">${g&&Gs.id?`<a class="lnk" href="https://docs.google.com/spreadsheets/d/${Gs.id}" target="_blank" rel="noopener">Open my Google Sheet</a>`:""}<button class="ghost" data-act="signout">${g?"Sign out":"Back to sign-in"}</button></div>
  ${g&&Gs.id?inlineSync():`<div class="err" style="color:var(--mute)">${esc(S.sync||"")}</div>`}</div>
  ${vehicles}
  <h2>About</h2><div class="card"><a class="row lnkrow" href="privacy.html"><span class="t">Privacy Policy</span><span class="s" aria-hidden="true">›</span></a><a class="row lnkrow" href="terms.html"><span class="t">Terms of Service</span><span class="s" aria-hidden="true">›</span></a></div>
  <h2>Appearance</h2><div class="card"><label style="margin-top:0">Theme</label>
  <div class="seg" role="group" aria-label="Theme">${[["system","System"],["light","Light"],["dark","Dark"]].map(([k,l])=>`<button data-theme="${k}" aria-pressed="${th===k}">${l}</button>`).join("")}</div>
  <label for="cur">Currency</label><select id="cur">${CURRENCIES.map(c=>`<option value="${c[0]}" ${Prefs.d.cur===c[0]?"selected":""}>${c[0]} (${c[1]}) · ${c[2]}</option>`).join("")}</select>
  <div class="s" style="color:var(--mute);font-size:13px;margin-top:8px">Currency is a display label only. Amounts are not converted.</div></div>`;
}

/* Inline action row: icon + label + status text + a button that shows a spinner while the async action runs */
function inlineSync(){
  const bad=/^Sync failed/.test(S.sync),b=S.syncing;
  return `<div class="ia"><span class="ia-i" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  <div class="ia-t"><b>Google Sheet</b><small class="${bad?"bad":""}" role="status">${esc(b?"Syncing with your Drive...":S.sync||"Pull the latest entries from your Drive")}</small></div>
  <button class="pri ia-b" data-act="pull" ${b?'disabled aria-busy="true"':""}>${b?'<span class="spin" aria-hidden="true"></span>Syncing':"Sync now"}</button></div>`;
}
