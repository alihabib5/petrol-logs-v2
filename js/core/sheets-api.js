/* Google Sheets / Drive REST calls. One spreadsheet "Petrol Log" in the customer's Drive; one tab per plate number. */
const SHEETS="https://sheets.googleapis.com/v4/spreadsheets",DRIVE="https://www.googleapis.com/drive/v3/files";
const HEAD=["ID","Date","Odometer (km)","Litres","Price per litre (Rs)","Subsidy (Rs)","Full tank","Net total (Rs)"];
const A1=t=>"'"+t.replace(/'/g,"''")+"'";
const enc=encodeURIComponent;
const Gs={
  id:null,tabs:{},
  async call(url,body,method){
    const t=await Auth.bearer();
    const r=await fetch(url,{method:method||(body?"POST":"GET"),headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});
    if(r.status===401){Auth.exp=0;throw new Error("Session expired. Please sign in again.")}
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
    const titles=Object.keys(this.tabs);if(!titles.length)return{vehicles:[],logs:{}};
    const b=await this.call(`${SHEETS}/${this.id}/values:batchGet?valueRenderOption=UNFORMATTED_VALUE&${titles.map(t=>"ranges="+enc(A1(t)+"!A1:H")).join("&")}`);
    const vehicles=[],logs={};
    const day=d=>typeof d==="number"?new Date(Math.round((d-25569)*864e5)).toISOString().slice(0,10):String(d||"");
    titles.forEach((t,i)=>{
      const v=(b.valueRanges[i]&&b.valueRanges[i].values)||[];
      if(!v[0]||v[0][0]!=="Plate")return;
      vehicles.push({id:t,plate:t,name:v[0][3]||""});
      logs[t]=v.slice(2).filter(r=>r[0]).map(r=>({id:String(r[0]),vehicleId:t,date:day(r[1]),odometer:+r[2],liters:+r[3],price:+r[4],subsidy:+r[5]||0,full:r[6]==="Yes"?1:0}));
    });
    return{vehicles,logs};
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
    await this.call(`${SHEETS}/${this.id}:batchUpdate`,{requests:[{deleteSheet:{sheetId:sid}}]});delete this.tabs[plate];
  },
  async addLog({plate,log:l}){
    await this.ensure();
    await this.call(`${SHEETS}/${this.id}/values/${enc(A1(plate)+"!A3")}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {values:[[l.id,"'"+l.date,l.odometer,l.liters,l.price,l.subsidy||0,l.full?"Yes":"No",+(l.liters*l.price-(l.subsidy||0)).toFixed(2)]]});
  },
  async deleteLog({plate,id}){
    await this.ensure();const sid=await this.sheetId(plate);
    const c=await this.call(`${SHEETS}/${this.id}/values/${enc(A1(plate)+"!A:A")}`);
    const i=(c.values||[]).findIndex((r,k)=>k>=2&&String(r[0])===id);
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
