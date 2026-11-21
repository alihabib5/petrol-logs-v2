/* Local cache (per signed-in user) + small helpers */
/* v = vehicles, l = fill-ups per plate, s = service visits per plate (s is missing in caches saved before 2.6.0) */
const DB={v:[],l:{},s:{},key:()=>"petrol-db:"+Auth.id,
  load(){this.v=[];this.l={};this.s={};try{const d=JSON.parse(localStorage.getItem(this.key()));if(d){this.v=d.v;this.l=d.l;this.s=d.s||{}}}catch(e){}},
  save(){try{localStorage.setItem(this.key(),JSON.stringify({v:this.v,l:this.l,s:this.s}))}catch(e){}},
  clear(){this.v=[];this.l={};this.s={};try{localStorage.removeItem(this.key())}catch(e){}}};
const uid=p=>p+Math.random().toString(36).slice(2,8);
const normPlate=p=>String(p||"").trim().toUpperCase().replace(/[\[\]*?:\/\\]/g,"-").replace(/\s+/g," ").slice(0,30);
