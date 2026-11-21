/* ReportService */
const ReportService={build(m,rv){
  const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
  const items=(rv==="*"?DB.v:DB.v.filter(v=>v.id===rv)).map(v=>{
    const rows=AnalyticsService.compute(FuelLogService.list(v.id)).rows.filter(x=>x.date.slice(0,7)===m),done=rows.filter(x=>x.eff!==null);
    const gross=sum(rows,x=>x.liters*x.price),subsidy=sum(rows,x=>x.subsidy||0),km=sum(done,x=>x.km),lt=sum(done,x=>x.lt);
    const est=rows.filter(x=>x.est!==null),ek=sum(est,x=>x.dk),el=sum(est,x=>x.pl); /* odometer estimate, used only when the month has no exact figure */
    return{v,rows,s:{fills:rows.length,litres:sum(rows,x=>x.liters),gross,subsidy,net:gross-subsidy,km,lt,ek,el,dist:sum(rows,x=>x.dk),avg:lt?km/lt:el?ek/el:null,approx:!lt&&el>0}};
  });
  const t={fills:0,litres:0,gross:0,subsidy:0,net:0,km:0,lt:0,ek:0,el:0,dist:0};
  items.forEach(i=>{for(const k in t)t[k]+=i.s[k]});t.avg=t.lt?t.km/t.lt:t.el?t.ek/t.el:null;t.approx=!t.lt&&t.el>0;
  /* litres and kWh never add up: with petrol/diesel and electric vehicles together, the amounts are kept apart and there is no overall average */
  const kinds=new Set(items.filter(i=>i.rows.length).map(i=>isEV(i.v)?"ev":"fuel"));
  t.mixed=kinds.size>1;t.unit=kinds.has("ev")&&!t.mixed?UNITS.ev:UNITS.fuel;
  t.kwh=sum(items.filter(i=>isEV(i.v)),i=>i.s.litres);t.litres-=t.kwh;
  if(t.mixed){t.avg=null;t.approx=false}
  return{month:m,items,t};
}};
