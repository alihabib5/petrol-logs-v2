/* Monthly report export: XLSX / CSV / PDF */
/* ===== MONTHLY REPORTS: XLSX / PDF / CSV ===== */
const RH=["Date","Odometer (km)","Litres","Price/L (Rs)","Subsidy (Rs)","Net total (Rs)","km/L"];
const RL=x=>[x.date,x.odometer,x.liters,x.price,x.subsidy||0,+(x.liters*x.price-(x.subsidy||0)).toFixed(2),x.eff===null?"":+x.eff.toFixed(2)];
function dl(name,blob){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function exportReport(fmt){
  const R=S.report,m=R.month,fn="petrol-report-"+m;
  if(!R.items.some(i=>i.rows.length))return alert("No fill-ups in "+m+".");
  if(fmt==="xlsx"){
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([["Plate","Vehicle","Fills","Litres","Km driven","Avg km/L","Gross (Rs)","Subsidy (Rs)","Net (Rs)"],...R.items.map(i=>[i.v.plate,i.v.name,i.s.fills,+i.s.litres.toFixed(2),i.s.km,i.s.avg?+i.s.avg.toFixed(2):"",+i.s.gross.toFixed(2),i.s.subsidy,+i.s.net.toFixed(2)])]),"Summary");
    R.items.forEach(i=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([RH,...i.rows.map(RL)]),i.v.plate.slice(0,31)));
    XLSX.writeFile(wb,fn+".xlsx");
  }
  if(fmt==="csv"){
    const q=v=>/[",\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':v,L=[["Report",m]];
    R.items.forEach(i=>L.push([],["Plate",i.v.plate,"Vehicle",i.v.name],RH,...i.rows.map(RL)));
    dl(fn+".csv",new Blob(["\ufeff"+L.map(r=>r.map(q).join(",")).join("\n")],{type:"text/csv"}));
  }
  if(fmt==="pdf"){
    const {jsPDF}=window.jspdf,d=new jsPDF({unit:"pt",format:"a4"}),H=d.internal.pageSize.getHeight(),X=[40,105,175,235,300,370,455];let y=54;
    const need=n=>{if(y+n>H-40){d.addPage();y=54}},T=(s,x,b)=>{d.setFont("helvetica",b?"bold":"normal");d.text(String(s),x,y)},t=R.t;
    d.setFontSize(20);T("Petrol Report - "+m,40,1);y+=22;d.setFontSize(10);
    T(`All vehicles: ${t.fills} fills, ${t.litres.toFixed(1)} L, avg ${f1(t.avg)} km/L, gross Rs ${Math.round(t.gross)}, subsidy Rs ${Math.round(t.subsidy)}, net Rs ${Math.round(t.net)}`,40);y+=26;
    R.items.forEach(i=>{
      if(!i.rows.length)return;need(70);d.setFontSize(13);T(`${i.v.plate} - ${i.v.name}`,40,1);y+=16;d.setFontSize(9);
      T(`${i.s.fills} fills | ${i.s.litres.toFixed(1)} L | avg ${f1(i.s.avg)} km/L | net Rs ${Math.round(i.s.net)}`,40);y+=16;
      RH.forEach((h,k)=>T(h,X[k],1));y+=4;d.line(40,y,555,y);y+=12;
      i.rows.forEach(r=>{need(16);RL(r).forEach((c,k)=>T(c,X[k]));y+=14});y+=18;
    });
    d.save(fn+".pdf");
  }
}
