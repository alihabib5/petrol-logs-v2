/* ReportService */
const ReportService={build(m,rv){
  const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
  const items=(rv==="*"?DB.v:DB.v.filter(v=>v.id===rv)).map(v=>{
    const rows=AnalyticsService.compute(FuelLogService.list(v.id)).rows.filter(x=>x.date.slice(0,7)===m),done=rows.filter(x=>x.eff!==null);
    const gross=sum(rows,x=>x.liters*x.price),subsidy=sum(rows,x=>x.subsidy||0),km=sum(done,x=>x.km),lt=sum(done,x=>x.lt);
    const est=rows.filter(x=>x.est!==null),ek=sum(est,x=>x.dk),el=sum(est,x=>x.pl); /* odometer estimate, used only when the month has no exact figure */
    return{v,rows,s:{fills:rows.length,litres:sum(rows,x=>x.liters),gross,subsidy,net:gross-subsidy,km,lt,ek,el,avg:lt?km/lt:el?ek/el:null,approx:!lt&&el>0}};
  });
  const t={fills:0,litres:0,gross:0,subsidy:0,net:0,km:0,lt:0,ek:0,el:0};
  items.forEach(i=>{for(const k in t)t[k]+=i.s[k]});t.avg=t.lt?t.km/t.lt:t.el?t.ek/t.el:null;t.approx=!t.lt&&t.el>0;
  return{month:m,items,t};
}};
