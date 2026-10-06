/* Shared UI pieces */
function picker(){
  if(!S.vehicles.length)return"";
  return `<label for="veh" style="margin-top:0">Vehicle</label><select id="veh" aria-label="Vehicle">${S.vehicles.map(v=>`<option value="${esc(v.id)}" ${v.id===S.vid?"selected":""}>${esc(v.plate)} · ${esc(v.name)}</option>`).join("")}</select>`;
}
function gauge(avg){
  const max=30,pct=avg?Math.min(avg/max,1):0,L=Math.PI*90,off=L*(1-pct);
  return `<svg viewBox="0 0 220 125" role="img" aria-label="Gauge"><path d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="var(--line)" stroke-width="16" stroke-linecap="round"/>
  <path class="arc" d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="var(--acc)" stroke-width="16" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${off}" style="transition:stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)"/></svg>`;
}
