/* Shared UI pieces */
function picker(){
  if(!S.vehicles.length)return"";
  return `<label for="veh" style="margin-top:0">Vehicle</label><select id="veh" aria-label="Vehicle">${S.vehicles.map(v=>`<option value="${esc(v.id)}" ${v.id===S.vid?"selected":""}>${esc(v.plate)} · ${esc(v.name)}</option>`).join("")}</select>`;
}
/* Page header shared by Home, Log and Service: title, vehicle picker and the page's primary action at top right */
const PLUS='<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
function vehSelect(){return S.vehicles.length?`<select id="veh" aria-label="Vehicle">${S.vehicles.map(v=>`<option value="${esc(v.id)}" ${v.id===S.vid?"selected":""}>${esc(v.plate)} · ${esc(v.name)}</option>`).join("")}</select>`:""}
/* title | picker | action on wide screens; on phones the action shares the title row and the picker takes the next row */
function pageTop(title,action){return `<div class="pt-top"><h1>${title}</h1><div class="pt-tools">${vehSelect()}</div>${action||""}</div>`}
/* live=true: the arc animates from where it was (or from empty on a new view) to the new value; live=false: static (logo) */
function gauge(avg,live=true,max=30){   /* max: top of the scale (30 km/L, 12 km/kWh) */
  const pct=avg?Math.min(avg/max,1):0,L=Math.PI*90,off=L*(1-pct);
  const from=live?(S.entering||S.gaugeOff==null?L:S.gaugeOff):off;
  if(live)S.gaugeOff=off;
  return `<svg viewBox="0 0 220 125" role="img" aria-label="Gauge"><path d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="var(--line)" stroke-width="16" stroke-linecap="round"/>
  <path class="arc" d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="var(--acc)" stroke-width="16" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${from}" ${live?`data-prop="stroke-dashoffset" data-to="${off}"`:""}/></svg>`;
}

/* Shown while a remembered Google account has no valid token: the app keeps working on saved data. */
function reconnectBanner(){
  if(Auth.mode!=="google"||!Auth.needsReconnect)return"";
  const b=S.reconnecting;
  return `<div class="recon" role="status"><div><b>Showing your saved data</b><small>${esc(!b&&/^Could not/.test(S.sync)?S.sync:"Reconnect Google to sync with your Drive.")}</small></div><button class="pri" data-act="reconnect" ${b?'disabled aria-busy="true"':""}>${b?'<span class="spin" aria-hidden="true"></span>Connecting':"Reconnect"}</button></div>`;
}
