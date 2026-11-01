/* log view: filterable table (cards on phones, columns on wide screens) with row selection and bulk delete */
const PEN='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',CROSS='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',LENS='<svg class="dt-lens" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const LF0={q:"",tmin:"",tmax:"",type:"all",kmin:"",kmax:""};
const rowTotal=x=>x.liters*x.price-(x.subsidy||0);
const rowKmL=x=>x.eff!==null?x.eff:x.est;                       /* exact km/L, else the odometer estimate, else null */
const numOrNull=v=>{const s=String(v).trim();if(s==="")return null;const n=+s.replace(",",".");return Number.isFinite(n)?n:null};

/* all entries, newest first, numbered oldest = 1 */
function logAll(){return S.data?S.data.rows.map((x,i)=>({...x,n:i+1})).reverse():[]}
function logFiltered(){
  const f=S.lf,q=f.q.trim().toLowerCase().replace(/,/g,""),tmin=numOrNull(f.tmin),tmax=numOrNull(f.tmax),kmin=numOrNull(f.kmin),kmax=numOrNull(f.kmax);
  return logAll().filter(x=>{
    if(q&&!(x.date+" "+x.odometer).toLowerCase().includes(q))return false;
    if(f.type==="full"&&!x.full||f.type==="partial"&&x.full)return false;
    const t=rowTotal(x),k=rowKmL(x);
    if(tmin!==null&&t<tmin||tmax!==null&&t>tmax)return false;
    if((kmin!==null||kmax!==null)&&k===null)return false;          /* no km/L yet: can't match a km/L filter */
    if(kmin!==null&&k<kmin||kmax!==null&&k>kmax)return false;
    return true;
  });
}
const lfActive=()=>Object.keys(LF0).filter(k=>String(S.lf[k])!==String(LF0[k])).length;

function logRowHTML(x){
  const on=S.sel.has(x.id),total=money(rowTotal(x));
  const label=`${x.date}, ${x.odometer.toLocaleString()} km`;
  return `<div class="dt-r ${on?"on":""}" role="row"><label class="dt-c"><input type="checkbox" class="dt-ck" data-row="${esc(x.id)}" aria-label="Select ${label}" ${on?"checked":""}></label>
  <div class="dt-m" role="cell"><div class="t num">${x.date} · ${x.odometer.toLocaleString()} km</div><div class="s num"><span class="dt-n">#${x.n} · </span>${x.liters} L × Rs ${x.price}${x.subsidy?` − Rs ${x.subsidy} subsidy`:""}<span class="sm"> = ${total}${x.full?"":" · partial"}</span></div></div>
  <span class="dt-t num" role="cell">${total}</span>
  <span class="dt-b" role="cell"><span class="badge ${x.full?"full":"part"}">${x.full?"Full tank":"Partial"}</span></span>
  <span class="dt-k" role="cell"><span class="pill num ${x.eff===null?"na":""}" ${x.eff===null&&x.est?`title="Estimate from odometer readings"`:""}>${x.eff!==null?x.eff.toFixed(1):x.est?"~"+x.est.toFixed(1):"–"}</span></span>
  <div class="dt-a" role="cell"><button class="ghost" style="padding:0 12px" aria-label="Edit entry" data-edit="${esc(x.id)}">${PEN}</button><button class="ghost" style="padding:0 12px" aria-label="Delete entry" data-del="${esc(x.id)}">${CROSS}</button></div></div>`;
}
function logRowsHTML(list){
  return list.length?list.map(logRowHTML).join(""):`<div class="empty">No fill-ups match these filters.<br><br><button class="ghost" data-act="lfclear">Clear filters</button></div>`;
}
const logSelHTML=()=>S.sel.size?`<span><b>${S.sel.size}</b> selected</span><span class="dt-selb"><button class="ghost" data-act="lfsel0">Clear</button><button class="ghost danger" data-act="lfdel" ${S.deleting?"disabled aria-busy=\"true\"":""}>${S.deleting?"Deleting…":"Delete selected"}</button></span>`:"";
const logCountText=(n,all)=>n===all?`${all} fill-up${all===1?"":"s"}`:`Showing ${n} of ${all}`;

/* redraw only the rows, count, select-all and bulk bar, so typing in a filter never loses focus */
function drawLog(){
  const list=logFiltered(),all=logAll(),ids=new Set(all.map(x=>x.id));
  S.sel=new Set([...S.sel].filter(id=>ids.has(id)));
  $("#dtBody").innerHTML=logRowsHTML(list);
  $("#dtCount").textContent=logCountText(list.length,all.length);
  drawSel();
  const c=lfActive();$("#lfN").textContent=c?` · ${c}`:"";
}
/* selection changes update in place (no row redraw), so keyboard focus stays on the checkbox */
function drawSel(){
  const vis=logFiltered().map(x=>x.id),n=vis.filter(id=>S.sel.has(id)).length,a=$("#dt_all");
  a.checked=vis.length>0&&n===vis.length;a.indeterminate=n>0&&n<vis.length;a.disabled=!vis.length;
  $("#dtSel").innerHTML=logSelHTML();$("#dtSel").hidden=!S.sel.size;
}

function viewLog(){
  const f=S.lf,all=logAll(),list=logFiltered(),ids=new Set(all.map(x=>x.id));
  S.sel=new Set([...S.sel].filter(id=>ids.has(id)));
  let h=`<h1>Fuel Log</h1>${picker()}`;
  if(!all.length)h+=`<div class="card" style="margin-top:14px"><div class="empty">No entries yet.</div></div>`;
  else{
    const vis=list.map(x=>x.id),n=vis.filter(id=>S.sel.has(id)).length,c=lfActive();
    h+=`<div class="card dt" style="margin-top:14px">
    <button class="ghost dt-ftog" data-act="lfopen" aria-expanded="${S.lfOpen}" aria-controls="lfPanel">Filters<span id="lfN">${c?` · ${c}`:""}</span></button>
    <div class="dt-fil ${S.lfOpen?"open":""}" id="lfPanel">
      <div class="dt-f dt-f-q"><label for="lf_q">Search</label><div class="dt-sw">${LENS}<input id="lf_q" type="search" inputmode="search" placeholder="Date or km" value="${esc(f.q)}" autocomplete="off"></div></div>
      <div class="dt-f"><label for="lf_tmin">Total (Rs)</label><div class="pair"><input id="lf_tmin" type="number" inputmode="decimal" min="0" placeholder="Min" value="${esc(f.tmin)}" aria-label="Minimum total"><input id="lf_tmax" type="number" inputmode="decimal" min="0" placeholder="Max" value="${esc(f.tmax)}" aria-label="Maximum total"></div></div>
      <div class="dt-f"><label for="lf_type">Type</label><select id="lf_type"><option value="all" ${f.type==="all"?"selected":""}>All</option><option value="full" ${f.type==="full"?"selected":""}>Full tank</option><option value="partial" ${f.type==="partial"?"selected":""}>Partial</option></select></div>
      <div class="dt-f"><label for="lf_kmin">km/L</label><div class="pair"><input id="lf_kmin" type="number" inputmode="decimal" min="0" step="0.1" placeholder="Min" value="${esc(f.kmin)}" aria-label="Minimum km per litre"><input id="lf_kmax" type="number" inputmode="decimal" min="0" step="0.1" placeholder="Max" value="${esc(f.kmax)}" aria-label="Maximum km per litre"></div></div>
    </div>
    <div class="dt-bar"><span id="dtCount" role="status">${logCountText(list.length,all.length)}</span><button class="ghost dt-clr" data-act="lfclear">Clear filters</button></div>
    <div class="dt-sel" id="dtSel" role="status" ${S.sel.size?"":"hidden"}>${logSelHTML()}</div>
    <div class="dt-tbl" role="table" aria-label="Fill-ups">
      <div class="dt-r dt-h" role="row"><label class="dt-c"><input type="checkbox" class="dt-ck" id="dt_all" aria-label="Select all shown fill-ups" ${vis.length&&n===vis.length?"checked":""} ${vis.length?"":"disabled"}><span class="dt-sa">Select all</span></label><span class="dt-hm" role="columnheader">Fill-up</span><span class="dt-ht" role="columnheader">Total</span><span class="dt-hb" role="columnheader">Type</span><span class="dt-hk" role="columnheader">km/L</span><span class="dt-ha"></span></div>
      <div id="dtBody" role="rowgroup">${logRowsHTML(list)}</div>
    </div></div>`;
  }
  if(S.vid)h+=`<button class="pri fab" data-act="addlog">+ Fill-up</button>`;
  return h;
}
