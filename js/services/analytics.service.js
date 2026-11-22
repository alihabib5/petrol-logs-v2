/* AnalyticsService */
const AnalyticsService={
  /* Exact: full-tank method. km between full fills / litres added since the previous full fill.
     Estimate (only when there is no exact figure): odometer readings alone, never presented as exact.
       per row  = (this odometer - previous odometer) / litres of the previous refill (that fuel powered the drive)
       overall  = (last odometer - first odometer) / litres of every refill except the last */
  /* Entries without an odometer still count for litres and cost, and add fuel to the next full-tank interval; they just give no distance. */
  /* The right method for a vehicle: EVs with battery % use the % method, everything else the full-tank method */
  forVehicle(vid){const v=DB.v.find(x=>x.id===vid),l=FuelLogService.list(vid);return isEV(v)&&l.some(evPct)?this.computeEV(l,v):this.compute(l)},
  /* EV % method. Between charge A and the next charge B: km = B.odometer - A.odometer, battery used = A.unplug% - B.plug-in%.
     Efficiency = km / kWh used when the battery size is known (entered or learned), else km per 1% of battery.
     Home charge: kWh = % added x size; cost = kWh / 0.9 x rate (unknown without size or rate). Public charge: its receipt. */
  computeEV(logs,v){
    const cap=evCap(v),rate=v&&v.rate>0?v.rate:null,out=[];
    let prev=null,tk=0,tu=0,cost=0,allCost=true;
    logs.forEach(e=>{
      const add=evPct(e)?e.be-e.bs:null;let kwh=e.liters,c=e.liters*e.price-(e.subsidy||0);
      if(e.src==="home"){kwh=cap&&add!=null?add/100*cap:0;c=kwh&&rate?kwh/CHARGE_LOSS*rate:null}
      if(c===null)allCost=false;else cost+=c;
      let eff=null,km=null,lt=null;
      if(prev&&e.odometer!=null&&e.bs!=null){const d=e.odometer-prev.odometer,u=prev.be-e.bs;
        if(d>0&&u>0){km=d;lt=cap?u/100*cap:u;eff=km/lt;tk+=d;tu+=u}}
      out.push({...e,liters:kwh,price:kwh&&c!==null?c/kwh:0,cost:c,eff,km,lt,dk:km||0,pl:0,est:null});
      if(e.odometer!=null&&e.be!=null)prev=e;
    });
    const od=logs.filter(x=>x.odometer!=null),span=od.length>1?od.at(-1).odometer-od[0].odometer:0,vals=out.map(x=>x.eff).filter(x=>x!==null);
    return{rows:out,approx:false,odoCount:od.length,avg:tu?(cap?tk/(tu/100*cap):tk/tu):null,last:vals.at(-1)??null,best:vals.length?Math.max(...vals):null,
      spend:cost,costKm:allCost&&span>0?cost/span:null,km:span,unknownCost:!allCost,cap,capLearned:!!cap&&!(v.cap>0),rate};
  },
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
