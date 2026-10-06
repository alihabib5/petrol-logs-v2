/* UI state, helpers, icons, tab list */
const S={tab:"home",vid:null,vehicles:[],data:null,month:new Date().toISOString().slice(0,7),rv:"*",report:null,sync:""};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const f1=n=>n===null||n===undefined?"–":n.toFixed(1);
const money=n=>"Rs "+Math.round(n).toLocaleString();
const IC={home:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>',
 log:'<path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
 car:'<path d="M4 15l2-6h12l2 6v4h-3v-2H7v2H4zM7 14h.01M17 14h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
 rep:'<path d="M5 20V10M12 20V4M19 20v-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
 srv:'<path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'};
const TABS=[["home","Home"],["log","Log"],["rep","Reports"],["cars","Vehicles"],["srv","Account"]];
