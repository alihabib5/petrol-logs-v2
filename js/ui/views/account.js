/* account view */
function viewAccount(){
  const g=Auth.mode==="google",u=Auth.user||{};
  const th=Prefs.d.theme;
  return `<h1>Account</h1><div class="card"><div class="row" style="padding-top:0"><div style="display:flex;gap:12px;align-items:center">${u.picture?`<img src="${esc(u.picture)}" alt="" width="44" height="44" style="border-radius:50%" referrerpolicy="no-referrer">`:""}<div><div class="t">${g?esc(u.name||"Google account"):"Offline mode"}</div><div class="s">${g?esc(u.email||""):"Data stays on this device only"}</div></div></div><span class="pill ${g?"":"na"}">${g?"DRIVE":"LOCAL"}</span></div>
  <div class="btns">${g&&Gs.id?`<a class="lnk" href="https://docs.google.com/spreadsheets/d/${Gs.id}" target="_blank" rel="noopener">Open my Google Sheet</a>`:""}<button class="ghost" data-act="signout">${g?"Sign out":"Back to sign-in"}</button></div>
  ${g&&Gs.id?inlineSync():`<div class="err" style="color:var(--mute)">${esc(S.sync||"")}</div>`}</div>
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
