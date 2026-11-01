/* Click / change handlers, sync */
document.addEventListener("click",async e=>{
  if(S.lfOpen&&!e.target.closest("#lfPanel,[data-act=lfopen]"))lfToggle(false);
  const t=e.target.closest("button,.sheet-bg");if(!t)return;
  if(t.id==="sheet"&&e.target===t)return closeSheet();
  if(t.dataset.t){S.tab=t.dataset.t;return render()}
  if(t.dataset.theme){Prefs.set("theme",t.dataset.theme);return render()}
  if(t.dataset.del){try{await api("DELETE","/logs/"+t.dataset.del)}catch(e){alert(e.message)}return refresh()}
  if(t.dataset.rmcar){if(confirm("Remove this vehicle and all its entries?")){try{await api("DELETE","/vehicles/"+encodeURIComponent(t.dataset.rmcar))}catch(e){alert(e.message)}refresh()}return}
  if(t.dataset.cal)return Cal.open(t);
  if(t.dataset.act==="lfopen"){lfToggle(!S.lfOpen);if(S.lfOpen)setTimeout(()=>$("#lf_q")?.focus(),30);return}
  if(t.dataset.act==="lfclose"){lfToggle(false);document.querySelector("[data-act=lfopen]")?.focus();return}
  if(t.dataset.act==="lfclear"){S.lf={...LF0};$("#lf_q").value="";["tmin","tmax","kmin","kmax"].forEach(k=>$("#lf_"+k).value="");$("#lf_type").value="all";drawLog();return}
  if(t.dataset.act==="lfsel0"){S.sel.clear();document.querySelectorAll("#dtBody .dt-ck").forEach(c=>{c.checked=false;c.closest(".dt-r").classList.remove("on")});drawSel();return}
  if(t.dataset.act==="lfdel"){
    const ids=[...S.sel];if(!ids.length||S.deleting)return;
    if(!confirm("Delete "+ids.length+" fill-up"+(ids.length>1?"s":"")+"? This cannot be undone."))return;
    S.deleting=true;drawLog();
    for(const id of ids){try{await api("DELETE","/logs/"+id);S.sel.delete(id)}catch(err){alert(err.message);break}}
    S.deleting=false;refresh();return}
  if(t.dataset.edit)return logForm(S.data.rows.find(x=>x.id===t.dataset.edit));
  const a=t.dataset.act;if(!a)return;
  if(a==="close")closeSheet();
  if(a==="addlog")logForm();
  if(a==="addcar")carForm();
  if(a==="savelog")guard(async()=>{const sub=$("#f_sub").checked;if(sub&&!(+$("#f_s").value>0))throw new Error("Enter the subsidy amount, or switch the subsidy off");const id=t.dataset.id;await api(id?"PUT":"POST",id?"/logs/"+id:"/logs",{vehicleId:S.vid,date:$("#f_d").value,odometer:$("#f_o").value,liters:$("#f_l").value,price:$("#f_p").value,subsidy:sub?$("#f_s").value:0,full:$("#f_f").checked});closeSheet();refresh()});
  if(a==="savecar")guard(async()=>{const v=await api("POST","/vehicles",{name:$("#c_n").value.trim(),plate:$("#c_p").value.trim()});S.vid=v.id;closeSheet();refresh()});
  if(a==="signin")doSignIn();
  if(a==="local"){Auth.mode="local";localStorage.setItem("petrol-mode","local");S.sync="";DB.load();refresh()}
  if(a==="signout"){Auth.signOut();S.sync="";S.vid=null;refresh()}
  if(a==="pull")doSync();
  if(["xlsx","pdf","csv"].includes(a))exportReport(a);
});
document.addEventListener("input",e=>{
  const i=e.target.id;
  if(i&&i.startsWith("lf_")){S.lf[i.slice(3)]=e.target.value;drawLog()}
});
document.addEventListener("change",e=>{
  const i=e.target.id;
  if(e.target.dataset&&e.target.dataset.row){const on=e.target.checked;on?S.sel.add(e.target.dataset.row):S.sel.delete(e.target.dataset.row);e.target.closest(".dt-r").classList.toggle("on",on);drawSel();return}
  if(i==="dt_all"){const on=e.target.checked;logFiltered().forEach(x=>on?S.sel.add(x.id):S.sel.delete(x.id));document.querySelectorAll("#dtBody .dt-ck").forEach(c=>{c.checked=on;c.closest(".dt-r").classList.toggle("on",on)});drawSel();return}
  if(i==="cur"){Prefs.set("cur",e.target.value);render()}
  if(i==="veh"){S.vid=e.target.value;S.sel.clear();refresh()}
  if(i==="rm"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(e.target.value)){S.month=e.target.value;refresh()}
  if(i==="rv"){S.rv=e.target.value;refresh()}
});
async function doSignIn(){
  S.busy=true;S.sync="";render();
  try{await Auth.signIn(false);DB.load();await SyncService.pull();S.vid=null}
  catch(err){Auth.mode=null;S.sync=err.message}
  S.busy=false;refresh();
}
async function doSync(){
  if(S.syncing)return;
  S.syncing=true;S.sync="";render();
  try{await Promise.all([SyncService.pull(),new Promise(r=>setTimeout(r,600))]);S.sync="Synced with Google Drive ✓"}catch(err){S.sync="Sync failed: "+err.message}
  S.syncing=false;refresh();
}

function lfToggle(open){
  S.lfOpen=open;const p=$("#lfPanel");if(!p)return;
  p.classList.toggle("open",open);document.querySelector("[data-act=lfopen]")?.setAttribute("aria-expanded",open);
}
document.addEventListener("keydown",ev=>{
  if(ev.key==="Escape"&&S.lfOpen&&!$("#cal").classList.contains("on")){lfToggle(false);document.querySelector("[data-act=lfopen]")?.focus()}
});
