/* API Gateway: routes REST-style calls to services */
async function api(method,path,body){
  const [,r,id]=path.split("?")[0].split("/");const q=new URLSearchParams(path.split("?")[1]||"");
  if(r==="vehicles")return method==="GET"?VehicleService.list():method==="POST"?await VehicleService.add(body):await VehicleService.remove(decodeURIComponent(id));
  if(r==="logs")return method==="GET"?FuelLogService.list(q.get("vehicle")):method==="POST"?await FuelLogService.add(body):method==="PUT"?await FuelLogService.update(id,body):await FuelLogService.remove(id);
  if(r==="analytics")return AnalyticsService.compute(FuelLogService.list(q.get("vehicle")));
  if(r==="reports")return ReportService.build(q.get("month"),q.get("vehicle"));
  throw new Error("404");
}
