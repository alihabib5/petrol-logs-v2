/* Google Sheets / Drive REST calls. One spreadsheet "Petrol Log" in the customer's Drive; one tab per plate number. */
const SHEETS="https://sheets.googleapis.com/v4/spreadsheets",DRIVE="https://www.googleapis.com/drive/v3/files";
const HEAD=["ID","Date","Odometer (km)","Litres","Price per litre (Rs)","Subsidy (Rs)","Full tank","Net total (Rs)"];
/* Service log tab, columns A-L. A (ID) and L (the products as data, read back by the app) are hidden; G is the same list for people to read. */
const SVC_HEAD=["ID","Plate","Date","Odometer (km)","Work done","Service charge (Rs)","Products bought","Products total (Rs)","Total (Rs)","Next service date","Next service at (km)","Items (app data)"];
const svcRow=s=>[s.id,s.vehicleId,"'"+s.date,s.odometer==null?"":s.odometer,"'"+s.work,s.charge||0,"'"+s.items.map(x=>x.name+" x"+x.qty+" @ "+x.price+svcEvery(x)).join("; "),svcItemsTotal(s.items),s.total,
  s.nextDate?"'"+s.nextDate:"",s.nextKm==null?"":s.nextKm,"'"+JSON.stringify(s.items)]; /* ' keeps dates and text exactly as typed */
const svcEvery=x=>x.everyKm||x.everyMonths?" (every "+[x.everyKm?x.everyKm+" km":"",x.everyMonths?x.everyMonths+" mo":""].filter(Boolean).join(" / ")+")":"";
const svcItems=v=>{try{const a=JSON.parse(v||"[]");return Array.isArray(a)?a.filter(x=>x&&x.name).map(x=>{const it={name:String(x.name),qty:+x.qty||1,price:+x.price||0};
  if(+x.everyKm>0)it.everyKm=+x.everyKm;if(+x.everyMonths>0)it.everyMonths=+x.everyMonths;return it}):[]}catch(e){return[]}};
const A1=t=>"'"+t.replace(/'/g,"''")+"'";
const enc=encodeURIComponent;
const Gs={
  id:null,tabs:{},
  async call(url,body,method){
    const t=await Auth.bearer();
    const r=await fetch(url,{method:method||(body?"POST":"GET"),headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});
    if(r.status===401){Auth.expire();throw new Error("Google needs you to reconnect. Tap Reconnect and try again.")}
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error((j.error&&j.error.message)||"Google error "+r.status);
    return j;
  },
  async ensure(){
    if(this.id)return this.id;
    const k="petrol-sheet:"+Auth.id;let id=localStorage.getItem(k);
    if(id){try{await this.call(`${SHEETS}/${id}?fields=spreadsheetId`)}catch(e){id=null}}
    if(!id){
      const q="name='Petrol Log' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false";
      const f=await this.call(`${DRIVE}?q=${enc(q)}&fields=files(id)&pageSize=1`);
      id=f.files&&f.files[0]&&f.files[0].id;
    }
    if(!id){
      const j=await this.call(SHEETS,{properties:{title:"Petrol Log"},sheets:[{properties:{title:"README"},data:[{startRow:0,startColumn:0,rowData:[{values:[{userEnteredValue:{stringValue:"Petrol Log: each vehicle tab is named by its plate number. Edit your data through the app."}}]}]}]}]});
      id=j.spreadsheetId;
    }
    localStorage.setItem(k,id);return this.id=id;
  },
  async all(){
    await this.ensure();
    const m=await this.call(`${SHEETS}/${this.id}?fields=sheets.properties(sheetId,title)`);
    this.tabs={};m.sheets.forEach(s=>this.tabs[s.properties.title]=s.properties.sheetId);
    const titles=Object.keys(this.tabs);if(!titles.length)return{vehicles:[],logs:{},services:{}};
    const b=await this.call(`${SHEETS}/${this.id}/values:batchGet?valueRenderOption=UNFORMATTED_VALUE&${titles.map(t=>"ranges="+enc(A1(t)+"!A1:L")).join("&")}`);
    const vehicles=[],logs={},services={};
    const day=d=>typeof d==="number"?new Date(Math.round((d-25569)*864e5)).toISOString().slice(0,10):String(d||"");
    const numN=x=>x===""||x==null||!Number.isFinite(+x)?null:+x;
    titles.forEach((t,i)=>{
      const v=(b.valueRanges[i]&&b.valueRanges[i].values)||[];
      if(t===SVC_TAB&&v[0]&&v[0][0]===SVC_TAB){       /* one shared tab for every vehicle's service visits, column B = plate */
        v.slice(2).filter(r=>r[0]&&r[1]).forEach(r=>{const p=String(r[1]);(services[p]=services[p]||[]).push({id:String(r[0]),vehicleId:p,date:day(r[2]),odometer:numN(r[3]),work:String(r[4]||""),charge:numN(r[5])||0,items:svcItems(r[11]),total:numN(r[8])||0,nextDate:r[9]?day(r[9]):"",nextKm:numN(r[10])})});
        return;
      }
      if(!v[0]||v[0][0]!=="Plate")return;
      vehicles.push({id:t,plate:t,name:v[0][3]||""});
      logs[t]=v.slice(2).filter(r=>r[0]).map(r=>({id:String(r[0]),vehicleId:t,date:day(r[1]),odometer:r[2]===""||r[2]==null||!Number.isFinite(+r[2])?null:+r[2],liters:+r[3],price:+r[4],subsidy:+r[5]||0,full:r[6]==="Yes"?1:0}));
    });
    return{vehicles,logs,services};
  },
  async sheetId(plate){if(!this.tabs[plate])await this.all();if(!this.tabs[plate])throw new Error("Vehicle tab not found in your sheet");return this.tabs[plate]},
  async addVehicle({plate,name}){
    await this.ensure();const sid=Math.floor(Math.random()*2e9);
    await this.call(`${SHEETS}/${this.id}:batchUpdate`,{requests:[
      {addSheet:{properties:{sheetId:sid,title:plate,gridProperties:{frozenRowCount:2}}}},
      {repeatCell:{range:{sheetId:sid,startRowIndex:1,endRowIndex:2},cell:{userEnteredFormat:{backgroundColor:{red:.91,green:.35,blue:.05},textFormat:{bold:true,foregroundColor:{red:1,green:1,blue:1}}}},fields:"userEnteredFormat(backgroundColor,textFormat)"}},
      {updateDimensionProperties:{range:{sheetId:sid,dimension:"COLUMNS",startIndex:0,endIndex:1},properties:{hiddenByUser:true},fields:"hiddenByUser"}}]});
    await this.call(`${SHEETS}/${this.id}/values/${enc(A1(plate)+"!A1:H2")}?valueInputOption=RAW`,{values:[["Plate",plate,"Vehicle",name],HEAD]},"PUT");
    this.tabs[plate]=sid;
  },
  async deleteVehicle({plate}){
    await this.ensure();const sid=await this.sheetId(plate);
    const req=[{deleteSheet:{sheetId:sid}}];
    if(this.tabs[SVC_TAB]!=null){                       /* also remove this vehicle's service rows, bottom row first so the indexes stay valid */
      const c=await this.call(`${SHEETS}/${this.id}/values/${enc(A1(SVC_TAB)+"!B:B")}`);
      (c.values||[]).map((r,k)=>k>=2&&String(r[0])===plate?k:-1).filter(k=>k>=0).reverse()
        .forEach(k=>req.push({deleteDimension:{range:{sheetId:this.tabs[SVC_TAB],dimension:"ROWS",startIndex:k,endIndex:k+1}}}));
    }
    await this.call(`${SHEETS}/${this.id}:batchUpdate`,{requests:req});delete this.tabs[plate];
  },
  /* Service log: created the first time a service is saved */
  async svcTab(){
    await this.ensure();if(this.tabs[SVC_TAB]==null)await this.all();
    if(this.tabs[SVC_TAB]!=null)return this.tabs[SVC_TAB];
    const sid=Math.floor(Math.random()*2e9);
    await this.call(`${SHEETS}/${this.id}:batchUpdate`,{requests:[
      {addSheet:{properties:{sheetId:sid,title:SVC_TAB,gridProperties:{frozenRowCount:2}}}},
      {repeatCell:{range:{sheetId:sid,startRowIndex:1,endRowIndex:2},cell:{userEnteredFormat:{backgroundColor:{red:.91,green:.35,blue:.05},textFormat:{bold:true,foregroundColor:{red:1,green:1,blue:1}}}},fields:"userEnteredFormat(backgroundColor,textFormat)"}},
      ...[[0,1],[11,12]].map(([a,z])=>({updateDimensionProperties:{range:{sheetId:sid,dimension:"COLUMNS",startIndex:a,endIndex:z},properties:{hiddenByUser:true},fields:"hiddenByUser"}}))]});
    await this.call(`${SHEETS}/${this.id}/values/${enc(A1(SVC_TAB)+"!A1:L2")}?valueInputOption=RAW`,{values:[[SVC_TAB,"One row per workshop visit, for every vehicle. Edit through the app."],SVC_HEAD]},"PUT");
    return this.tabs[SVC_TAB]=sid;
  },
  async addService({log:s}){
    await this.svcTab();
    await this.call(`${SHEETS}/${this.id}/values/${enc(A1(SVC_TAB)+"!A3")}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,{values:[svcRow(s)]});
  },
  async updateService({log:s}){
    await this.svcTab();
    const i=await this.rowOf(SVC_TAB,s.id);
    if(i<0)throw new Error("Service entry not found in your sheet. Tap Sync now and try again.");
    await this.call(`${SHEETS}/${this.id}/values/${enc(A1(SVC_TAB)+"!A"+(i+1)+":L"+(i+1))}?valueInputOption=USER_ENTERED`,{values:[svcRow(s)]},"PUT");
  },
  async deleteService({id}){
    const sid=await this.svcTab(),i=await this.rowOf(SVC_TAB,id);
    if(i<0)return;
    await this.call(`${SHEETS}/${this.id}:batchUpdate`,{requests:[{deleteDimension:{range:{sheetId:sid,dimension:"ROWS",startIndex:i,endIndex:i+1}}}]});
  },
  async addLog({plate,log:l}){
    await this.ensure();
    await this.call(`${SHEETS}/${this.id}/values/${enc(A1(plate)+"!A3")}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {values:[[l.id,"'"+l.date,l.odometer==null?"":l.odometer,l.liters,l.price,l.subsidy||0,l.full?"Yes":"No",+(l.liters*l.price-(l.subsidy||0)).toFixed(2)]]});
  },
  async rowOf(plate,id){
    const c=await this.call(`${SHEETS}/${this.id}/values/${enc(A1(plate)+"!A:A")}`);
    return(c.values||[]).findIndex((r,k)=>k>=2&&String(r[0])===id);
  },
  async updateLog({plate,log:l}){
    await this.ensure();
    const i=await this.rowOf(plate,l.id);
    if(i<0)throw new Error("Entry not found in your sheet. Tap Sync now and try again.");
    await this.call(`${SHEETS}/${this.id}/values/${enc(A1(plate)+"!A"+(i+1)+":H"+(i+1))}?valueInputOption=USER_ENTERED`,
      {values:[[l.id,"'"+l.date,l.odometer==null?"":l.odometer,l.liters,l.price,l.subsidy||0,l.full?"Yes":"No",+(l.liters*l.price-(l.subsidy||0)).toFixed(2)]]},"PUT");
  },
  async deleteLog({plate,id}){
    await this.ensure();const sid=await this.sheetId(plate);
    const i=await this.rowOf(plate,id);
    if(i<0)return;
    await this.call(`${SHEETS}/${this.id}:batchUpdate`,{requests:[{deleteDimension:{range:{sheetId:sid,dimension:"ROWS",startIndex:i,endIndex:i+1}}}]});
  }
};
/* Used by the services: talks to Google when signed in, otherwise does nothing (local mode). */
async function remote(action,p={}){
  if(Auth.mode!=="google")return null;
  if(action==="all")return Gs.all();
  await Gs[action](p);return{};
}
