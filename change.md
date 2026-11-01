# Change log

All notable changes to Petrol Log. Newest first.

## [2.3.0] - 2026-11-01
### Changed
- **PDF report redesigned from the supplied "Petrol Report" sample** (new `js/reports/pdf.js`). One designed report per vehicle: header with month and plate chip; a large **Net spend** card with a paid-versus-subsidy bar and cost per km; four stat cards (Fuel bought, Avg efficiency, Distance with odometer range, Subsidy saved); an **Efficiency per fill** bar chart with the average as a dashed line and dashed bars for tiny top-ups whose km/L is unreliable; a **Price per litre** trend line with % change; three **insight cards** written from the month's own data (price trend, subsidy share, top-ups, best fill, cost per km); and an **All fills** table with Trip km, thousands-separated totals and km/L chips (orange when above the average, † for small fills). Long months continue the table on further pages with the header repeated.
- Everything is vector (sharp, selectable text). Estimated km/L keeps its "~" marker. A fill counts as a small top-up at 2 L or less; it is flagged unreliable when its km/L is more than 50% away from the month average.
- Excel and CSV exports are unchanged.

## [2.2.1] - 2026-11-01
### Changed
- **Log filters now live in a dropdown** on every screen size. A **Filters** button (with the number of active filters) sits next to the "8 fill-ups" count; it opens a panel over the table (rows do not move) with Search, Type, Total and km/L. It closes with **Done**, **Esc** (focus returns to the button) or a click outside, and starts closed each time you visit the tab. **Clear** appears beside the button while any filter is active; **Clear filters** inside the dropdown resets everything without closing it.

## [2.2.0] - 2026-11-01
### Added
- **Fuel Log is now a filterable table** (adapted from a data-table design). Filters: **Search** (date or odometer), **Total (Rs)** min/max, **Type** (All / Full tank / Partial) and **km/L** min/max, with a live "Showing 3 of 9" count and **Clear filters**. A filter on km/L skips entries that have no km/L yet. Typing in a filter never loses focus (only the rows redraw).
- **Row selection and bulk delete.** Tick rows or use select-all (it selects only the rows currently shown, with a half-ticked state); a bar shows "N selected" with **Clear** and **Delete selected** (asks for confirmation). Selecting keeps keyboard focus on the checkbox. Switching vehicle clears the selection.
- Full-tank / Partial **badges** (green / amber, theme-aware colours that pass contrast) and a row number (#1 = oldest).
### Changed
- **Layout adapts to the screen:** on phones each entry stays a compact card (checkbox + date/odometer + litres line + km/L + edit/delete) with the filters in a collapsible **Filters** panel; from 680 px up it becomes a real table with Fill-up / Total / Type / km/L columns, a header row and the filters always visible. Edit and delete per row still work.

## [2.1.0] - 2026-11-01
### Added
- **New calendar picker** (`js/ui/calendar.js`) for the fill-up date and the Reports month. Rounded card, round day buttons, orange selected day, soft grey "today", muted days from neighbouring months, previous/next buttons, tap the month name to jump through a month grid, and Today / Close buttons. Replaces the browser's native pickers, so it looks the same everywhere and desktop Safari/Firefox (no native month picker) now get a proper one. Follows light and dark themes.
- Keyboard and screen reader support: arrow keys move by day/week (and across months), PageUp/PageDown change month, Enter picks, Esc closes and returns focus, Tab stays inside the dialog; days have full-date labels, `aria-selected` and `aria-current="date"`. A visible focus ring is kept.
### Fixed
- **"Today" was taken from UTC**, so before 5 am in Pakistan the new fill-up form defaulted to yesterday (22 Oct 01:28 showed 21 Oct). The form default, the calendar's "today" and the Reports month now use the local date.

## [2.0.1] - 2026-11-01
### Fixed
- **Design-quality issues flagged by the Impeccable browser extension, fixed everywhere (not just on the sign-in screen):**
  - *Layout property animation:* the chart bars animated `height`, which forces layout. They now animate `transform: scaleY` on a pseudo-element (GPU-friendly), and the gauge/bars share one `settle()` step using `setProperty`.
  - *Cramped padding:* every text button had 0 px vertical padding and relied on `min-height`. All buttons now have at least 10 px (rule: >= 0.3em).
  - *Low contrast text:* error red (3.8 to 4.3:1) is now a theme token `--err` (#c92a2a light, #ff6b6b dark). Light theme: muted grey #6b6f78 to #62666f (4.5 to 5.1:1), accent #e8590c to #c8440c so white button text passes (3.6 to 4.9:1), green #2b8a3e to #237a35. Text on the hero's orange glow uses a stronger `--hero-mute` token (measured on the real rendered pixels: lowest 4.72:1). `privacy.html` and `terms.html` got the same light-theme colours.
  - Small text raised: tab labels and chart values 10-11 px to 12 px.
- Every text/background pair on every screen, in light and dark, at phone and desktop width, now measures at least 4.5:1 (3:1 for large text).

## [2.0.0] - 2026-11-01
### Changed
- **Privacy Policy and Terms of Service moved out of the footer.** The footer is gone. The links now appear (1) on the sign-in screen as "By continuing you agree to the Terms of Service and Privacy Policy" under the sign-in buttons, which keeps them visible on the app's home page for Google's consent screen, and (2) in a new **About** card in the Account tab.
### Fixed
- **Compatibility and adaptivity gaps found in review:**
  - The hero glow now has a plain gradient that works everywhere; the theme-aware `color-mix` version is applied only where supported. Viewport heights fall back from `svh` to `vh`.
  - Report month field: browsers without a month picker (desktop Safari and Firefox show a text box) now get a "YYYY-MM" format hint, and the value is validated before it is used.
  - Bottom sheets scroll on short screens (phone landscape) instead of being cut off; sign-in screen respects notch / safe-area insets.
  - Touch: the subsidy and full-tank switches have a 44 px tap area and their labels are tappable; the Light / Dark / System buttons are 44 px tall and shrink instead of overflowing at high zoom.
  - Text size adjustment locked to 100% so phones do not inflate text in landscape.
### Known limits
- Font sizes are fixed px, so an OS-level "larger text" setting is not followed (browser zoom works, tested to 150% on a phone width). Firefox was not tested (see README).

## [1.9.0] - 2026-11-01
### Added
- **Dynamic motion.** Screens are rebuilt from HTML on every update, which used to cancel CSS transitions (the gauge arc and chart bars never actually animated). Now:
  - a **view change** (switching tab, signing in or out) fades the page's blocks in one after another; re-rendering the *same* view (picking a vehicle, saving, syncing, the sign-in spinner) never replays it;
  - the **gauge arc** sweeps from its previous value (or from empty on a new view) to the new average, and the **efficiency bars** grow in with a stagger;
  - the **tab bar** is built once so the active tab highlight transitions instead of snapping; buttons ease and press down; the bottom sheet's backdrop fades;
  - the sign-in hero animates every time it appears (including after sign-out), not only on the first load;
  - everything is switched off for users with reduced-motion enabled.
### Changed
- **Responsive polish.** Audited at 320, 360, 390, 768, 1024 and 1440 px on every tab and form (no horizontal overflow). Fixes: on wide screens the "+ Fill-up" button now sits beside the content column instead of at the far screen edge or on top of rows; stat figures scale down on narrow phones so "Rs 30,579" stays on one line; the edit and delete buttons use proper SVG icons instead of text glyphs.

## [1.8.0] - 2026-11-01
### Changed
- **New sign-in screen, ported from the Hero 37 layout** in plain HTML/CSS (no React, no framer-motion): full-width hero with a brand bar and "Sign in" link, a two-line headline ("Every litre, every kilometre."), subtitle, **Sign in with Google** (with arrow and the spinner) and **Continue without sign-in**, two small facts bottom-left and a tagline bottom-right. It stacks on phones.
- Uses the app's own look: theme tokens (light / dark / system), the orange accent as a CSS gradient glow (new `--glow` token) instead of the template's hosted background image, and the gauge as the logo. The entrance animation (blur + rise, staggered) plays once, not on every re-render, and is disabled for reduced-motion users.
### Removed
- The old centred login styles.

## [1.7.1] - 2026-11-01
### Changed
- **Account tab: "Sync now" is now an inline action row** (Google Sheet icon, label, status text and a button). While syncing the button shows a spinner and is disabled, the status reads "Syncing with your Drive...", then "Synced with Google Drive ✓" (or a red "Sync failed: ..." message and the button returns). Extra clicks are ignored while a sync is running, and the spinner stays at least 0.6 s so it is visible. Adapted from an InlineAction component pattern, in plain HTML/CSS (no React).

## [1.7.0] - 2026-11-01
### Changed
- **PDF report redesigned.** Four headline figures at the top: **total money** (net after subsidy), **distance travelled**, **average fuel (km/L)** and **fuel filled (litres)**, with a gross - subsidy = net line and the fill-up count below. Each vehicle repeats the same summary above its table and ends with a **Total** row (distance, litres, subsidy, net, average km/L). A "~" still marks estimated km/L.
- Distance for a month is the sum of the km between consecutive odometer readings, including the drive from the previous month's last reading to the first fill. New `dist` figure in `ReportService` (per vehicle and overall).

## [1.6.0] - 2026-10-22
### Added
- **Edit a fill-up.** A pencil button on each Log row opens the fill-up form pre-filled; Save updates the entry in place (same ID, same row in Google Sheets). Same validation as a new entry, and the entry being edited is ignored in the odometer-order check. New `PUT /logs/<id>` route, `FuelLogService.update`, `Gs.updateLog`.
- **Estimated km/L from odometer readings**, shown only when there is no exact figure yet (no two full-tank fills). Per fill: (new odometer - previous odometer) / litres of the previous refill. Overall: (last odometer - first odometer) / litres of every refill except the last. Always marked with "~" on Home, Log rows, Reports, Excel, CSV and PDF; Home explains how to get the exact average. Exact full-tank figures are unchanged and always take priority.
### Changed
- **Fill-up form: price x litres = total are linked.** Enter any two and the third is calculated (litres = total / price, price = total / litres, total = litres x price). The two fields you touched most recently are kept and the remaining one is recalculated; a hint says which. Clearing a field leaves it empty while you type and refills it when you leave it. The total is before subsidy. Replaces the one-way litres fallback from 1.3.0 (`bindLitersFallback` is now `bindFillLinks`).
- On edit, price and litres are kept and the total is calculated and shown.

## [1.5.1] - 2026-10-22
### Fixed
- The app footer (Privacy Policy and Terms of Service links) now exists on every screen; 1.5.0 documented it but it was never added. Removed the leftover login-screen "Privacy" link.
- Privacy policy contact email filled in.
- Sign-in now shows an animated spinner on the button (both buttons disabled while signing in) instead of red "Signing in..." text.
### Removed
- Unused CSS (architecture panel and traffic log styles) and the gateway traffic log nothing displayed.

## [1.5.0] - 2026-10-07
### Added
- `terms.html` (Terms of Service) and a rewritten `privacy.html`, both with a "Back to Petrol Log" link and light/dark support.
- App footer on every screen with links to the Privacy Policy and Terms of Service (needed for Google's public consent screen). Actually added in 1.5.1.
### Changed
- Removed the separate "Privacy" link from the login screen; the footer replaces it.
- Before publishing: check the contact email (both pages) and the governing law (terms.html). These pages are templates, not legal advice.

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
