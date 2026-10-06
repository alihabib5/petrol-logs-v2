/* Sign-in screen */
function viewLogin(){
  const ok=Auth.configured();
  return `<div class="login"><div style="max-width:280px;margin:0 auto">${gauge(19)}</div>
  <h1 style="margin-top:6px">Petrol Log</h1>
  <p>Track fuel, see your km/L and get monthly reports. Your data is saved in your own Google Drive.</p>
  <button class="pri" style="width:100%" data-act="signin" ${ok?"":"disabled"}>Sign in with Google</button>
  <button class="ghost" style="width:100%;margin-top:10px" data-act="local">Continue without sign-in</button>
  <p class="note">${ok?"The app can only see the Petrol Log sheet it creates, not your other files.":"Setup needed: add your Google client ID in js/config.js (see README)."}</p>
  <p class="note err">${esc(S.sync||"")}</p><p class="note"><a href="privacy.html">Privacy</a></p></div>`;
}
