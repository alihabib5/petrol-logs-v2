/* log view */
function viewLog(){
  const d=S.data;let h="";
    h=`<h1>Fuel Log</h1>${picker()}<div class="card" style="margin-top:14px">`;
    const r=d?[...d.rows].reverse():[];
    h+=r.length?r.map(x=>`<div class="row"><div><div class="t num">${x.date} · ${x.odometer.toLocaleString()} km</div><div class="s num">${x.liters} L × Rs ${x.price}${x.subsidy?` − Rs ${x.subsidy} subsidy`:""} = ${money(x.liters*x.price-(x.subsidy||0))}${x.full?"":" · partial"}</div></div>
      <div style="display:flex;gap:8px;align-items:center"><span class="pill num ${x.eff===null?"na":""}">${x.eff===null?"–":x.eff.toFixed(1)}</span><button class="ghost" style="padding:0 12px" aria-label="Delete entry" data-del="${x.id}">✕</button></div></div>`).join(""):`<div class="empty">No entries yet.</div>`;
    h+=`</div>`;if(S.vid)h+=`<button class="pri fab" data-act="addlog">+ Fill-up</button>`;
  return h;
}
