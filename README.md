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
   - Branding: set the privacy policy link to `https://YOUR-APP.vercel.app/privacy.html` and the terms of service link to `https://YOUR-APP.vercel.app/terms.html`. Check the contact email and governing law in both pages first.
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

## Architecture
```
Client (mobile-first web UI, hosted on Vercel)
   |
API Gateway   /vehicles  /logs  /analytics  /reports
   |
Services      VehicleService | FuelLogService | AnalyticsService | ReportService | SyncService
   |
Google Sign-In + Sheets API   (OAuth, drive.file scope)
   |
Customer's own Google Drive   Sheet "Petrol Log", one tab per plate number
```

## Project structure
```
index.html            markup only
vercel.json           headers (needed for Google's sign-in popup)
privacy.html          privacy policy page (required by Google consent screen; linked from the sign-in screen and the Account tab)
terms.html            terms of service page (linked from the consent screen, the sign-in screen and the Account tab)
css/                  tokens.css | base.css | components.css
js/config.js          YOUR Google client ID
js/core/              prefs.js (theme + currency) | storage.js (local cache) | auth.js (Google sign-in) | sheets-api.js (Sheets/Drive calls)
js/services/          vehicle | fuel-log | sync | analytics (km/L) | report
js/gateway.js         routes /vehicles /logs /analytics /reports to services
js/ui/                state, calendar (date + month picker), components, render, forms, fuel-fallback (price/litres/total linking), events
js/ui/views/          home | log | reports | vehicles | account | login (hero sign-in screen)
js/reports/export.js  Excel / CSV / PDF monthly reports
js/main.js            startup
```

## Fill-up form: price, litres and total are linked
Price per litre x litres = total. Enter any two and the third is calculated: price + total gives litres, litres + total gives price, litres + price gives total (2 decimals).
The two fields you touched most recently are kept; the remaining one is recalculated, and a hint says which. Clear a field and it stays empty while you type, then refills when you leave it.
The total is the amount before subsidy. Logic: `js/ui/fuel-fallback.js` (`bindFillLinks`).

## Editing and deleting entries
Log tab: the pencil on each row reopens the fill-up form with that entry's values; Save updates it in place (and the same row in your Google Sheet). The cross deletes it. Edits follow the same rules as new entries.

## PDF report
Headline figures first: total money (net after subsidy), distance travelled, average fuel (km/L) and litres filled; then one table per vehicle with a Total row. Distance = sum of the km between consecutive odometer readings in the month. A "~" marks an estimated km/L.

## Fuel Log table
The Log tab lists your fill-ups as a table you can filter by date/odometer text, total cost, full or partial, and km/L, with a count of what is shown. Tick rows (or select all shown rows) to delete several at once. On phones it is a list of cards with a Filters button; on wide screens it is a table with columns. Code: `js/ui/views/log.js`, styles `Log table` in `css/components.css`.

## Calendar
The fill-up date and the Reports month use the app's own calendar (rounded card, orange selected day). Arrow keys move between days, PageUp/PageDown change month, Enter picks, Esc closes. "Today" always means your local date. Code: `js/ui/calendar.js`.

## Subsidy switch
The fill-up form has a **Government subsidy applied?** switch. Off (default): no subsidy, just log the fuel.
On: a Subsidy amount field appears and the amount is deducted from the total in "Net payable" and in all cost totals and reports.

## Average km/L
Exact: km between full-tank fills / litres added since the previous full fill. Needs two full-tank fills.
Until then an **estimate** from odometer readings is shown with a "~": (new odometer - previous odometer) / litres of the previous refill; overall (last - first odometer) / litres of every refill except the last. The tank level is unknown for partial fills, so treat it as a guide. Exact figures replace it automatically.

## Motion and layout
Screens animate in when you change view (tab, sign-in, sign-out), not when the same screen refreshes. The gauge arc and chart bars move from their previous value to the new one. All animation is off when the device asks for reduced motion. The layout is mobile first and checked from 320 to 1440 px wide. See `render()` / `settle()` in `js/ui/render.js` and the "Motion" block at the end of `css/components.css`.

## Browser and device support
Tested: Chrome (desktop and phone/tablet emulation with touch, portrait and landscape, 320 to 3840 px) and WebKit (Safari's engine). Not tested: Firefox, real iPhone/Android hardware. Modern features (`color-mix`, `svh`, `<input type=month>`) have fallbacks. Fonts are fixed px, so OS-level "larger text" is not followed (browser zoom is).

## Notes
- Sign-in lasts about an hour per Google token; the app renews it quietly and asks to sign in again if it cannot.
- Account tab: a Google Sheet row with a **Sync now** button (spinner while syncing, then a status line); Theme (System / Light / Dark) and Currency (display label only, no conversion); saved on the device.
- "Continue without sign-in" keeps data in the browser only (demo / offline).
- Cost = litres x price - subsidy. Cost per km needs an exact km/L.

## Version history
See `change.md` for what changed in each version.
