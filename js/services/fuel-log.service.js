/* FuelLogService */
const FuelLogService={
  list:vid=>[...(DB.l[vid]||[])].sort((a,b)=>a.odometer-b.odometer),
  /* validate and build a log record; selfId = the entry being edited (ignored in the odometer check) */
  build(b,id,selfId){
    const o=+b.odometer,l=+b.liters,p=+b.price,sb=+b.subsidy||0;
    if(!(o>0)||!(l>0)||!(p>=0))throw new Error("Enter valid odometer, liters and price");
    if(sb<0||sb>l*p)throw new Error("Subsidy cannot be negative or exceed the total");
    if(this.list(b.vehicleId).some(x=>x.id!==selfId&&x.odometer>=o&&x.date<=b.date))throw new Error("Odometer must be higher than earlier entries");
    return{id,vehicleId:b.vehicleId,date:b.date,odometer:o,liters:l,price:p,subsidy:sb,full:b.full?1:0};
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
