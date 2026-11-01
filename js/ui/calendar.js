/* Calendar picker for the date and month fields: rounded card, round days, orange selection, muted "today".
   Replaces the browser's native pickers so it looks and behaves the same everywhere (desktop Safari/Firefox have no month picker).
   Values are plain "YYYY-MM-DD" / "YYYY-MM" strings kept in a hidden input; a button shows the readable text. */
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const pad2=n=>String(n).padStart(2,"0");
const isoOf=(y,m,d)=>y+"-"+pad2(m+1)+"-"+pad2(d);                 /* m is 0-based */
const todayISO=()=>{const t=new Date();return isoOf(t.getFullYear(),t.getMonth(),t.getDate())}; /* local day, not UTC */
const todayYM=()=>todayISO().slice(0,7);
const fmtDate=iso=>{const[y,m,d]=iso.split("-").map(Number);return d+" "+MONTHS[m-1].slice(0,3)+" "+y};
const fmtMonth=ym=>{const[y,m]=ym.split("-").map(Number);return MONTHS[m-1]+" "+y};
const CAL_ICON='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 5h14v15H5zM5 10h14M9 3v4M15 3v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEV=d=>'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="'+(d<0?"M15 6l-6 6 6 6":"M9 6l6 6-6 6")+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const dateField=(id,iso)=>`<input type="hidden" id="${id}" value="${iso}"><button type="button" class="datebtn" id="${id}_b" data-cal="date" data-target="${id}" aria-haspopup="dialog">${fmtDate(iso)}${CAL_ICON}</button>`;
const monthField=(id,ym)=>`<input type="hidden" id="${id}" value="${ym}"><button type="button" class="datebtn" id="${id}_b" data-cal="month" data-target="${id}" aria-haspopup="dialog">${fmtMonth(ym)}${CAL_ICON}</button>`;

const Cal={
  mode:"date",view:"days",y:0,m:0,focus:"",val:"",target:null,btn:null,bound:false,
  open(btn){
    this.btn=btn;this.mode=btn.dataset.cal;this.target=document.getElementById(btn.dataset.target);
    this.val=this.target.value;
    const base=this.mode==="month"?this.val+"-01":this.val;
    const[y,m]=base.split("-").map(Number);this.y=y;this.m=m-1;this.focus=this.mode==="month"?"":base;
    this.view=this.mode==="month"?"months":"days";
    $("#calBody").setAttribute("aria-label",this.mode==="month"?"Choose month":"Choose date");
    this.bind();this.draw();$("#cal").classList.add("on");this.focusCell();
  },
  close(back=true){$("#cal").classList.remove("on");if(back&&this.btn)this.btn.focus()},
  pick(v){
    this.target.value=v;
    this.btn.innerHTML=(this.mode==="month"?fmtMonth(v):fmtDate(v))+CAL_ICON;
    this.target.dispatchEvent(new Event("change",{bubbles:true}));
    this.close();
  },
  shift(dm){const t=new Date(this.y,this.m+dm,1);this.y=t.getFullYear();this.m=t.getMonth()}, /* month steps */
  draw(){
    const body=$("#calBody"),t=todayISO();let h="";
    if(this.view==="months"){
      const cur=this.mode==="month"?this.val:this.val.slice(0,7),now=todayYM();
      h+=`<div class="cal-h"><button type="button" class="cal-nav" data-nav="-12" aria-label="Previous year">${CHEV(-1)}</button><span class="cal-cap" aria-live="polite">${this.y}</span><button type="button" class="cal-nav" data-nav="12" aria-label="Next year">${CHEV(1)}</button></div><div class="cal-months" role="group" aria-label="Months">`;
      MONTHS.forEach((n,i)=>{const ym=this.y+"-"+pad2(i+1);h+=`<button type="button" class="cal-m ${ym===cur?"sel":""} ${ym===now?"today":""}" data-m="${ym}" ${ym===cur?'aria-pressed="true"':""}>${n.slice(0,3)}</button>`});
      h+=`</div>`;
    }else{
      h+=`<div class="cal-h"><button type="button" class="cal-nav" data-nav="-1" aria-label="Previous month">${CHEV(-1)}</button><button type="button" class="cal-cap" data-cv="months" aria-label="${MONTHS[this.m]} ${this.y}, choose month">${MONTHS[this.m]} ${this.y}</button><button type="button" class="cal-nav" data-nav="1" aria-label="Next month">${CHEV(1)}</button></div>
      <div class="cal-w" aria-hidden="true">${["Mo","Tu","We","Th","Fr","Sa","Su"].map(d=>`<span>${d}</span>`).join("")}</div><div class="cal-g" role="grid" aria-label="${MONTHS[this.m]} ${this.y}">`;
      const off=(new Date(this.y,this.m,1).getDay()+6)%7; /* Monday first */
      for(let i=0;i<42;i++){
        const d=new Date(this.y,this.m,1-off+i),iso=isoOf(d.getFullYear(),d.getMonth(),d.getDate());
        const sel=iso===this.val,out=d.getMonth()!==this.m;
        h+=`<button type="button" role="gridcell" class="cal-d ${sel?"sel":""} ${iso===t?"today":""} ${out?"out":""}" data-d="${iso}" tabindex="${iso===this.focus?0:-1}" aria-label="${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}" ${sel?'aria-selected="true"':""} ${iso===t?'aria-current="date"':""}>${d.getDate()}</button>`;
      }
      h+=`</div>`;
    }
    h+=`<div class="cal-f"><button type="button" class="ghost" data-today="1">${this.mode==="month"?"This month":"Today"}</button><button type="button" class="ghost" data-close="1">Close</button></div>`;
    body.innerHTML=h;
  },
  focusCell(){const c=$("#calBody").querySelector(this.view==="days"?'.cal-d[tabindex="0"]':".cal-m.sel,.cal-m.today,.cal-m");if(c)c.focus()},
  moveFocus(days){
    const[y,m,d]=this.focus.split("-").map(Number),n=new Date(y,m-1,d+days);
    this.focus=isoOf(n.getFullYear(),n.getMonth(),n.getDate());
    if(n.getMonth()!==this.m||n.getFullYear()!==this.y){this.y=n.getFullYear();this.m=n.getMonth();this.draw()}
    else{$("#calBody").querySelectorAll(".cal-d").forEach(b=>b.tabIndex=b.dataset.d===this.focus?0:-1)}
    this.focusCell();
  },
  bind(){
    if(this.bound)return;this.bound=true;
    const root=$("#cal"),body=$("#calBody");
    root.addEventListener("click",e=>{
      if(e.target===root)return this.close();
      const b=e.target.closest("button");if(!b||!body.contains(b))return;
      const d=b.dataset;
      if(d.d)return this.pick(d.d);
      if(d.m){if(this.mode==="month")return this.pick(d.m);const[y,m]=d.m.split("-").map(Number);this.y=y;this.m=m-1;this.view="days";this.focus=isoOf(y,m-1,1);this.draw();return this.focusCell()}
      if(d.nav){this.shift(+d.nav);this.focus=isoOf(this.y,this.m,1);this.draw();const nb=$("#calBody").querySelector('[data-nav="'+d.nav+'"]');return nb&&nb.focus()}
      if(d.cv){this.view="months";this.draw();return this.focusCell()}
      if(d.today)return this.pick(this.mode==="month"?todayYM():todayISO());
      if(d.close)return this.close();
    });
    root.addEventListener("keydown",e=>{
      if(!root.classList.contains("on"))return;
      if(e.key==="Escape"){e.stopPropagation();return this.close()}
      if(e.key==="Tab"){const f=[...body.querySelectorAll("button")].filter(x=>x.tabIndex>=0);const i=f.indexOf(document.activeElement);
        if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}return}
      if(this.view!=="days"||!document.activeElement.dataset.d)return;
      const k={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];
      if(k){e.preventDefault();this.moveFocus(k)}
      else if(e.key==="PageUp"||e.key==="PageDown"){e.preventDefault();const[y,m,d]=this.focus.split("-").map(Number),dl=e.key==="PageUp"?-1:1,n=new Date(y,m-1+dl,Math.min(d,new Date(y,m+dl,0).getDate()));this.focus=isoOf(n.getFullYear(),n.getMonth(),n.getDate());this.y=n.getFullYear();this.m=n.getMonth();this.draw();this.focusCell()}
    });
  }
};
