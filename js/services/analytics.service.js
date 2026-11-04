/* AnalyticsService */
const AnalyticsService={
  /* Exact: full-tank method. km between full fills / litres added since the previous full fill.
     Estimate (only when there is no exact figure): odometer readings alone, never presented as exact.
       per row  = (this odometer - previous odometer) / litres of the previous refill (that fuel powered the drive)
       overall  = (last odometer - first odometer) / litres of every refill except the last */
  /* Entries without an odometer still count for litres and cost, and add fuel to the next full-tank interval; they just give no distance. */
  compute(logs){
    let base=null,acc=0,out=[],tl=0,tk=0,cost=0,prev=null;
    logs.forEach(e=>{
      cost+=e.liters*e.price-(e.subsidy||0);let eff=null,km=null,lt=null;acc+=e.liters;
      const has=e.odometer!=null;
      if(e.full&&has){if(base!==null){km=e.odometer-base;lt=acc;eff=km/lt;tl+=lt;tk+=km}base=e.odometer;acc=0}
      const dk=has&&prev?e.odometer-prev.odometer:0,pl=has&&prev?prev.liters:0;
      out.push({...e,eff,km,lt,dk,pl,est:eff===null&&dk>0&&pl>0?dk/pl:null});
      if(has)prev=e;
    });
    const od=logs.filter(x=>x.odometer!=null);
    const span=od.length>1?od.at(-1).odometer-od[0].odometer:0;
    const used=od.slice(0,-1).reduce((s,x)=>s+x.liters,0);
    const estAvg=span>0&&used>0?span/used:null;
    const approx=!tl&&estAvg!==null;
    const vals=(approx?out.map(x=>x.est):out.map(x=>x.eff)).filter(x=>x!==null);
    const odoCost=od.reduce((s,x)=>s+x.liters*x.price-(x.subsidy||0),0);
    return{rows:out,approx,odoCount:od.length,avg:tl?tk/tl:estAvg,last:vals.at(-1)??null,best:vals.length?Math.max(...vals):null,
      spend:cost,costKm:tk&&od.length>1&&span>0?odoCost/span:null,km:span}
  }
};
