# Change log

All notable changes to Petrol Log. Newest first.

## [1.5.0] - 2026-10-07
### Added
- `terms.html` (Terms of Service) and a rewritten `privacy.html`, both with a "Back to Petrol Log" link and light/dark support.
- App footer on every screen with links to the Privacy Policy and Terms of Service (needed for Google's public consent screen).
### Changed
- Removed the separate "Privacy" link from the login screen; the footer replaces it.
- Before publishing: fill in the contact email (both pages) and the governing law (terms.html). These pages are templates, not legal advice.

## [1.4.0] - 2026-10-07
### Added
- Fill-up form: **"Government subsidy applied?"** switch. Off by default; the fill-up is logged with no subsidy.
- Turning it on reveals the **Subsidy amount** field, and the amount is deducted from the total in "Net payable".
- Turning it off hides and clears the amount. Saving with the switch on and no amount shows a message instead of saving.
### Changed
- The subsidy is only saved when the switch is on (a hidden or cleared amount can never be saved by accident).

## [1.3.0] - 2026-10-07
### Added
- Fill-up form: new **Total amount** field. If you enter price per litre and total amount and leave **Litres** empty, litres is calculated automatically (litres = total / price, rounded to 2 decimals).
- The calculated litres stays live while price or total change, shows a small "Calculated..." hint, and **never overwrites a value you typed**. Clearing the field lets it refill when you leave it.
- New file `js/ui/fuel-fallback.js` (`bindLitersFallback`), handles decimal commas, blank/zero/negative input (no divide by zero) and pre-filled forms.
### Changed
- Fill-up form layout: Odometer, then Price + Total side by side, then Litres, Subsidy and Net payable. The total is the amount before subsidy.

## [1.2.0] - 2026-10-07
### Added
- Account tab: **Appearance** card with Theme (System / Light / Dark) and Currency (PKR, INR, USD, EUR, GBP, AED, SAR). Currency is a display label only, no conversion.
- `js/core/prefs.js`. PDF reports print the 3-letter currency code.
### Changed
- Removed the architecture diagram and gateway traffic log from the Account tab (architecture now lives in the README).
- New Google Sheets are created with currency-free column headers.

## [1.1.0] - 2026-10-06
### Added
- Sign in with Google. Data is stored in a "Petrol Log" sheet in the customer's own Drive (one tab per plate number, `drive.file` scope).
- Login screen, Account tab, `vercel.json`, `privacy.html`.
### Removed
- Apps Script backend and the URL/token settings.

## [1.0.0] - 2026-10-05
### Added
- Mobile-first petrol log: average km/L (full-tank method), cost per km, efficiency chart.
- Government subsidy deducted from totals.
- Monthly reports in Excel, PDF and CSV; plate number required per vehicle.
- Code split into `css/` and `js/` (services, gateway, views).
