/* ReportService */
const ReportService={build(m,rv){
  const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
  const items=(rv==="*"?DB.v:DB.v.filter(v=>v.id===rv)).map(v=>{
    const rows=AnalyticsService.compute(FuelLogService.list(v.id)).rows.filter(x=>x.date.slice(0,7)===m),done=rows.filter(x=>x.eff!==null);
    const gross=sum(rows,x=>x.liters*x.price),subsidy=sum(rows,x=>x.subsidy||0),km=sum(done,x=>x.km),lt=sum(done,x=>x.lt);
    return{v,rows,s:{fills:rows.length,litres:sum(rows,x=>x.liters),gross,subsidy,net:gross-subsidy,km,lt,avg:lt?km/lt:null}};
  });
  const t={fills:0,litres:0,gross:0,subsidy:0,net:0,km:0,lt:0};
  items.forEach(i=>{for(const k in t)t[k]+=i.s[k]});t.avg=t.lt?t.km/t.lt:null;
  return{month:m,items,t};
}};
