/* Monthly report export: XLSX / CSV / PDF */
/* ===== MONTHLY REPORTS: XLSX / PDF / CSV ===== */
const RH=["Date","Odometer (km)","Litres","Price/L (Rs)","Subsidy (Rs)","Net total (Rs)","km/L"];
const RL=x=>[x.date,x.odometer,x.liters,x.price,x.subsidy||0,+(x.liters*x.price-(x.subsidy||0)).toFixed(2),x.eff!==null?+x.eff.toFixed(2):x.est?"~"+x.est.toFixed(2):""];
function dl(name,blob){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function exportReport(fmt){
  const R=S.report,m=R.month,fn="petrol-report-"+m;
  if(!R.items.some(i=>i.rows.length))return alert("No fill-ups in "+m+".");
  if(fmt==="xlsx"){
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([["Plate","Vehicle","Fills","Litres","Km driven","Avg km/L (~ = estimate)","Gross (Rs)","Subsidy (Rs)","Net (Rs)"],...R.items.map(i=>[i.v.plate,i.v.name,i.s.fills,+i.s.litres.toFixed(2),i.s.km,i.s.avg?(i.s.approx?"~":"")+i.s.avg.toFixed(2):"",+i.s.gross.toFixed(2),i.s.subsidy,+i.s.net.toFixed(2)])]),"Summary");
    R.items.forEach(i=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([RH,...i.rows.map(RL)]),i.v.plate.slice(0,31)));
    XLSX.writeFile(wb,fn+".xlsx");
  }
  if(fmt==="csv"){
    const q=v=>/[",\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':v,L=[["Report",m]];
    R.items.forEach(i=>L.push([],["Plate",i.v.plate,"Vehicle",i.v.name],RH,...i.rows.map(RL)));
    dl(fn+".csv",new Blob(["\ufeff"+L.map(r=>r.map(q).join(",")).join("\n")],{type:"text/csv"}));
  }
  if(fmt==="pdf"){
    const {jsPDF}=window.jspdf,d=new jsPDF({unit:"pt",format:"a4"}),H=d.internal.pageSize.getHeight(),X=[40,105,175,235,300,370,455],t=R.t;let y=54;
    const need=n=>{if(y+n>H-40){d.addPage();y=54}},T=(s,x,b)=>{d.setFont("helvetica",b?"bold":"normal");d.text(String(s),x,y)};
    const rs=n=>"Rs "+Math.round(n).toLocaleString("en-US"),km=n=>Math.round(n).toLocaleString("en-US")+" km",avg=s=>s.avg?f1(s.avg,s.approx)+" km/L":"-";
    d.setFontSize(20);T("Petrol Report - "+m,40,1);y+=24;
    /* four headline figures */
    [["TOTAL MONEY",rs(t.net)],["DISTANCE",km(t.dist)],["AVERAGE FUEL",avg(t)],["FUEL FILLED",t.litres.toFixed(1)+" L"]].forEach(([l,v],k)=>{
      const x=40+k*131.5;d.setFillColor(243,242,238);d.roundedRect(x,y,121,52,6,6,"F");
      d.setFontSize(7);d.setTextColor(110);d.setFont("helvetica","bold");d.text(l,x+10,y+16);
      d.setFontSize(15);d.setTextColor(20);d.text(v,x+10,y+38);
    });
    d.setTextColor(0);y+=72;d.setFontSize(9);
    T(`Gross ${rs(t.gross)} - subsidy ${rs(t.subsidy)} = net ${rs(t.net)}  |  ${t.fills} fill-ups${t.approx?"  |  ~ = estimated from odometer readings":""}`,40);y+=26;
    R.items.forEach(i=>{
      if(!i.rows.length)return;need(90);d.setFontSize(13);T(`${i.v.plate} - ${i.v.name}`,40,1);y+=16;d.setFontSize(9);
      T(`${i.s.fills} fills | ${km(i.s.dist)} | ${i.s.litres.toFixed(1)} L | avg ${avg(i.s)} | net ${rs(i.s.net)}`,40);y+=16;
      RH.forEach((h,k)=>T(h,X[k],1));y+=4;d.line(40,y,555,y);y+=12;
      i.rows.forEach(r=>{need(16);RL(r).forEach((c,k)=>T(c,X[k]));y+=14});
      need(24);d.line(40,y-4,555,y-4);y+=8;
      T("Total",X[0],1);T(i.s.dist?"+"+Math.round(i.s.dist)+" km":"",X[1],1);T(+i.s.litres.toFixed(2),X[2],1);T(+i.s.subsidy.toFixed(2),X[4],1);T(+i.s.net.toFixed(2),X[5],1);T(i.s.avg?(i.s.approx?"~":"")+i.s.avg.toFixed(2):"",X[6],1);y+=30;
    });
    d.save(fn+".pdf");
  }
}
