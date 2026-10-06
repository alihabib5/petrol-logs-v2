/* account view */
function viewAccount(){
  const g=Auth.mode==="google",u=Auth.user||{};
  return `<h1>Account</h1><div class="card"><div class="row" style="padding-top:0"><div style="display:flex;gap:12px;align-items:center">${u.picture?`<img src="${esc(u.picture)}" alt="" width="44" height="44" style="border-radius:50%" referrerpolicy="no-referrer">`:""}<div><div class="t">${g?esc(u.name||"Google account"):"Offline mode"}</div><div class="s">${g?esc(u.email||""):"Data stays on this device only"}</div></div></div><span class="pill ${g?"":"na"}">${g?"DRIVE":"LOCAL"}</span></div>
  <div class="btns">${g&&Gs.id?`<a class="lnk" href="https://docs.google.com/spreadsheets/d/${Gs.id}" target="_blank" rel="noopener">Open my Google Sheet</a><button class="ghost" data-act="pull">Sync now</button>`:""}<button class="ghost" data-act="signout">${g?"Sign out":"Back to sign-in"}</button></div>
  <div class="err" style="color:var(--mute)">${esc(S.sync||"")}</div></div>
  <h2>Architecture</h2><div class="card arch">
  <div class="node"><b>Client</b>Mobile-first web UI (hosted on Vercel)</div><div class="arrow">↓</div>
  <div class="node"><b>API Gateway</b>/vehicles · /logs · /analytics · /reports</div><div class="arrow">↓</div>
  <div class="svcs"><div class="node"><b>Vehicle</b>Service</div><div class="node"><b>FuelLog</b>Service</div><div class="node"><b>Report</b>Service</div></div><div class="arrow">↓</div>
  <div class="node"><b>Google Sign-In + Sheets API</b>OAuth, drive.file scope</div><div class="arrow">↓</div>
  <div class="node"><b>Your own Google Drive</b>Sheet "Petrol Log" · tab = plate number</div></div>
  <h2>Gateway traffic</h2><div class="card log">${traffic.map(t=>`<div>${t.at} <b>${t.m}</b> ${esc(t.p)} → ${t.svc} ${t.ok?`✓ ${t.ms}ms`:`✗ ${esc(t.err)}`}</div>`).join("")||"No requests yet."}</div>`;
}
