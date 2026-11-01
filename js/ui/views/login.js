/* Sign-in screen: full-width hero (ported from the Hero 37 layout, plain HTML/CSS) */
function viewLogin(){
  const ok=Auth.configured(),busy=S.busy,off=ok&&!busy?"":"disabled";
  const anim=S.entering; /* plays when the screen appears, not on every re-render (e.g. the sign-in spinner) */
  const d=s=>`style="--d:${s}s"`;
  const arrow='<svg class="arr" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return `<section class="hero ${anim?"anim":""}"><div class="glow" aria-hidden="true"></div>
  <nav class="hero-nav a drop" ${d(.05)}><span class="brand"><span class="logo" aria-hidden="true">${gauge(19,false)}</span>Petrol Log</span>
    <button class="hero-link" data-act="signin" ${off}>Sign in</button></nav>
  <div class="hero-main"><div>
    <h1 class="hero-h"><span class="a" ${d(.35)}>Every litre,</span><span class="a" ${d(.51)}>every kilometre.</span></h1>
    <p class="hero-p a" ${d(.95)}>Track fuel, see your km/L and get monthly reports. Your data is saved in your own Google Drive.</p>
    <div class="hero-cta a" ${d(1.18)}>
      <button class="pri" data-act="signin" ${off} ${busy?'aria-busy="true"':""}>${busy?'<span class="spin" aria-hidden="true"></span>Signing in…':"Sign in with Google"+arrow}</button>
      <button class="ghost" data-act="local" ${busy?"disabled":""}>Continue without sign-in</button></div>
    <p class="hero-note a" ${d(1.3)}>${ok?"The app can only see the Petrol Log sheet it creates, not your other files.":"Setup needed: add your Google client ID in js/config.js (see README)."}</p>
    <p class="hero-note err" role="status">${esc(S.sync||"")}</p>
  </div>
  <div class="hero-foot"><div class="stats">
    <div class="stat-i a" ${d(1.4)}><b><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><circle cx="3" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="3" cy="11" r="1.5"/><circle cx="11" cy="11" r="1.5"/></svg>Your own Drive</b><span>Data stays yours</span></div>
    <div class="stat-i a" ${d(1.52)}><b><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><rect x="2" y="5.5" width="10" height="3" rx="1"/><rect x="5.5" y="2" width="3" height="10" rx="1"/></svg>Excel · PDF · CSV</b><span>Monthly reports</span></div></div>
    <p class="tag a" ${d(1.6)}>Know your km/L, your cost per km and what every tank really costs.</p></div>
  </div></section>`;
}
