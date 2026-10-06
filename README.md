# Petrol Log (Google sign-in edition)

Mobile-first fuel log: average km/L, government subsidy deducted from totals, monthly reports (Excel, PDF, CSV).
Customers sign in with Google. Their data is saved in a sheet called "Petrol Log" in THEIR OWN Google Drive
(one tab per vehicle, tab name = plate number). You store no customer data.

## 1. Google Cloud setup (one time, about 10 minutes)
1. Go to https://console.cloud.google.com and create a project (e.g. "Petrol Log").
2. APIs & Services -> Library -> enable **Google Sheets API** and **Google Drive API**.
3. Google Auth Platform (OAuth consent screen) -> Get started:
   - App name, support email; Audience: **External**; contact email.
   - Data access -> Add scopes: `.../auth/drive.file`, `openid`, `email`, `profile`.
   - Branding: set the privacy policy link to `https://YOUR-APP.vercel.app/privacy.html` (edit the contact line in privacy.html first).
4. Clients -> Create client -> **Web application**:
   - Authorised JavaScript origins: `http://localhost:8000` (testing) and `https://YOUR-APP.vercel.app`
   - No redirect URI is needed.
5. Copy the **Client ID** and paste it into `js/config.js`.
6. While the app is in "Testing", only the Google accounts you list under Audience -> Test users can sign in.
   To open it to everyone, publish the app (check Google's current verification requirements; `drive.file` is a narrow scope).

## 2. Run locally
Google sign-in does not work from `file://`. From this folder run:
    python3 -m http.server 8000
and open http://localhost:8000

## 3. Deploy on Vercel
Push the folder to GitHub -> Vercel -> Add New Project -> import it. Framework: **Other**. No build command, no output directory.
Add the final Vercel URL (and any custom domain) to the OAuth client's Authorised JavaScript origins.
Note: Vercel preview URLs are different origins and must be added too if you want to sign in on them.

## Project structure
```
index.html            markup only
vercel.json           headers (needed for Google's sign-in popup)
privacy.html          privacy policy page (required by Google consent screen)
css/                  tokens.css | base.css | components.css
js/config.js          YOUR Google client ID
js/core/              storage.js (local cache) | auth.js (Google sign-in) | sheets-api.js (Sheets/Drive calls)
js/services/          vehicle | fuel-log | sync | analytics (km/L) | report
js/gateway.js         routes /vehicles /logs /analytics /reports to services
js/ui/                state, components, render, forms, events
js/ui/views/          home | log | reports | vehicles | account | login
js/reports/export.js  Excel / CSV / PDF monthly reports
js/main.js            startup
```

## Notes
- Sign-in lasts about an hour per Google token; the app renews it quietly and asks to sign in again if it cannot.
- "Continue without sign-in" keeps data in the browser only (demo / offline).
- Formulas: km/L = km between full fills / litres added since the previous full fill. Cost = litres x price - subsidy.
