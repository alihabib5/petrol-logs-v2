/* AnalyticsService */
const AnalyticsService={
  /* full-tank method: km between full fills / litres added since previous full fill */
  compute(logs){
    let base=null,acc=0,out=[],tl=0,tk=0,cost=0;
    logs.forEach(e=>{
      cost+=e.liters*e.price-(e.subsidy||0);let eff=null,km=null,lt=null;acc+=e.liters;
      if(e.full){if(base!==null){km=e.odometer-base;lt=acc;eff=km/lt;tl+=lt;tk+=km}base=e.odometer;acc=0}
      out.push({...e,eff,km,lt});
    });
    const effs=out.filter(x=>x.eff!==null).map(x=>x.eff);
    return{rows:out,avg:tl?tk/tl:null,last:effs.at(-1)??null,best:effs.length?Math.max(...effs):null,
      spend:cost,costKm:tk&&logs.length>1?cost/(logs.at(-1).odometer-logs[0].odometer):null,km:logs.length>1?logs.at(-1).odometer-logs[0].odometer:0}
  }
};
