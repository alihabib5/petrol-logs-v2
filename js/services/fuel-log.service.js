/* FuelLogService */
const FuelLogService={
  /* oldest first: by odometer as before; if some entries have no odometer (it is optional), by date */
  list:vid=>{const l=[...(DB.l[vid]||[])];return l.every(x=>x.odometer!=null)?l.sort((a,b)=>a.odometer-b.odometer):l.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:(a.odometer!=null&&b.odometer!=null?a.odometer-b.odometer:0))},
  /* validate and build a log record; selfId = the entry being edited (ignored in the odometer check) */
  build(b,id,selfId){
    const o=b.odometer===""||b.odometer==null?null:+b.odometer; /* odometer is optional: empty = not recorded */
    let l=+b.liters,p=+b.price,sb=+b.subsidy||0;
    const src=b.src==="home"||b.src==="public"?b.src:"",pc=x=>x===""||x==null?null:+x,bs=pc(b.bs),be=pc(b.be); /* EV charges only */
    if(o!==null&&!(o>0))throw new Error("Odometer must be a positive number, or leave it empty");
    for(const [x,n] of [[bs,"plug-in"],[be,"unplug"]])if(x!==null&&!(x>=0&&x<=100))throw new Error("Battery % at "+n+" must be from 0 to 100");
    if(bs!==null&&be!==null&&!(be>bs))throw new Error("Battery % at unplug must be higher than at plug-in");
    if(src==="home"){
      if(o===null)throw new Error("Enter the odometer: home charging works out efficiency from km and battery %");
      if(bs===null||be===null)throw new Error("Enter the battery % at plug-in and at unplug");
      l=0;p=0;sb=0;                                              /* no receipt: energy and cost are worked out from %, battery size and rate */
    }else{
      if(!(l>0)||!(p>=0))throw new Error(src?"Enter valid kWh and price":"Enter valid litres and price");
      if(sb<0||sb>l*p)throw new Error("Subsidy cannot be negative or exceed the total");
    }
    if(o!==null&&this.list(b.vehicleId).some(x=>x.id!==selfId&&x.odometer!=null&&x.odometer>=o&&x.date<=b.date))throw new Error("Odometer must be higher than earlier entries");
    return{id,vehicleId:b.vehicleId,date:b.date,odometer:o,liters:l,price:p,subsidy:sb,full:src==="home"?(be>=100?1:0):(b.full?1:0),src,bs:src?bs:null,be:src?be:null};
  },
  async add(b){
    const r=this.build(b,uid("l"));
    await remote("addLog",{plate:b.vehicleId,log:r});
    (DB.l[b.vehicleId]=DB.l[b.vehicleId]||[]).push(r);DB.save();return r;
  },
  async update(id,b){
    const r=this.build(b,id,id);
    await remote("updateLog",{plate:b.vehicleId,log:r});
    DB.l[b.vehicleId]=DB.l[b.vehicleId].map(x=>x.id===id?r:x);DB.save();return r;
  },
  async remove(id){
    const vid=Object.keys(DB.l).find(k=>DB.l[k].some(x=>x.id===id));
    await remote("deleteLog",{plate:vid,id});DB.l[vid]=DB.l[vid].filter(x=>x.id!==id);DB.save();
  }
};
