/* Google sign-in (Google Identity Services, OAuth token flow). Scope drive.file = only files this app creates.
   Staying signed in: the Google profile and the (1 hour) access token are kept in this browser's localStorage, so reopening the app
   goes straight to the user's data. Google gives browser-only apps no renewal without a click, so when the hour is up the app keeps
   working on its saved data and shows a "Reconnect" button; only an explicit Sign out returns to the sign-in screen. */
const SCOPE="https://www.googleapis.com/auth/drive.file openid email profile";
const kv={get:k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const Auth={
  mode:null,user:null,token:null,exp:0,client:null,_rej:null,needsReconnect:false,
  get id(){return this.mode==="google"&&this.user?this.user.sub:"local"},
  configured:()=>/\.apps\.googleusercontent\.com$/.test(PETROL_CONFIG.GOOGLE_CLIENT_ID)&&!/^PASTE/.test(PETROL_CONFIG.GOOGLE_CLIENT_ID),
  /* Restore the previous Google session from this browser. Returns false if there is none (then the old silent path is used). */
  restore(){
    const u=kv.get("petrol-user"),t=kv.get("petrol-token");
    if(!u||!u.sub)return false;
    this.user=u;this.mode="google";
    if(t&&t.t&&t.exp>Date.now()+60000){this.token=t.t;this.exp=t.exp;this.needsReconnect=false}
    else{this.token=null;this.exp=0;this.needsReconnect=true}
    return true;
  },
  keep(){kv.set("petrol-user",this.user);kv.set("petrol-token",{t:this.token,exp:this.exp})},
  expire(){this.token=null;this.exp=0;kv.del("petrol-token");this.needsReconnect=true;setTimeout(render,0)},
  async lib(){
    for(let i=0;i<100&&!(window.google&&google.accounts&&google.accounts.oauth2);i++)await new Promise(r=>setTimeout(r,100));
    if(!(window.google&&google.accounts&&google.accounts.oauth2))throw new Error("Google sign-in could not load. Check your internet connection.");
  },
  request(silent){
    return new Promise(async(res,rej)=>{
      try{await this.lib()}catch(e){return rej(e)}
      this._rej=rej;
      this.client=this.client||google.accounts.oauth2.initTokenClient({client_id:PETROL_CONFIG.GOOGLE_CLIENT_ID,scope:SCOPE,callback:()=>{},error_callback:e=>this._rej(new Error(e.message||e.type||"Sign-in cancelled"))});
      this.client.callback=r=>{if(r.error)return rej(new Error(r.error_description||r.error));this.token=r.access_token;this.exp=Date.now()+(r.expires_in-60)*1000;this.needsReconnect=false;if(this.user)this.keep();res(r.access_token)};
      this.client.requestAccessToken({prompt:silent?"none":"",hint:this.user&&this.user.email||undefined}); /* hint = the remembered account, so no account chooser */
    });
  },
  async signIn(silent){
    const t=await this.request(silent);
    const r=await fetch("https://www.googleapis.com/oauth2/v3/userinfo",{headers:{Authorization:"Bearer "+t}});
    this.user=await r.json();this.mode="google";localStorage.setItem("petrol-mode","google");this.keep();
  },
  /* A token for a Google call. Never signs the user out: if it cannot be renewed, the app asks the user to reconnect. */
  async bearer(){
    if(this.token&&Date.now()<this.exp)return this.token;
    try{return await this.request(true)}
    catch(e1){
      try{return await this.request(false)}      /* works when this runs from a tap (Save, Sync now, Reconnect) */
      catch(e2){this.expire();throw new Error("Google needs you to reconnect. Tap Reconnect and try again.")}
    }
  },
  signOut(){
    try{if(this.token&&window.google)google.accounts.oauth2.revoke(this.token,()=>{})}catch(e){}
    DB.clear();Gs.id=null;this.token=null;this.exp=0;this.user=null;this.mode=null;this.needsReconnect=false;
    localStorage.removeItem("petrol-mode");kv.del("petrol-user");kv.del("petrol-token");
  }
};
