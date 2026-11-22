/* VehicleService + vehicle types.
   A vehicle is Petrol, Diesel or Electric. Fill-up records keep the same fields for all types: for an electric vehicle
   "liters" holds kWh charged, "price" is the price per kWh and "full" means charged to full, so the km/L maths gives km/kWh.
   Vehicles saved before types existed have no type and count as Petrol. */
const VTYPES=[["petrol","Petrol"],["diesel","Diesel"],["electric","Electric"]];
const vType=v=>VTYPES.some(t=>t[0]===(v&&v.type))?v.type:"petrol";
const isEV=v=>vType(v)==="electric";
const vTypeName=v=>VTYPES.find(t=>t[0]===vType(v))[1];
/* Wording and scales per kind of energy */
const UNITS={
  fuel:{u:"L",amount:"Litres",per:"litre",eff:"km/L",effLong:"km / litre",fill:"fill-up",Fill:"Fill-up",fills:"fill-ups",full:"Full tank",fullQ:"Filled to full tank",
    log:"Fuel Log",bought:"Fuel bought",cost:"fuel cost",gauge:30,twoFull:"Fill the tank fully twice in a row for an exact average.",needTwo:"Log two full-tank fills to see efficiency.",small:2},
  ev:{u:"kWh",amount:"kWh",per:"kWh",eff:"km/kWh",effLong:"km / kWh",fill:"charge",Fill:"Charge",fills:"charges",full:"Full charge",fullQ:"Charged to full",
    log:"Charging Log",bought:"Energy charged",cost:"charging cost",gauge:12,twoFull:"Charge to full twice in a row for an exact average.",needTwo:"Log two full charges to see efficiency.",small:2}
};
/* Home charging (2.11.0): most owners charge at home with no receipt, and few know their battery size. A charge records the
   battery % at plug-in and at unplug plus the odometer, so the drive between two charges used (last unplug % - this plug-in %).
   Battery size: entered, else learned from public charges that have a receipt (kWh / % added). Home cost: % added x battery size
   / 0.9 (about 10% is lost charging from the wall) x the electricity rate per unit from the owner's bill (amount / units). */
const CHARGE_LOSS=0.9;
const evPct=l=>l&&l.bs!=null&&l.be!=null;
function learnedCap(vid){
  const xs=(DB.l[vid]||[]).filter(x=>x.src==="public"&&evPct(x)&&x.be-x.bs>=10&&x.liters>0).map(x=>x.liters/((x.be-x.bs)/100)).sort((a,b)=>a-b);
  return xs.length?xs[Math.floor(xs.length/2)]:null;          /* median of the receipts */
}
const evCap=v=>v?(v.cap>0?v.cap:learnedCap(v.id)):null;
const hasPct=v=>!!v&&(DB.l[v.id]||[]).some(evPct);
UNITS.evpct={...UNITS.ev,eff:"km per 1%",effLong:"km per 1% of battery",gauge:10};   /* EV with battery % but no battery size yet */
const UL=v=>isEV(v)?(hasPct(v)&&!evCap(v)?UNITS.evpct:UNITS.ev):UNITS.fuel;
const curV=()=>DB.v.find(v=>v.id===S.vid);   /* the selected vehicle (S lives in the UI layer, read at call time) */

const VehicleService={
  list:()=>DB.v,
  async add(b){
    const plate=normPlate(b.plate),type=b.type||"petrol";
    if(!plate)throw new Error("Plate number is required");
    if(!b.name)throw new Error("Vehicle name required");
    if(!VTYPES.some(t=>t[0]===type))throw new Error("Choose Petrol, Diesel or Electric");
    if(DB.v.find(x=>x.id===plate))throw new Error("This plate number already exists");
    if(["README",SVC_TAB.toUpperCase()].includes(plate))throw new Error("That name is used by the app's own sheet tab. Enter the plate number");
    await remote("addVehicle",{plate,name:b.name,type});
    const v={id:plate,plate,name:b.name,type};DB.v.push(v);DB.l[plate]=[];DB.save();return v;
  },
  /* EV charging settings: battery size (kWh) and home electricity rate (Rs per unit); empty = not set */
  async updateCharging(id,b){
    const v=DB.v.find(x=>x.id===id);if(!v)throw new Error("Vehicle not found");
    const num=x=>x===""||x==null?null:+x,cap=num(b.cap),rate=num(b.rate);
    if(cap!==null&&!(cap>=1&&cap<=300))throw new Error("Battery size should be between 1 and 300 kWh, or leave it empty");
    if(rate!==null&&!(rate>0&&rate<=500))throw new Error("Rate per unit should be between Rs 1 and Rs 500, or leave it empty");
    await remote("updateVehicle",{plate:id,cap,rate});
    v.cap=cap;v.rate=rate;DB.save();return v;
  },
  async remove(id){await remote("deleteVehicle",{plate:id});DB.v=DB.v.filter(x=>x.id!==id);delete DB.l[id];delete DB.s[id];DB.save()}
};
