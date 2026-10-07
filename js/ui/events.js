/* Click / change handlers, sync */
document.addEventListener("click",async e=>{
  const t=e.target.closest("button,.sheet-bg");if(!t)return;
  if(t.id==="sheet"&&e.target===t)return closeSheet();
  if(t.dataset.t){S.tab=t.dataset.t;return render()}
  if(t.dataset.theme){Prefs.set("theme",t.dataset.theme);return render()}
  if(t.dataset.del){try{await api("DELETE","/logs/"+t.dataset.del)}catch(e){alert(e.message)}return refresh()}
  if(t.dataset.rmcar){if(confirm("Remove this vehicle and all its entries?")){try{await api("DELETE","/vehicles/"+encodeURIComponent(t.dataset.rmcar))}catch(e){alert(e.message)}refresh()}return}
  const a=t.dataset.act;if(!a)return;
  if(a==="close")closeSheet();
  if(a==="addlog")logForm();
  if(a==="addcar")carForm();
  if(a==="savelog")guard(async()=>{const sub=$("#f_sub").checked;if(sub&&!(+$("#f_s").value>0))throw new Error("Enter the subsidy amount, or switch the subsidy off");await api("POST","/logs",{vehicleId:S.vid,date:$("#f_d").value,odometer:$("#f_o").value,liters:$("#f_l").value,price:$("#f_p").value,subsidy:sub?$("#f_s").value:0,full:$("#f_f").checked});closeSheet();refresh()});
  if(a==="savecar")guard(async()=>{const v=await api("POST","/vehicles",{name:$("#c_n").value.trim(),plate:$("#c_p").value.trim()});S.vid=v.id;closeSheet();refresh()});
  if(a==="signin")doSignIn();
  if(a==="local"){Auth.mode="local";localStorage.setItem("petrol-mode","local");S.sync="";DB.load();refresh()}
  if(a==="signout"){Auth.signOut();S.sync="";S.vid=null;refresh()}
  if(a==="pull")doSync();
  if(["xlsx","pdf","csv"].includes(a))exportReport(a);
});
document.addEventListener("change",e=>{
  const i=e.target.id;
  if(i==="cur"){Prefs.set("cur",e.target.value);render()}
  if(i==="veh"){S.vid=e.target.value;refresh()}
  if(i==="rm"&&e.target.value){S.month=e.target.value;refresh()}
  if(i==="rv"){S.rv=e.target.value;refresh()}
});
async function doSignIn(){
  try{S.sync="Signing in...";render();await Auth.signIn(false);DB.load();await SyncService.pull();S.sync="";S.vid=null}
  catch(err){Auth.mode=null;S.sync=err.message}
  refresh();
}
async function doSync(){
  try{await SyncService.pull();S.sync="Synced with Google Drive ✓"}catch(err){S.sync="Sync failed: "+err.message}
  refresh();
}
