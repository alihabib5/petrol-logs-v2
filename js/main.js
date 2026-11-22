/* Bootstrap: resume the previous session. A remembered Google user goes straight to their saved data; syncing happens afterwards. */
{const t=new URLSearchParams(location.search).get("tab");if(TABS.some(x=>x[0]===t))S.tab=t}  /* ?tab=svc opens a tab directly (old portal.html links) */
(async()=>{
  const m=localStorage.getItem("petrol-mode");
  if(m==="local"){Auth.mode="local";DB.load();await refresh()}
  else if(m==="google"&&Auth.configured()){
    if(Auth.restore()){
      DB.load();await refresh();                                   /* show saved data immediately */
      try{if(Auth.needsReconnect)await Auth.request(true);Track.ping();await SyncService.pull()}  /* quiet renewal; a failure just leaves the Reconnect banner. Track: daily sign-in record */
      catch(e){if(!Auth.token)Auth.needsReconnect=true}
    }else{                                                          /* sessions saved before this version: show sign-in, try the old silent path */
      await refresh();
      try{await Auth.signIn(true);Track.ping();DB.load();await SyncService.pull()}catch(e){Auth.mode=null;S.sync=""}
    }
  }
  refresh();
})();
