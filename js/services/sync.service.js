/* SyncService */
const SyncService={async pull(){const j=await remote("all");if(!j)return false;DB.v=j.vehicles;DB.l=j.logs;DB.s=j.services||{};DB.save();return true}};
