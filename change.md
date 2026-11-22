# Change log

All notable changes to Safri (formerly Sawari and Petrol Log). Newest first.

## [2.14.0] - 2026-11-22
### Added
- **Landing page** at the front of the site (`index.html`): "Your travel costs, in your own Google Drive." It shows an example Safri sheet getting a new row from a fill-up, where records go (your Drive, never our servers), what Safri can open and keeps, how to leave, the sums Safri works out, and the 2028 plan. People who already use the app go straight to it.
- **New safri logo** (app icon) on the landing page, sign-in screen, sidebar and as the browser icon; lowercase "safri" wordmark.
### Changed
- The app moved from `index.html` to `app.html` (served at `/app` with clean URLs). `portal.html` points there.

## [2.13.0] - 2026-11-22
### Changed
- **The app is now called Safri** (it was Sawari). "Safri" (سفری) means "for travel", as in *safri akhrajaat*, travel expenses: it fits the owner's own vehicle today and public transport and ride-hailing later. The new name is on the browser tab, sign-in screen, sidebar, reports (PDF title, `safri-report-…` file names), Privacy Policy and Terms.
- **Google Sheet:** new users get a sheet called "Safri". An existing "Sawari" or "Petrol Log" sheet is found as before and **renamed to "Safri" in place** the next time its owner uses the app; no data moves. Saved browser data keeps its `petrol-*` keys, so nobody is signed out.

## [2.12.0] - 2026-11-22
### Added
- **Sign-in records with Supabase.** After a Google sign-in (and at most once a day while signed in), the app tells a Supabase Edge Function (`track-signin`) which account signed in. The function checks the token with Google and that it was issued to Sawari's own client before recording anything, then keeps one row per account in `public.app_users`: Google id, name, email, picture, first and last sign-in, and sign-in count. The table is locked (row level security, no policies); only the function's secret key can write and only the owner can read it in the dashboard. Vehicle, fuel and service records are never sent. Offline mode sends nothing, and the record never slows or blocks sign-in.
- Setup files: `supabase/migrations/…_app_users.sql`, `supabase/functions/track-signin/index.ts`, `supabase/config.toml`. Steps in the README ("Sign-in records").
### Changed
- **Privacy Policy:** new "Sign-in records" section describing what is kept, where (Supabase), that records are never sent, and how to ask for deletion.

## [2.11.0] - 2026-11-22
### Added
- **Home charging for electric vehicles.** Most owners charge at home, with no receipt and no idea of their battery size. Each charge now has **Home** or **Public charger**, plus the **battery % at plug-in** and **at unplug** and the odometer.
  - **Efficiency from battery %:** between two charges, km driven ÷ battery % used (last unplug % − this plug-in %) = **km per 1% of battery**. This works with nothing else entered. For example: unplug at 90% at 12,000 km, next plug-in at 30% at 12,280 km = 280 km on 60% = 4.7 km per 1%.
  - **Battery size, learned:** a public charge with its receipt kWh and battery % teaches the app the battery size (kWh ÷ % added; the median of all such receipts). It can also be typed in. Once known, efficiency shows in km/kWh.
  - **Home cost from the electricity bill:** a new **Charging settings** form (Vehicles → an electric vehicle) holds the battery size and the home rate per unit. Type the units used and the amount payable from any K-Electric, LESCO, IESCO or other bill and it works out the rate (amount ÷ units). Home charge cost = % added × battery size ÷ 0.9 (about 10% is lost charging from the wall) × rate, shown as an estimate (≈).
  - The charge form shows a live summary ("Added 55% of the battery · ≈ 28.1 kWh · ≈ Rs 1,870"). Home shows a "Home charging cost not set" card until the rate and size are known; unknown costs show as "–", never as Rs 0.
  - Google Sheet: electric vehicles' tabs gain columns I-K (Battery % at plug-in, Battery % at unplug, Where). Charging settings are stored in row 1 (G1:J1). Older electric tabs get the new headers the first time a charge is saved.
### Changed
- **Government subsidy is for petrol only.** The subsidy switch no longer appears for diesel or electric vehicles (an older entry that already has a subsidy still shows it). "Total spent" drops "(after subsidy)" for them.
### Fixed
- Elements marked hidden could still show when their style set a display (this is why the subsidy switch appeared on electric charges).

## [2.10.0] - 2026-11-22
### Changed
- **New look: plain, familiar and easy to navigate.** Chosen with the owner over two more expressive directions (Metro Lines and truck art): "simple and easier to navigate", "plain and familiar, but not a finance app".
  - Colours: the owner's favourite **bottle green** (#173E2F, from their own reference image) is the brand colour. It paints the desktop sidebar and the sign-in screen, and colours buttons, the selected tab, the gauge and the chart. Around it: a cool light-grey background and white cards with thin borders. Red and amber appear only for overdue and due soon; a brighter green only for "OK". Matching dark theme.
  - Controls: 10-12px corners, white inputs with a green focus ring, a select arrow, section headings in normal sentence case instead of small grey capitals, and a segmented theme switch with a white selected segment.
  - Phones: a plain bottom tab bar across the full width (was a blurred floating pill), with a green pill behind the active tab's icon.
  - Desktop: a bottle-green sidebar with white text, a white pill on the active item, and a new steering-wheel mark; the "+" button sits in the bottom-right of the content.
  - Sign-in: one white card on the bottle green, with the name, a short description, three points and the two buttons (was a full-screen animated hero).
  - Text selection, the text cursor, scrollbars and checkboxes now use the app's colours. View changes use one short fade instead of a staggered cascade.
  - Privacy and Terms use the new colours and a clearer heading scale.
  - Page headers: Home, Log and Service share one header: the page title, the vehicle picker and the main button ("+ Fill-up", "+ New service", with a drawn plus icon). On desktop they sit at the top right; on phones the button shares the title row and the picker goes underneath (Log keeps its floating button on phones). Home's heading is now "Home" (it repeated "Sawari").
  - Desktop Home shows its four stats in one row.
  - Colour means status only: km/L figures and the "Full tank" badge are neutral now; "Partial" is a muted outline.
  - Log rows show dates as "22 Nov 2026" (like the form and Service), amounts never split across lines, and search matches that date format too.
  - Sidebar subtitle in offline mode shortened to "Saved in this browser" (it was cut off).
### Fixed
- **The efficiency gauge always showed a full ring for motorbikes**: its scale stopped at 30 km/L. It now scales to the vehicle's own best (51.9 km/L with a best of 79.2 shows about half), so it says something.
- Each efficiency bar now shows its date underneath.
- The vehicle picker in the page header had lost its dropdown arrow.
- On desktop, the fill-up form and date picker now dim the sidebar too (they used to sit under it).
- The value above the tallest efficiency bar was cut off.
- Product chips in the service table are neutral (they were amber, which read as a warning).
### Added
- `PRODUCT.md`: product context for future design work.

## [2.9.1] - 2026-11-22
### Added
- **Sign-out button in the sidebar**, next to your name and email at the bottom (under your avatar when the sidebar is collapsed). In offline mode it reads "Back to sign-in". The Users page keeps its own Sign out button.
### Fixed
- **"Back to sign-in" no longer deletes offline data.** Signing out used to clear the browser's saved data for every mode; in offline mode that is the only copy, so it was lost. Now only a Google account's cached copy is cleared (its data is safe in the Sheet), and offline data is there again when you choose "Continue without sign-in".

## [2.9.0] - 2026-11-22
### Changed
- **The app is now called Sawari** (it was Petrol Log), ready for electric vehicles now and public transport and ride-hailing later. The new name is on the browser tab, the sign-in screen (new headline "Every ride, every kilometre."), the sidebar, Home, the PDF ("Sawari Report — November 2026"), export file names (`sawari-report-2026-11`), and the Privacy Policy and Terms (updated 22 November 2026, which also now mention EV charging and services).
- **Google Sheet:** new users get a sheet called "Sawari". An existing "Petrol Log" sheet is found as before and **renamed to "Sawari" in place** the next time its owner uses the app; if Google refuses the rename, the app keeps using it under the old name. No data is copied and no empty sheet is created.
- Saved sessions, offline data and preferences are untouched (their internal names stay the same), so nobody is signed out.
- Per-vehicle PDF headers still say PETROL / DIESEL / EV CHARGING REPORT.

## [2.8.0] - 2026-11-22
### Added
- **Electric vehicles.** Adding a vehicle now has a **Type** dropdown: Petrol, Diesel or Electric. For an electric vehicle the app logs **charges** instead of fill-ups: kWh charged, price per kWh and "Charged to full", and shows efficiency in **km per kWh** (the gauge runs to 12 instead of 30). Every screen follows the vehicle's type: Home ("average km / kWh", "Last charge km/kWh"), the **Charging Log** ("+ Charge", "Full charge", km/kWh column and filter), Reports, Excel/CSV (kWh and km/kWh headers, a Type column in the summary) and the PDF ("EV Charging Report", "Energy charged", "Price per kWh", charging insights). The subsidy switch is hidden for electric vehicles.
- Reports for **All vehicles** with petrol/diesel and electric together keep litres and kWh apart ("45.0 L · 87.0 kWh") and show no combined average, since the two can't be added.
- Google Sheet: a new vehicle's tab stores its type in row 1 (`Type | Electric`), and an electric vehicle's columns read kWh, Price per kWh and Full charge. Vehicles and tabs from before this version have no type and count as **Petrol**, so nothing changes for them.
- The Vehicles list and the Users page show each vehicle's type.
### Fixed
- On the desktop dashboard the vehicle picker on Home and Log sat to the left of its label; it now lines up.
### Notes
- The type is chosen when a vehicle is added; there is no way to change it afterwards yet (remove and add the vehicle again).

## [2.7.0] - 2026-11-22
### Changed
- **The app is now a dashboard on computers.** On screens 900px and wider (when signed in) the app opens with a sidebar: Home, Log, Service, Reports, Vehicles and Users, a collapse button at the top (remembered), and the signed-in name and email at the bottom. Content uses the wider space (the Service, Log and Users pages up to 1160px). Phones keep the bottom tab bar, which gains a **Service** tab.
- **Service is its own page** (it was a section at the bottom of Home): stat cards (last service, next service, spent on service, products bought), Parts due, the service history table with totals, and the New/Edit service form inside the page with a confirmation of the total after saving.
- **Users** (Account on phones) also lists each vehicle with its fill-ups, services, last service and service spend.
- `portal.html` now redirects to the app's Service page, so old links keep working. `js/portal/portal.js` became `js/ui/views/service.js` and `css/portal.css` became `css/dashboard.css`.
### Removed
- `.claude/launch.json` (a local preview setting committed by mistake); `.claude/` is now ignored.

## [2.6.0] - 2026-11-22
### Added
- **Service log.** Record each workshop visit for a vehicle: the service date, odometer, what was done, the workshop's service charge, and the **products bought outside the workshop** for it (name, quantity, unit price; suggestions such as Engine oil, Oil filter, Air filter). The form adds each product's amount and the **total (service charge + products)** as you type, and the total is saved with the visit. An optional **reminder** stores when the next service is due, by date (three months ahead by default) and/or at an odometer reading.
- **Portal (`portal.html`)**: a desktop dashboard with a collapsible sidebar (Users, Service) and the signed-in user's name and email at the bottom. **Service** shows four stat cards (last service, next service, spent on service, products bought), a table of every visit with its products as chips, the service charge, products and total per visit, a totals row, edit and delete, and a "New service" form; after submitting it confirms the total. **Users** shows the signed-in profile, a Google Sheet link, Sync now, and each vehicle with its fill-ups, services, last service and service spend. The portal uses the session from the app in the same browser (sign in in the app first). The sidebar collapses to icons and remembers it; on narrow screens it is an icon rail and the table becomes cards.
- **Parts due (per-part replacement intervals).** Each product can have "Replace every N km or N months". When you type a product name, the interval is filled in from the last time you bought it for this vehicle, or a usual interval for common parts (engine oil and oil filter 3,000 km / 3 months, air filter 10,000 km / 12 months, spark plug 20,000 km / 24 months, battery 24 months, and more); you can change or clear it. A **Parts due** panel (portal Service page, and the top 3 on the phone's Home) lists every tracked part, most urgent first: when it was last changed, when it is next due by km and/or date, how far away that is, a bar showing how much of the interval is used, and OK / Due soon (85% used or 14 days left) / Overdue. Buying the part again restarts its count. The intervals are saved with the products in the Google Sheet (shown in the readable products column, e.g. "Engine oil x4 @ 1250 (every 3000 km / 3 mo)").
- Phone app: Home shows a **Service** card under the efficiency chart (last service and how long ago, next service with a countdown that turns red when overdue) and **Service history** (newest first, with products count and total, edit and delete). The phone app and the portal use the same form.
- Google Sheet: a new **Service log** tab (created the first time you save a service) holds every vehicle's visits, one row each: Plate, Date, Odometer, Work done, Service charge, Products bought (readable, e.g. "Engine oil x4 @ 1250; Oil filter x1 @ 850"), Products total, Total, Next service date, Next service at (km). Column A (ID) and column L (the products as data the app reads back) are hidden. Removing a vehicle also removes its service rows. Offline mode keeps services in the browser like fill-ups.
### Notes
- Service costs are not added to fuel spend, cost per km or the monthly reports; those still cover fuel only.
- "README" and "SERVICE LOG" can no longer be used as plate numbers (they are the app's own tab names).

## [2.5.0] - 2026-11-05
### Changed
- **The odometer is now optional** (it was required). Leave it empty on a fill-up and the entry still counts for litres, cost, subsidy and the reports. An entry without an odometer adds its litres to the next full-tank interval but gives no distance of its own; km/L, distance and cost per km use the entries that have an odometer. A value, when given, must still be a positive number and higher than earlier odometers, exactly as before.
- Nothing else changes: with every entry carrying an odometer, all figures and the list order are exactly as before. Entries are listed by odometer as before; only when some entry has no odometer are they listed by date.
- Empty odometers are handled everywhere: the form label says "(optional)", the Log table shows just the date, Excel/CSV leave the cell empty, the PDF shows a dash, and the Google Sheet keeps an empty cell and reads it back as "no odometer" (not 0).

## [2.4.0] - 2026-11-01
### Fixed
- **No more signing in on every visit.** The app used to keep your Google session only in memory and tried a silent background sign-in on each load; browsers block that popup (it is not triggered by a click), so you landed on the sign-in screen every time. Now your Google profile and access token are remembered in this browser (`localStorage`), so reopening the app goes straight to your data.
- **An expired token no longer signs you out.** Google gives browser-only apps a token that lasts about an hour and cannot be renewed without a click. When it runs out the app keeps working on your saved data and shows a **Reconnect** banner; one tap renews it and syncs. Saving or "Sync now" also renews it. A token that Google rejects mid-use (401) does the same instead of logging out.
- Only an explicit **Sign out** returns to the sign-in screen, and it clears the saved profile, token and cached data. Sessions saved by older versions fall back safely to the sign-in screen (shown immediately, no blank wait).
### Security note
- The 1-hour access token is stored in `localStorage` (cookies would be pointless: the app has no server). Scope is `drive.file` (only the Petrol Log sheet) and it expires within the hour; Sign out also revokes it. A script running on the page could read it, so only trusted scripts are loaded (Google sign-in, SheetJS, jsPDF).

## [2.3.1] - 2026-11-01
### Changed
- **PDF now matches the reference as ONE tall page** (595 x 967 pt, the 960 x 1560 ratio) instead of A4 pages; each vehicle's report is sized to fit all of its content (up to 1500 pt, then the table continues on further reference-size pages). Checked by rendering at the reference's pixel size and comparing side by side: layout, spacing, card heights (140 / 160), chart scale, insight cards and table rhythm line up.
- Details brought in line with the reference: the † mark appears only on unreliable small top-ups; table chips show one decimal (116.0); missing values use an em dash; arrows, the minus sign and the approx sign are drawn as shapes (the built-in PDF font has no glyphs for them); estimates are no longer prefixed "~" on every value, one footnote and the "estimated from odometer" caption say so instead.
- File name and document title: **Petrol Report — October 2026**.

## [2.3.0] - 2026-11-01
### Changed
- **PDF report redesigned from the supplied "Petrol Report" sample** (new `js/reports/pdf.js`). One designed report per vehicle: header with month and plate chip; a large **Net spend** card with a paid-versus-subsidy bar and cost per km; four stat cards (Fuel bought, Avg efficiency, Distance with odometer range, Subsidy saved); an **Efficiency per fill** bar chart with the average as a dashed line and dashed bars for tiny top-ups whose km/L is unreliable; a **Price per litre** trend line with % change; three **insight cards** written from the month's own data (price trend, subsidy share, top-ups, best fill, cost per km); and an **All fills** table with Trip km, thousands-separated totals and km/L chips (orange when above the average, † for small fills). Long months continue the table on further pages with the header repeated.
- Everything is vector (sharp, selectable text). Estimated km/L keeps its "~" marker. A fill counts as a small top-up at 2 L or less; it is flagged unreliable when its km/L is more than 50% away from the month average.
- The PDF file is named and titled **Petrol Report — October 2026** (file name and document title).
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
