/* Sign-in screen: one plain centred card (2.10.0 redesign; replaces the full-width animated hero) */
const LOGO='<span class="logo-s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/><path d="M3.8 10.5l6 1M14.2 11.5l6-1M12 14.2v6"/></svg></span>';
function viewLogin(){
  const ok=Auth.configured(),busy=S.busy,off=ok&&!busy?"":"disabled";
  const tick='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return `<section class="auth"><div class="auth-card">
    <div class="auth-brand">${LOGO}Safri</div>
    <h1>Every ride, every kilometre.</h1>
    <p>Track fuel or charging, services and what every kilometre costs, with monthly reports. Petrol, diesel or electric.</p>
    <ul class="auth-feats">
      <li>${tick}<span>Your data is saved in your own Google Drive</span></li>
      <li>${tick}<span>km per litre or per kWh, cost per km, subsidy</span></li>
      <li>${tick}<span>Monthly reports: Excel, PDF, CSV</span></li>
    </ul>
    <div class="auth-cta">
      <button class="pri" data-act="signin" ${off} ${busy?'aria-busy="true"':""}>${busy?'<span class="spin" aria-hidden="true"></span>Signing in…':"Sign in with Google"}</button>
      <button class="ghost" data-act="local" ${busy?"disabled":""}>Continue without sign-in</button>
    </div>
    <p class="auth-note">${ok?"The app can only see the Safri sheet it creates, not your other files.":"Setup needed: add your Google client ID in js/config.js (see README)."}</p>
    <p class="auth-note">By continuing you agree to the <a href="terms.html">Terms of Service</a> and <a href="privacy.html">Privacy Policy</a>.</p>
    <p class="auth-note err" role="status">${esc(S.sync||"")}</p>
  </div></section>`;
}
