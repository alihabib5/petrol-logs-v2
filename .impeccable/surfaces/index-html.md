---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Safri app shell (index.html, all tabs)

Scope: the whole app UI (Home, Log, Service, Reports, Vehicles, Users/Account, sign-in, forms). Mode: Operate.
Audience and job: individual owners logging fill-ups/charges one-handed at the pump; reviewing spend, service and reports on phone or laptop.
Constraints: plain HTML/CSS/JS, no build; light and dark themes via Prefs; all existing features and copy kept.
Owner's direction: "simple and easier to navigate", "plain and familiar, but not a finance app"; took the category standard (canon) over Metro Lines and truck art. Later asked for their favourite colour, a deep bottle green, to be applied (reference image provided).

## Direction contract

THESIS: A vehicle log anyone already knows how to use: white cards, clear lists, one bottle green (the owner's favourite). Refuses both the fintech dashboard (blue, charts first, KPI tiles everywhere) and decorative "local" theming.

OWN-WORLD: Cool near-white ground (#F4F5F4), white surfaces with 1px #E1E4E2 hairlines, ink #17191B, secondary #5A615C. One brand colour, the owner's bottle green #173E2F (sampled from their reference image, deepening to #002317): it paints the desktop sidebar (white text, white active item) and the sign-in ground (green with its darker corner), and colours buttons, the gauge, chart bars and the active phone tab. A brighter green #1B7A4B only for OK states. State colours only where they mean something: red overdue, amber due soon. System UI font, tabular figures, 12px card radius, 10px controls.

STORY: The owner sees the selected vehicle's efficiency and spend first, adds a fill-up in one tap, and finds Service, Reports and Vehicles exactly where a familiar app puts them.

FIRST VIEWPORT: Desktop: 264px bottle-green sidebar (brand, six labelled icon tabs, active one a white pill, user and sign-out at the bottom), page title with vehicle picker and the primary action at top right, then the efficiency card and four stat cards. Phone: title with the primary action on the same row ("+ Fill-up" on Home, "+ New service" on Service), picker below, then gauge card and stats; bottom tab bar; on Log the primary action is a green floating button instead.

FORM: Category standard (canon), executed at full craft; position: canon card; seed:7ab2ed59e32dfa18

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
