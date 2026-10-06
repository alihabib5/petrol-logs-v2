/* API Gateway: routes REST-style calls to services */
const traffic=[];
async function api(method,path,body){
  const t=performance.now();let svc,res;
  try{
    const [,r,id]=path.split("?")[0].split("/");const q=new URLSearchParams(path.split("?")[1]||"");
    if(r==="vehicles"){svc="VehicleService";res=method==="GET"?VehicleService.list():method==="POST"?await VehicleService.add(body):await VehicleService.remove(decodeURIComponent(id))}
    else if(r==="logs"){svc="FuelLogService";res=method==="GET"?FuelLogService.list(q.get("vehicle")):method==="POST"?await FuelLogService.add(body):await FuelLogService.remove(id)}
    else if(r==="analytics"){svc="AnalyticsService";res=AnalyticsService.compute(FuelLogService.list(q.get("vehicle")))}
    else if(r==="reports"){svc="ReportService";res=ReportService.build(q.get("month"),q.get("vehicle"))}
    else throw new Error("404");
    traffic.unshift({ok:1,m:method,p:path,svc,ms:(performance.now()-t)|0,at:new Date().toLocaleTimeString()});
    traffic.length=Math.min(traffic.length,40);return res;
  }catch(e){traffic.unshift({ok:0,m:method,p:path,svc:svc||"gateway",ms:0,at:new Date().toLocaleTimeString(),err:e.message});throw e}
}
