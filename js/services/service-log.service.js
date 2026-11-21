/* ServiceLogService: workshop visits per vehicle.
   A visit has a date, an optional odometer, what was done, the workshop's service charge, and the products bought
   outside the workshop for it (name, quantity, unit price). Total = service charge + every product's qty x price,
   worked out when the visit is saved. An optional reminder stores the next service date and/or km.
   Each product can carry a replacement interval (every N km and/or N months); parts() tracks when each part is next due. */
const SVC_TAB="Service log";
const r2=n=>Math.round(n*100)/100;
const svcItemsTotal=items=>r2((items||[]).reduce((s,x)=>s+x.qty*x.price,0));
const svcKey=n=>String(n||"").trim().toLowerCase().replace(/\s+/g," ");
const isoDays=(a,b)=>{const u=s=>{const[y,m,d]=s.split("-").map(Number);return Date.UTC(y,m-1,d)};return Math.round((u(b)-u(a))/864e5)}; /* b - a in days */
const addMonthsISO=(iso,n)=>{const[y,m,d]=iso.split("-").map(Number),t=new Date(Date.UTC(y,m-1+n,1)),last=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth()+1,0)).getUTCDate();
  return t.getUTCFullYear()+"-"+String(t.getUTCMonth()+1).padStart(2,"0")+"-"+String(Math.min(d,last)).padStart(2,"0")}; /* 31 Jan + 1 month = 28/29 Feb */
/* Usual replacement intervals, offered when a product is typed for the first time (the user can change them; they are kept per vehicle from then on) */
const SVC_INTERVALS={"engine oil":[3000,3],"oil filter":[3000,3],"air filter":[10000,12],"fuel filter":[20000,24],"spark plug":[20000,24],"brake pads":[20000,0],
  "coolant":[40000,24],"battery":[0,24],"tyre":[40000,48],"wiper blades":[0,12],"gear oil":[40000,24],"brake oil":[0,24]};
const ServiceLogService={
  list:vid=>[...(DB.s[vid]||[])].sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:0), /* newest first */
  build(b,id){
    const num=v=>v===""||v==null?null:+v;
    const o=num(b.odometer),ch=num(b.charge),nk=num(b.nextKm),work=String(b.work||"").trim().replace(/\s+/g," ").slice(0,200),nd=b.nextDate||"";
    if(!/^\d{4}-\d{2}-\d{2}$/.test(b.date||""))throw new Error("Choose the service date");
    if(o!==null&&!(o>0))throw new Error("Odometer must be a positive number, or leave it empty");
    if(ch!==null&&!(ch>=0))throw new Error("Service charge must be zero or more, or leave it empty");
    const items=[];
    (b.items||[]).forEach((x,i)=>{
      const name=String(x.name||"").trim().replace(/\s+/g," ").slice(0,80),q=num(x.qty),p=num(x.price);
      if(!name&&q==null&&p==null)return;                                   /* an untouched empty row is ignored */
      if(!name)throw new Error("Product "+(i+1)+": enter its name");
      if(q!==null&&!(q>0))throw new Error(name+": quantity must be more than 0");
      if(p===null||!(p>=0))throw new Error(name+": enter the price");          /* null>=0 is true in JS, so check empty first */
      const ek=num(x.everyKm),em=num(x.everyMonths);
      if(ek!==null&&!(ek>0&&ek<=500000))throw new Error(name+": replace-every km must be a positive number, or leave it empty");
      if(em!==null&&!(Number.isInteger(em)&&em>0&&em<=120))throw new Error(name+": replace-every months must be a whole number from 1 to 120, or leave it empty");
      const it={name,qty:q===null?1:q,price:p};if(ek)it.everyKm=Math.round(ek);if(em)it.everyMonths=em;
      items.push(it);
    });
    if(!work&&!items.length)throw new Error("Say what was done, or add a product");
    if(nd&&nd<=b.date)throw new Error("Next service date must be after the service date");
    if(nk!==null&&!(nk>0))throw new Error("Next service km must be a positive number, or leave it empty");
    if(nk!==null&&o!==null&&nk<=o)throw new Error("Next service km must be higher than this odometer reading");
    const charge=ch||0;
    return{id,vehicleId:b.vehicleId,date:b.date,odometer:o,work,charge,items,total:r2(charge+svcItemsTotal(items)),nextDate:nd,nextKm:nk};
  },
  /* The interval last set for a product on this vehicle (newest visit first), else the usual one, else none */
  interval(vid,name){
    const k=svcKey(name);
    for(const v of this.list(vid))for(const it of v.items)if(svcKey(it.name)===k&&(it.everyKm||it.everyMonths))return{everyKm:it.everyKm||null,everyMonths:it.everyMonths||null,from:"history"};
    const d=SVC_INTERVALS[k];return d?{everyKm:d[0]||null,everyMonths:d[1]||null,from:"usual"}:null;
  },
  /* Every part with an interval: when it was last changed and when it is next due. odo = latest known odometer, today = "YYYY-MM-DD".
     The interval used is the one saved with the most recent change of that part. Sorted most urgent first. */
  parts(vid,odo,today){
    const last={};
    [...this.list(vid)].reverse().forEach(v=>v.items.forEach(it=>{const k=svcKey(it.name);last[k]={v,it}})); /* oldest to newest, so the newest wins */
    return Object.values(last).filter(({it})=>it.everyKm||it.everyMonths).map(({v,it})=>{
      const p={name:it.name,date:v.date,odometer:v.odometer,everyKm:it.everyKm||null,everyMonths:it.everyMonths||null,dueKm:null,kmLeft:null,dueDate:"",daysLeft:null,used:0};
      if(p.everyKm&&v.odometer!=null){p.dueKm=v.odometer+p.everyKm;if(odo>=v.odometer){p.kmLeft=p.dueKm-odo;p.used=Math.max(p.used,(odo-v.odometer)/p.everyKm)}}
      if(p.everyMonths){p.dueDate=addMonthsISO(v.date,p.everyMonths);p.daysLeft=isoDays(today,p.dueDate);const span=isoDays(v.date,p.dueDate);p.used=Math.max(p.used,span>0?isoDays(v.date,today)/span:0)}
      p.status=(p.kmLeft!==null&&p.kmLeft<0)||(p.daysLeft!==null&&p.daysLeft<0)?"overdue":p.used>=.85||(p.daysLeft!==null&&p.daysLeft<=14)?"soon":"ok";
      return p;
    }).sort((a,b)=>b.used-a.used);
  },
  async add(b){
    const r=this.build(b,uid("s"));
    await remote("addService",{log:r});
    (DB.s[b.vehicleId]=DB.s[b.vehicleId]||[]).push(r);DB.save();return r;
  },
  async update(id,b){
    const r=this.build(b,id);
    await remote("updateService",{log:r});
    DB.s[b.vehicleId]=DB.s[b.vehicleId].map(x=>x.id===id?r:x);DB.save();return r;
  },
  async remove(id){
    const vid=Object.keys(DB.s).find(k=>DB.s[k].some(x=>x.id===id));if(!vid)return;
    await remote("deleteService",{id});DB.s[vid]=DB.s[vid].filter(x=>x.id!==id);DB.save();
  }
};
