/* Bootstrap: resume the previous session if there was one */
(async()=>{
  const m=localStorage.getItem("petrol-mode");
  if(m==="local"){Auth.mode="local";DB.load()}
  else if(m==="google"&&Auth.configured()){try{await Auth.signIn(true);DB.load();await SyncService.pull()}catch(e){Auth.mode=null;S.sync=""}}
  refresh();
})();
