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
  if(fmt==="pdf")exportPdf(R,fn);
}
