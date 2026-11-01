/* Bootstrap: resume the previous session. A remembered Google user goes straight to their saved data; syncing happens afterwards. */
(async()=>{
  const m=localStorage.getItem("petrol-mode");
  if(m==="local"){Auth.mode="local";DB.load();await refresh()}
  else if(m==="google"&&Auth.configured()){
    if(Auth.restore()){
      DB.load();await refresh();                                   /* show saved data immediately */
      try{if(Auth.needsReconnect)await Auth.request(true);await SyncService.pull()}  /* quiet renewal; a failure just leaves the Reconnect banner */
      catch(e){if(!Auth.token)Auth.needsReconnect=true}
    }else{                                                          /* sessions saved before this version: show sign-in, try the old silent path */
      await refresh();
      try{await Auth.signIn(true);DB.load();await SyncService.pull()}catch(e){Auth.mode=null;S.sync=""}
    }
  }
  refresh();
})();
