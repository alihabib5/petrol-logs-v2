/* Data refresh + page render */
async function refresh(){
  S.vehicles=await api("GET","/vehicles");
  if(!S.vehicles.find(v=>v.id===S.vid))S.vid=S.vehicles[0]?.id||null;
  S.data=S.vid?await api("GET","/analytics?vehicle="+encodeURIComponent(S.vid)):null;
  S.report=await api("GET","/reports?month="+S.month+"&vehicle="+encodeURIComponent(S.rv));
  render();
}

function render(){
  const d=S.data,app=$("#app");
  document.querySelector(".tabs").style.display=Auth.mode?"":"none";
  if(!Auth.mode){$("#tabs").innerHTML="";app.innerHTML=viewLogin();return}
  $("#tabs").innerHTML=TABS.map(([k,l])=>`<button role="tab" aria-selected="${S.tab===k}" data-t="${k}"><svg viewBox="0 0 24 24">${IC[k==="cars"?"car":k]}</svg>${l}</button>`).join("");
  const views={home:viewHome,log:viewLog,rep:viewReports,cars:viewVehicles,srv:viewAccount};
  app.innerHTML=views[S.tab]();
}
