/* Data refresh + page render */
async function refresh(){
  S.vehicles=await api("GET","/vehicles");
  if(!S.vehicles.find(v=>v.id===S.vid))S.vid=S.vehicles[0]?.id||null;
  S.data=S.vid?await api("GET","/analytics?vehicle="+encodeURIComponent(S.vid)):null;
  S.report=await api("GET","/reports?month="+S.month+"&vehicle="+encodeURIComponent(S.rv));
  render();
}

function render(){
  const app=$("#app"),view=Auth.mode?S.tab:"login";
  S.entering=view!==S.view;S.view=view;if(S.entering)S.lfOpen=false; /* the filter dropdown starts closed on every visit */ /* a view change animates in; re-rendering the same view does not replay it */
  document.querySelector(".tabs").style.display=Auth.mode?"":"none";
  app.classList[Auth.mode?"remove":"add"]("landing");
  if(!Auth.mode){$("#tabs").innerHTML="";app.classList.remove("enter");app.innerHTML=viewLogin();return settle(app)}
  const tabs=$("#tabs");
  if(!tabs.children.length)tabs.innerHTML=TABS.map(([k,l])=>`<button role="tab" data-t="${k}"><svg viewBox="0 0 24 24">${IC[k==="cars"?"car":k]}</svg>${l}</button>`).join("");
  tabs.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",b.dataset.t===S.tab)); /* same buttons stay in the DOM, so the highlight can transition */
  const views={home:viewHome,log:viewLog,rep:viewReports,cars:viewVehicles,srv:viewAccount};
  app.innerHTML=reconnectBanner()+views[S.tab]();
  if(S.tab==="log"&&$("#dtBody"))drawLog(); /* sets the select-all checkbox state */
  app.classList[S.entering?"add":"remove"]("enter");
  if(S.entering)[...app.children].forEach((c,i)=>c.style.setProperty("--d",Math.min(i,8)*.06+"s"));
  settle(app);
}
/* Elements that carry data-to start at an "empty" value (gauge arc, chart bars); one frame later they move to the real value so the CSS transition runs */
function settle(app){
  requestAnimationFrame(()=>requestAnimationFrame(()=>app.querySelectorAll("[data-to]").forEach(e=>{e.style.setProperty(e.dataset.prop,e.dataset.to)})));
}
