/* Monthly report export: XLSX / CSV / PDF */
/* ===== MONTHLY REPORTS: XLSX / PDF / CSV ===== */
const RH=v=>{const L=UL(v);return["Date","Odometer (km)",L.amount,"Price/"+L.u+" (Rs)","Subsidy (Rs)","Net total (Rs)",L.eff]}; /* headers follow the vehicle type */
const RL=x=>[x.date,x.odometer!=null?x.odometer:"",x.liters,x.price,x.subsidy||0,+(x.liters*x.price-(x.subsidy||0)).toFixed(2),x.eff!==null?+x.eff.toFixed(2):x.est?"~"+x.est.toFixed(2):""];
function dl(name,blob){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function exportReport(fmt){
  const R=S.report,m=R.month,fn="petrol-report-"+m;
  if(!R.items.some(i=>i.rows.length))return alert("No fill-ups or charges in "+m+".");
  if(fmt==="xlsx"){
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([["Plate","Vehicle","Type","Fill-ups / charges","Amount","Unit","Km driven","Avg efficiency (~ = estimate)","Efficiency unit","Gross (Rs)","Subsidy (Rs)","Net (Rs)"],...R.items.map(i=>[i.v.plate,i.v.name,vTypeName(i.v),i.s.fills,+i.s.litres.toFixed(2),UL(i.v).u,i.s.km,i.s.avg?(i.s.approx?"~":"")+i.s.avg.toFixed(2):"",UL(i.v).eff,+i.s.gross.toFixed(2),i.s.subsidy,+i.s.net.toFixed(2)])]),"Summary");
    R.items.forEach(i=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([RH(i.v),...i.rows.map(RL)]),i.v.plate.slice(0,31)));
    XLSX.writeFile(wb,fn+".xlsx");
  }
  if(fmt==="csv"){
    const q=v=>/[",\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':v,L=[["Report",m]];
    R.items.forEach(i=>L.push([],["Plate",i.v.plate,"Vehicle",i.v.name,"Type",vTypeName(i.v)],RH(i.v),...i.rows.map(RL)));
    dl(fn+".csv",new Blob(["\ufeff"+L.map(r=>r.map(q).join(",")).join("\n")],{type:"text/csv"}));
  }
  if(fmt==="pdf")exportPdf(R,fn);
}
