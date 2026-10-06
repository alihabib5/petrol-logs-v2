/* Google sign-in (Google Identity Services, OAuth token flow). Scope drive.file = only files this app creates. */
const SCOPE="https://www.googleapis.com/auth/drive.file openid email profile";
const Auth={
  mode:null,user:null,token:null,exp:0,client:null,_rej:null,
  get id(){return this.mode==="google"&&this.user?this.user.sub:"local"},
  configured:()=>/\.apps\.googleusercontent\.com$/.test(PETROL_CONFIG.GOOGLE_CLIENT_ID)&&!/^PASTE/.test(PETROL_CONFIG.GOOGLE_CLIENT_ID),
  async lib(){
    for(let i=0;i<100&&!(window.google&&google.accounts&&google.accounts.oauth2);i++)await new Promise(r=>setTimeout(r,100));
    if(!(window.google&&google.accounts&&google.accounts.oauth2))throw new Error("Google sign-in could not load. Check your internet connection.");
  },
  request(silent){
    return new Promise(async(res,rej)=>{
      try{await this.lib()}catch(e){return rej(e)}
      this._rej=rej;
      this.client=this.client||google.accounts.oauth2.initTokenClient({client_id:PETROL_CONFIG.GOOGLE_CLIENT_ID,scope:SCOPE,callback:()=>{},error_callback:e=>this._rej(new Error(e.message||e.type||"Sign-in cancelled"))});
      this.client.callback=r=>{if(r.error)return rej(new Error(r.error_description||r.error));this.token=r.access_token;this.exp=Date.now()+(r.expires_in-60)*1000;res(r.access_token)};
      this.client.requestAccessToken({prompt:silent?"none":""});
    });
  },
  async signIn(silent){
    const t=await this.request(silent);
    const r=await fetch("https://www.googleapis.com/oauth2/v3/userinfo",{headers:{Authorization:"Bearer "+t}});
    this.user=await r.json();this.mode="google";localStorage.setItem("petrol-mode","google");
  },
  async bearer(){
    if(this.token&&Date.now()<this.exp)return this.token;
    try{return await this.request(true)}
    catch(e){this.mode=null;S.sync="Session expired. Please sign in again.";setTimeout(render,0);throw new Error("Session expired. Please sign in again.")}
  },
  signOut(){
    try{if(this.token&&window.google)google.accounts.oauth2.revoke(this.token,()=>{})}catch(e){}
    DB.clear();Gs.id=null;this.token=null;this.exp=0;this.user=null;this.mode=null;localStorage.removeItem("petrol-mode");
  }
};
