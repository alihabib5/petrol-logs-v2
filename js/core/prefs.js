/* Preferences: theme (system / light / dark) and display currency. Saved on this device. */
const CURRENCIES=[["PKR","Rs","Pakistani Rupee"],["INR","₹","Indian Rupee"],["USD","$","US Dollar"],["EUR","€","Euro"],["GBP","£","British Pound"],["AED","AED","UAE Dirham"],["SAR","SAR","Saudi Riyal"]];
const Prefs={
  d:{theme:"system",cur:"PKR"},pdf:false,
  load(){try{Object.assign(this.d,JSON.parse(localStorage.getItem("petrol-prefs"))||{})}catch(e){}this.applyTheme()},
  set(k,v){this.d[k]=v;try{localStorage.setItem("petrol-prefs",JSON.stringify(this.d))}catch(e){}if(k==="theme")this.applyTheme()},
  applyTheme(){const r=document.documentElement;if(!r)return;if(this.d.theme==="system")r.removeAttribute("data-theme");else r.setAttribute("data-theme",this.d.theme)},
  code(){return this.d.cur},
  /* symbol for screens and Excel; PDF fonts cannot draw every symbol, so PDFs use the 3-letter code */
  sym(){if(this.pdf)return this.d.cur;const c=CURRENCIES.find(x=>x[0]===this.d.cur);return c?c[1]:this.d.cur}
};
Prefs.load();
