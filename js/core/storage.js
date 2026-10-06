/* Local cache (per signed-in user) + small helpers */
const DB={v:[],l:{},key:()=>"petrol-db:"+Auth.id,
  load(){this.v=[];this.l={};try{const d=JSON.parse(localStorage.getItem(this.key()));if(d){this.v=d.v;this.l=d.l}}catch(e){}},
  save(){try{localStorage.setItem(this.key(),JSON.stringify({v:this.v,l:this.l}))}catch(e){}},
  clear(){this.v=[];this.l={};try{localStorage.removeItem(this.key())}catch(e){}}};
const uid=p=>p+Math.random().toString(36).slice(2,8);
const normPlate=p=>String(p||"").trim().toUpperCase().replace(/[\[\]*?:\/\\]/g,"-").replace(/\s+/g," ").slice(0,30);
