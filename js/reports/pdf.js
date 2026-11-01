/* Monthly PDF report: one designed report per vehicle, laid out as ONE tall page (the reference is 960 x 1560).
   If a month has so many fills that the page would get unreasonably long, the fills table continues on further pages of the reference size.
   Drawn with jsPDF vector primitives in "design units" (an 864-wide content box scaled to the page). Only characters the built-in PDF fonts
   can draw are used as text; arrows, the minus sign and the approx sign are drawn as shapes. */
function exportPdf(R,fn){
  const {jsPDF}=window.jspdf,PW=595,REFH=PW*1560/960,MAXH=1500;
  const title="Petrol Report — "+fmtMonth(R.month);          /* file name and document title */
  const items=R.items.filter(it=>it.rows.length);
  /* dry run on a very tall page to learn how tall each vehicle's report needs to be */
  const plan=items.map(it=>{const end=pdfDraw(new jsPDF({unit:"pt",format:[PW,6000]}),it,R.month,6000,PW);return end<=MAXH?Math.max(REFH,end):REFH});
  const d=new jsPDF({unit:"pt",format:[PW,plan[0]]});
  try{d.setProperties({title})}catch(e){}
  items.forEach((it,n)=>{if(n)d.addPage([PW,plan[n]]);pdfDraw(d,it,R.month,plan[n],PW)});
  d.save(title+".pdf");
}

/* Draws one vehicle's report on the current page of d. Returns the height the whole report needs (content bottom + margin). */
function pdfDraw(d,it,month,PH,PW){
  const M=PW*48/960,W=PW-2*M,U=W/864,u=n=>n*U;
  const C={bg:[255,247,240],ink:[43,26,16],mut:[122,74,43],acc:[194,65,12],org:[249,115,22],line:[246,220,198],row:[251,235,221],soft:[255,237,213],softB:[253,186,116],track:[255,210,174],white:[255,255,255],gry:[245,245,244],gryT:[68,64,60],orgS:[255,228,204],orgT:[154,52,18]};
  const m2=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),rs=n=>"Rs "+Math.round(n).toLocaleString("en-US"),n1=n=>(Math.round(n*10)/10).toFixed(1),n2=n=>n.toFixed(2),k0=n=>Math.round(n).toLocaleString("en-US");
  const sd=iso=>{const[,mo,da]=iso.split("-");return MONTHS[+mo-1].slice(0,3)+" "+(+da)};
  const kv=x=>x.eff!==null?x.eff:x.est;                            /* km/L for a fill: exact, else the odometer estimate */
  const kfmt=k=>k>=100?String(Math.round(k)):n1(k);
  const DASH="—",BM=u(27);                         /* bottom margin, as in the reference */
  let y=M;
  const fill=c=>d.setFillColor(...c),line=c=>d.setDrawColor(...c),ink=c=>d.setTextColor(...c);
  const T=(s,x,yy,o={})=>{d.setFont("helvetica",o.b?"bold":"normal");d.setFontSize(u(o.s||14));ink(o.c||C.ink);d.text(String(s),x,yy+u(o.s||14)*.8,o.a?{align:o.a}:undefined)};
  const tw=(s,size,b)=>{d.setFont("helvetica",b?"bold":"normal");d.setFontSize(u(size));return d.getTextWidth(String(s))};
  const card=(x,yy,w,h,f,s,r=20)=>{fill(f);line(s);d.setLineWidth(.8);d.roundedRect(x,yy,w,h,u(r),u(r),"FD")};
  const dash=(a,b)=>d.setLineDash(a?[u(a),u(b)]:[]);
  const bg=()=>{fill(C.bg);d.rect(0,0,PW,PH,"F")};
  const page=()=>{d.addPage([PW,PH]);bg();y=M};
  /* shapes for glyphs the PDF fonts lack */
  const arrow=(x,cy,w,col)=>{line(col);d.setLineWidth(u(1.5));d.setLineCap("round");d.line(x,cy,x+w,cy);d.line(x+w-u(4.5),cy-u(3.6),x+w,cy);d.line(x+w-u(4.5),cy+u(3.6),x+w,cy);d.setLineCap("butt")};
  const seq=(parts,x,top,size,col)=>{let cx=x;parts.forEach(p=>{if(p===">"){arrow(cx+u(5),top+u(size)*.55,u(size)*.9,col);cx+=u(size)*.9+u(13)}else{T(p,cx,top,{s:size,c:col});cx+=tw(p,size)}});return cx};
  const minus=(x,top,size,col)=>{fill(col);d.rect(x,top+u(size)*.5,u(size)*.5,u(size)*.11,"F");return x+u(size)*.62};
  const approx=(x,top,size,col)=>{T("~",x,top-u(size)*.2,{s:size,c:col});T("~",x,top+u(size)*.2,{s:size,c:col});return x+tw("~",size)+u(5)};

  const rows=it.rows,s=it.s,v=it.v,avg=s.avg,ap=s.approx;
  const km=s.dist>0?s.dist:0,start=rows[0].odometer-rows[0].dk,end=rows[rows.length-1].odometer;
  const small=x=>x.liters<=2,unrel=x=>{const k=kv(x);return small(x)&&k!=null&&avg&&Math.abs(k-avg)/avg>.5};
  bg();

  /* header */
  T("PETROL REPORT",M,y+u(5),{s:13,b:1,c:C.acc});
  T(fmtMonth(month),M,y+u(29),{s:44,b:1});
  const chip=v.plate+" · "+v.name,cw=tw(chip,13,1)+u(28);
  fill(C.acc);d.roundedRect(M+W-cw,y+u(25),cw,u(32),u(16),u(16),"F");T(chip,M+W-cw/2,y+u(34),{s:13,b:1,c:C.white,a:"center"});
  T(s.fills+" fill"+(s.fills>1?"s":"")+" · "+sd(rows[0].date)+" – "+sd(rows[rows.length-1].date),M+W,y+u(64),{s:13,c:C.mut,a:"right"});
  y+=u(103);

  /* hero card + four stat cards */
  const hx=M,hw=u(464),hh=u(316);
  fill(C.acc);line(C.acc);d.roundedRect(hx,y,hw,hh,u(24),u(24),"F");
  T("Net spend this month",hx+u(32),y+u(34),{s:14,c:C.white});
  T(rs(s.net),hx+u(32),y+u(56),{s:64,b:1,c:C.white});
  if(km){const x1=approx(hx+u(32),y+u(138),15,C.white);T("Rs "+n1(s.net/km)+" per km over "+k0(km)+" km tracked",x1,y+u(138),{s:15,c:C.white})}
  else T(s.fills+" fill-up"+(s.fills>1?"s":"")+", "+n1(s.litres)+" L",hx+u(32),y+u(138),{s:15,c:C.white});
  const bx=hx+u(32),bw=hw-u(64),by=y+u(221),share=s.gross>0?Math.max(0,Math.min(1,s.net/s.gross)):1;
  fill(C.track);d.roundedRect(bx,by,bw,u(14),u(7),u(7),"F");
  fill(C.white);if(share>0)d.roundedRect(bx,by,Math.max(u(14),bw*share),u(14),u(7),u(7),"F");
  T("You paid · "+rs(s.net),bx,by+u(26),{s:13,c:C.white});T("Subsidy · "+rs(s.subsidy),bx+bw,by+u(26),{s:13,c:C.white,a:"right"});
  T("Gross fuel cost "+rs(s.gross),bx,by+u(49),{s:13,c:C.white});
  const sx=hx+u(488),cwid=u(180),stat=(cx,cy,chh,lab,val,unit,sub,col)=>{
    card(cx,cy,cwid,chh,C.white,C.line);T(lab,cx+u(24),cy+u(28),{s:13,c:C.mut});
    T(val,cx+u(24),cy+u(54),{s:36,b:1,c:col||C.ink});T(unit,cx+u(24)+tw(val,36,1)+u(4),cy+u(72),{s:16,b:1,c:col||C.ink});
    if(Array.isArray(sub)){                                         /* "odometer A > B": the arrow wraps to a second line when it must */
      const w1=tw(sub[0],13)+u(26),w2=tw(sub[1],13);
      if(w1+u(6)+w2<=cwid-u(48))seq([sub[0],">",sub[1]],cx+u(24),cy+u(101),13,C.mut);
      else{seq([sub[0],">"],cx+u(24),cy+u(101),13,C.mut);T(sub[1],cx+u(24),cy+u(118),{s:13,c:C.mut})}
    }else{d.setFont("helvetica","normal");d.setFontSize(u(13));ink(C.mut);d.text(d.splitTextToSize(sub,cwid-u(48)).slice(0,2),cx+u(24),cy+u(101)+u(13)*.8,{lineHeightFactor:1.4})}};
  const subN=rows.filter(r=>r.subsidy>0).length;
  stat(sx,y,u(140),"Fuel bought",n1(s.litres),"L","across "+s.fills+" fill"+(s.fills>1?"s":""));
  stat(sx+u(196),y,u(140),"Avg efficiency",avg?n1(avg):DASH,"km/L",avg?(ap?"estimated from odometer":"month average"):"needs two fills",C.acc);
  stat(sx,y+u(156),u(160),"Distance",k0(km),"km",["odometer "+k0(start),k0(end)]);
  stat(sx+u(196),y+u(156),u(160),"Subsidy saved",s.gross>0?n1(100*s.subsidy/s.gross):"0","%",subN?rs(s.subsidy)+" on "+subN+" fill"+(subN>1?"s":""):"no subsidy used");
  y+=hh+u(24);

  /* efficiency chart + price trend */
  const ch=u(304),ew=u(528),px=M+ew+u(24),pw=W-ew-u(24);
  card(M,y,ew,ch,C.white,C.line);T("Efficiency per fill",M+u(24),y+u(26),{s:18,b:1});
  T("km/L"+(avg?" · dashed line is the "+n1(avg)+" average":""),M+u(24),y+u(55),{s:13,c:C.mut});
  const bars=rows.filter(r=>kv(r)!=null&&kv(r)>0).slice(-12);
  const areaX=M+u(24),areaW=ew-u(48),base=y+u(226),ah=u(110);
  line(C.line);d.setLineWidth(.8);d.line(areaX,base,areaX+areaW,base);
  if(bars.length){
    const mx=Math.max(...bars.map(kv)),slot=areaW/bars.length,bw2=Math.min(slot*.8,u(60));
    bars.forEach((r,i)=>{const k=kv(r),h=Math.max(u(3),k/mx*ah),bx2=areaX+slot*i+(slot-bw2)/2,un=unrel(r);
      if(un){fill(C.orgS);line(C.org);d.setLineWidth(1);dash(4,3);d.roundedRect(bx2,base-h,bw2,h,u(6),u(6),"FD");dash(0)}
      else{fill(C.org);d.roundedRect(bx2,base-h,bw2,h,u(6),u(6),"F");d.rect(bx2,base-Math.min(h,u(6)),bw2,Math.min(h,u(6)),"F")}
      T(kfmt(k),bx2+bw2/2,base-h-u(19),{s:12,b:1,a:"center"});T(sd(r.date),bx2+bw2/2,base+u(9),{s:bars.length>9?10:12,c:C.mut,a:"center"})});
    if(avg){const ya=base-avg/mx*ah;line(C.acc);d.setLineWidth(1.2);dash(5,4);d.line(areaX,ya,areaX+areaW,ya);dash(0)}
  }else T("Log two fills to see efficiency per fill.",M+ew/2,y+u(150),{s:14,c:C.mut,a:"center"});
  T(bars.some(unrel)?"Dashed bars are tiny top-ups, so their km/L is unreliable.":"Each bar is one fill-up.",M+u(24),y+u(264),{s:13,c:C.mut});

  card(px,y,pw,ch,C.white,C.line);T("Price per litre",px+u(24),y+u(26),{s:18,b:1});
  const pr=rows.map(r=>r.price);
  if(pr.length>1){
    const p0=pr[0],p1=pr[pr.length-1],pc=(p1-p0)/p0*100;
    seq(["Rs/L, "+sd(rows[0].date),">",sd(rows[rows.length-1].date)],px+u(24),y+u(55),13,C.mut);
    let tx=px+u(24);const pt=y+u(89);
    if(pc<0)tx=minus(tx,pt,32,C.ink);else if(pc>0){T("+",tx,pt,{s:32,b:1});tx+=tw("+",32,1)}
    T(n1(Math.abs(pc))+"%",tx,pt,{s:32,b:1});
    seq([n2(p0),">",n2(p1)],px+u(24),y+u(129),13,C.mut);
    const gx=px+u(32),gw=pw-u(64),gy=y+u(160),gh=u(54),lo=Math.min(...pr),hi=Math.max(...pr),sp=hi-lo||1;
    const pts=pr.map((p,i)=>[gx+gw*i/(pr.length-1),gy+gh-(p-lo)/sp*gh]);
    line(C.org);d.setLineWidth(u(3.4));d.setLineCap("round");d.setLineJoin("round");for(let i=1;i<pts.length;i++)d.line(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1]);
    fill(C.org);d.circle(pts[0][0],pts[0][1],u(5.5),"F");fill(C.acc);d.circle(pts[pts.length-1][0],pts[pts.length-1][1],u(5.5),"F");d.setLineCap("butt");
  }else{T("Rs/L",px+u(24),y+u(55),{s:13,c:C.mut});T(pr.length?n2(pr[0]):DASH,px+u(24),y+u(89),{s:32,b:1});T("Log two fills to see the trend.",px+u(24),y+u(129),{s:13,c:C.mut})}
  y+=ch+u(24);

  /* three insight cards, written from this month's fills */
  const ins=[],lo=rows.reduce((a,r)=>r.price<a.price?r:a,rows[0]);
  if(rows.length>1){const df=rows[rows.length-1].price-rows[0].price;
    ins.push(df<-0.005?["Fuel is getting cheaper","Price per litre fell Rs "+n2(-df)+" across the month, with the lowest on "+sd(lo.date)+" at Rs "+n2(lo.price)+"."]
      :df>0.005?["Fuel got pricier","Price per litre rose Rs "+n2(df)+" across the month; the lowest was "+sd(lo.date)+" at Rs "+n2(lo.price)+"."]
      :["Price held steady","Price per litre stayed near Rs "+n2(rows[0].price)+" all month."])}
  if(s.subsidy>0){const dts=rows.filter(r=>r.subsidy>0).map(r=>sd(r.date));
    const list=dts.length<=3?dts.join(", ").replace(/, ([^,]*)$/,dts.length>1?" and $1":"$1"):dts.slice(0,3).join(", ")+" and more";
    ins.push(["Subsidy covers 1 in "+Math.max(1,Math.round(s.gross/s.subsidy))+" rupees",rs(s.subsidy)+" off the "+rs(s.gross)+" gross, from the "+list+" fill"+(dts.length>1?"s":"")+"."])}
  const sm=rows.filter(small);
  if(sm.length>=2)ins.push(["Top-ups skew the data",sm.length+" of "+rows.length+" fills were "+n2(Math.max(...sm.map(r=>r.liters))).replace(/\.?0+$/,"")+" L or less. Trust the "+(avg?n1(avg)+" km/L":"month")+" average over single fills."]);
  const ks=rows.filter(r=>kv(r)!=null&&!unrel(r));
  if(ks.length>1){const b=ks.reduce((a,r)=>kv(r)>kv(a)?r:a,ks[0]);ins.push(["Best fill: "+kfmt(kv(b))+" km/L","On "+sd(b.date)+", the most efficient fill this month that was not a tiny top-up."])}
  if(km)ins.push(["Cost per km: Rs "+n1(s.net/km),"You spent "+rs(s.net)+" to cover "+k0(km)+" km this month."]);
  const cards=ins.slice(0,3);
  if(cards.length){
    const iw=(W-u(48))/3,tl=[],bl=[];
    cards.forEach(c=>{d.setFont("helvetica","bold");d.setFontSize(u(18));tl.push(d.splitTextToSize(c[0],iw-u(48)));d.setFont("helvetica","normal");d.setFontSize(u(14));bl.push(d.splitTextToSize(c[1],iw-u(48)))});
    const ih=Math.max(u(154),u(24)+Math.max(...tl.map(a=>a.length))*u(23)+u(6)+Math.max(...bl.map(a=>a.length))*u(19)+u(22));
    cards.forEach((c,i)=>{const cx=M+i*(iw+u(24));card(cx,y,iw,ih,C.soft,C.softB);
      d.setFont("helvetica","bold");d.setFontSize(u(18));ink(C.ink);d.text(tl[i],cx+u(24),y+u(24)+u(18)*.8,{lineHeightFactor:1.25});
      d.setFont("helvetica","normal");d.setFontSize(u(14));ink(C.ink);d.text(bl[i],cx+u(24),y+u(24)+tl[i].length*u(23)+u(6)+u(14)*.8,{lineHeightFactor:1.3})});
    y+=ih+u(24);
  }

  /* all fills table (one card; continues on a new page only for very long months) */
  const RHt=u(50),HEAD=u(88),FOOT=u(48);
  let i=0;
  while(i<rows.length){
    let avail=PH-BM-y;
    if(avail+0.01<HEAD+Math.min(rows.length-i,5)*RHt+FOOT){page();avail=PH-BM-y}
    const nfit=Math.max(1,Math.floor((avail-HEAD-FOOT)/RHt+1e-6)),take=Math.min(nfit,rows.length-i),last=i+take>=rows.length;
    const th=HEAD+take*RHt+(last?FOOT:u(14));
    card(M,y,W,th,C.white,C.line);
    const cx0=M+u(24),ax=c=>cx0+u(c);T("All fills",cx0,y+u(31),{s:18,b:1});
    [["Date",0,"l"],["Odometer",190,"r"],["Trip km",300,"r"],["Litres",402,"r"],["Price/L",510,"r"],["Subsidy",614,"r"],["Net total",740,"r"],["km/L",816,"r"]].forEach(([t,c,al])=>T(t,ax(c),y+u(64),{s:12,b:1,c:C.mut,a:al==="r"?"right":undefined}));
    line(C.line);d.setLineWidth(1.4);d.line(cx0,y+HEAD,M+W-u(24),y+HEAD);
    for(let k=0;k<take;k++,i++){const r=rows[i],ry=y+HEAD+k*RHt,kk=kv(r),rt=ry+RHt/2-u(7);
      if(k>0){line(C.row);d.setLineWidth(.8);d.line(cx0,ry,M+W-u(24),ry)}
      T(sd(r.date),ax(0),rt,{s:14,b:1});
      T(k0(r.odometer),ax(190),rt,{s:14,a:"right"});T(r.dk>0?k0(r.dk):DASH,ax(300),rt,{s:14,a:"right"});
      T(n2(r.liters),ax(402),rt,{s:14,a:"right"});T(n2(r.price),ax(510),rt,{s:14,a:"right"});T(k0(r.subsidy||0),ax(614),rt,{s:14,a:"right"});
      T(m2(r.liters*r.price-(r.subsidy||0)),ax(740),rt,{s:14,b:1,a:"right"});
      if(kk!=null){const t=n1(kk)+(unrel(r)?" †":""),w=tw(t,13,1)+u(22),beat=avg&&kk>avg,xx=ax(816)-w,cyy=ry+RHt/2-u(13);
        fill(beat?C.soft:C.gry);d.roundedRect(xx,cyy,w,u(26),u(13),u(13),"F");T(t,xx+w/2,cyy+u(6.5),{s:13,b:1,c:beat?C.orgT:C.gryT,a:"center"})}
      else T(DASH,ax(816),rt,{s:14,a:"right"});
    }
    if(last){const fy=y+HEAD+take*RHt;line(C.row);d.setLineWidth(.8);d.line(cx0,fy,M+W-u(24),fy);
      const notes=[rows.some(unrel)?"† Small fill, treat with caution.":"",avg?"Orange chips beat the "+n1(avg)+" km/L average.":"",ap?"km/L is estimated from odometer readings.":""].filter(Boolean).join("  ");
      if(notes)T(notes,cx0,fy+u(14),{s:13,c:C.mut})}
    y+=th+u(14);
    if(!last)page();
  }
  return y-u(14)+u(27);
}
