/* Sign-in records (Supabase). After a Google sign-in, tell the track-signin Edge Function which account signed in.
   The function checks the token with Google before recording it, so entries can't be faked from the browser.
   Fire-and-forget: it never blocks or fails sign-in, runs at most once a day per account (forced on an explicit sign-in),
   and sends nothing in offline mode or when Supabase isn't configured. Vehicle and fuel records are never sent. */
const Track={
  async ping(force){
    const c=PETROL_CONFIG;
    if(!c.SUPABASE_URL||!c.SUPABASE_PUBLISHABLE_KEY||Auth.mode!=="google"||!Auth.token)return false;
    const k="petrol-tracked:"+Auth.id,day=new Date().toISOString().slice(0,10);
    try{if(!force&&localStorage.getItem(k)===day)return false}catch(e){}
    try{
      const r=await fetch(c.SUPABASE_URL.replace(/\/$/,"")+"/functions/v1/track-signin",{method:"POST",
        headers:{"Content-Type":"application/json",apikey:c.SUPABASE_PUBLISHABLE_KEY},body:JSON.stringify({access_token:Auth.token})});
      if(r.ok){try{localStorage.setItem(k,day)}catch(e){}return true}
    }catch(e){}
    return false;
  }
};
