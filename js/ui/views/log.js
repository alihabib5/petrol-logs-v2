/* log view */
const PEN='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',CROSS='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function viewLog(){
  const d=S.data;let h="";
    h=`<h1>Fuel Log</h1>${picker()}<div class="card" style="margin-top:14px">`;
    const r=d?[...d.rows].reverse():[];
    h+=r.length?r.map(x=>`<div class="row"><div><div class="t num">${x.date} · ${x.odometer.toLocaleString()} km</div><div class="s num">${x.liters} L × Rs ${x.price}${x.subsidy?` − Rs ${x.subsidy} subsidy`:""} = ${money(x.liters*x.price-(x.subsidy||0))}${x.full?"":" · partial"}</div></div>
      <div style="display:flex;gap:8px;align-items:center"><span class="pill num ${x.eff===null?"na":""}" ${x.eff===null&&x.est?`title="Estimate from odometer readings"`:""}>${x.eff!==null?x.eff.toFixed(1):x.est?"~"+x.est.toFixed(1):"–"}</span><button class="ghost" style="padding:0 12px" aria-label="Edit entry" data-edit="${x.id}">${PEN}</button><button class="ghost" style="padding:0 12px" aria-label="Delete entry" data-del="${x.id}">${CROSS}</button></div></div>`).join(""):`<div class="empty">No entries yet.</div>`;
    h+=`</div>`;if(S.vid)h+=`<button class="pri fab" data-act="addlog">+ Fill-up</button>`;
  return h;
}
