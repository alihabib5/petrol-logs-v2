/* AnalyticsService */
const AnalyticsService={
  /* Exact: full-tank method. km between full fills / litres added since the previous full fill.
     Estimate (only when there is no exact figure): odometer readings alone, never presented as exact.
       per row  = (this odometer - previous odometer) / litres of the previous refill (that fuel powered the drive)
       overall  = (last odometer - first odometer) / litres of every refill except the last */
  compute(logs){
    let base=null,acc=0,out=[],tl=0,tk=0,cost=0;
    logs.forEach((e,i)=>{
      cost+=e.liters*e.price-(e.subsidy||0);let eff=null,km=null,lt=null;acc+=e.liters;
      if(e.full){if(base!==null){km=e.odometer-base;lt=acc;eff=km/lt;tl+=lt;tk+=km}base=e.odometer;acc=0}
      const dk=i?e.odometer-logs[i-1].odometer:0,pl=i?logs[i-1].liters:0;
      out.push({...e,eff,km,lt,dk,pl,est:eff===null&&dk>0&&pl>0?dk/pl:null});
    });
    const span=logs.length>1?logs.at(-1).odometer-logs[0].odometer:0;
    const used=logs.slice(0,-1).reduce((s,x)=>s+x.liters,0);
    const estAvg=span>0&&used>0?span/used:null;
    const approx=!tl&&estAvg!==null;
    const vals=(approx?out.map(x=>x.est):out.map(x=>x.eff)).filter(x=>x!==null);
    return{rows:out,approx,avg:tl?tk/tl:estAvg,last:vals.at(-1)??null,best:vals.length?Math.max(...vals):null,
      spend:cost,costKm:tk&&logs.length>1?cost/span:null,km:span}
  }
};
