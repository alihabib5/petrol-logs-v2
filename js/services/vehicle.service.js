/* VehicleService */
const VehicleService={
  list:()=>DB.v,
  async add(b){
    const plate=normPlate(b.plate);
    if(!plate)throw new Error("Plate number is required");
    if(!b.name)throw new Error("Vehicle name required");
    if(DB.v.find(x=>x.id===plate))throw new Error("This plate number already exists");
    if(["README",SVC_TAB.toUpperCase()].includes(plate))throw new Error("That name is used by the app's own sheet tab. Enter the plate number");
    await remote("addVehicle",{plate,name:b.name});
    const v={id:plate,plate,name:b.name};DB.v.push(v);DB.l[plate]=[];DB.save();return v;
  },
  async remove(id){await remote("deleteVehicle",{plate:id});DB.v=DB.v.filter(x=>x.id!==id);delete DB.l[id];delete DB.s[id];DB.save()}
};
