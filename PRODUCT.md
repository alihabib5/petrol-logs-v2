# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Individual vehicle owners in Pakistan tracking their own car, motorbike or electric vehicle. They log a fill-up or charge on a phone, often standing at the pump or charger, and review costs, services and reports later on a phone or laptop.

## Product Purpose
Safri (formerly Sawari, and Petrol Log before that) shows owners what their vehicle really costs to run: fuel or charging, efficiency (km per litre or per kWh), cost per km, government subsidy, and workshop services with the parts bought for them. Success: logging takes seconds, and the owner always knows their efficiency, their spend and what service is due next.

## Positioning
Data lives in the owner's own Google Drive (a "Safri" Google Sheet), not on a company server. One app covers petrol, diesel and electric vehicles, fuel, charging and servicing. Planned: public transport and ride-hailing trips, which is why the name means "a ride / any vehicle".

## Operating Context
- Phone, one hand, at a petrol pump or charger: add a fill-up or charge quickly.
- Laptop or desktop: the sidebar dashboard for reviewing logs, service history, parts due and monthly reports.
- Monthly: download a report (designed PDF, Excel, CSV).
- Offline mode keeps data in the browser only, for people who don't sign in.

## Capabilities and Constraints
- Vehicles keyed by plate number; type Petrol, Diesel or Electric.
- Fill-ups / charges: date, optional odometer, price per unit, amount (litres or kWh), total, subsidy, full tank / full charge. Full-tank method for efficiency, with a labelled odometer estimate.
- Service log: date, odometer, work done, service charge, products bought outside the workshop, total, next-service reminder; per-part replacement intervals with a Parts due panel.
- Reports per month and vehicle; PDF, Excel, CSV.
- Tabs: Home, Log, Service, Reports, Vehicles, Users/Account. Bottom tabs on phones, a sidebar on screens 900px and wider.
- Stack: plain HTML, CSS and JavaScript, no build step, hosted on Vercel; Google sign-in with the `drive.file` scope only.
- Currency is a display label; amounts are in rupees ("Rs") throughout.

## Brand Commitments
- The name **Safri** is fixed.
- No visual element is fixed: colours, type and layout may all be replaced.
- Feel: dynamic, with recognisably Pakistani character (owner's words: "a dynamic app that feels Pakistani").
- **Standing preference (22 Nov 2026, redesign round):** the UI should be "simple and easier to navigate", "plain and familiar, but not a finance app". Owner declined the expressive directions (Metro Lines, truck art) and named no reference app. Familiar vehicle-log conventions win over local ornament; Pakistani character lives in content and wording, not decoration.

## Evidence on Hand
No testimonials, user counts, press or reviews exist; do not invent any. Real product copy is in the app and in `privacy.html` / `terms.html`.

## Product Principles
1. Logging at the pump must take seconds, one-handed.
2. Numbers are the product: efficiency, cost per km and totals must be exact, clearly labelled, and honest about estimates.
3. The owner's data stays theirs, in their own Drive.
4. One app for every way of getting around: petrol, diesel and electric today, transport and rides later.
5. Local, not generic: feels made for Pakistani roads and owners.

## Accessibility & Inclusion
Used outdoors in bright sun at pumps, often one-handed: strong contrast, large touch targets. English interface today.
