---
name: Safri
description: A plain, familiar vehicle log in the owner's bottle green.
colors:
  bottle-green: "#173e2f"
  bottle-green-deep: "#002317"
  bottle-green-hover: "#0d2b20"
  bottle-green-soft: "#e1ebe6"
  bottle-green-dark-fill: "#2e7a5c"
  bottle-green-dark-hover: "#3a8c6b"
  bottle-green-dark-text: "#8fd4b0"
  sidebar-dark: "#10291f"
  sidebar-dark-deep: "#001a10"
  on-brand: "#ffffff"
  ok-green: "#1b7a4b"
  ok-soft: "#e3f1e9"
  due-amber: "#995500"
  due-amber-soft: "#fdf1dc"
  overdue-red: "#c22a2a"
  overdue-red-soft: "#fbe9e9"
  ground: "#f4f5f4"
  surface: "#ffffff"
  ink: "#17191b"
  mute: "#5a615c"
  hairline: "#e1e4e2"
  hairline-strong: "#cdd2cf"
  dark-ground: "#0f1412"
  dark-surface: "#18201c"
  dark-ink: "#eef1ef"
  dark-mute: "#a2aaa5"
  dark-hairline: "#28302c"
  dark-hairline-strong: "#3a443f"
typography:
  wordmark:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    letterSpacing: "-0.01em"
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 650
    lineHeight: 1.3
  stat:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\""
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  column-head:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.06em"
rounded:
  bar: "4px"
  inner: "8px"
  control: "10px"
  card: "12px"
  sheet: "16px"
  pill: "99px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "28px"
  gutter-desktop: "40px"
components:
  button-primary:
    backgroundColor: "{colors.bottle-green}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.bottle-green-hover}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.ground}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "16px"
  pill-neutral:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  status-ok:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok-green}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  status-due-soon:
    backgroundColor: "{colors.due-amber-soft}"
    textColor: "{colors.due-amber}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  status-overdue:
    backgroundColor: "{colors.overdue-red-soft}"
    textColor: "{colors.overdue-red}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  sidebar:
    backgroundColor: "{colors.bottle-green}"
    textColor: "{colors.on-brand}"
    width: "264px"
  sidebar-item-active:
    backgroundColor: "{colors.on-brand}"
    textColor: "{colors.bottle-green}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    height: "44px"
  tab-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.mute}"
  tab-active:
    backgroundColor: "{colors.bottle-green-soft}"
    textColor: "{colors.bottle-green}"
    rounded: "{rounded.pill}"
---

# Design System: Safri

## Overview

**Creative North Star: "The Glovebox Logbook"**

Safri looks like the vehicle log anyone already knows how to use: a cool near-white ground, white cards with hairline borders, clear lists, and one colour, the owner's own bottle green. It is the category standard executed carefully, not a new idiom. The owner asked for "simple and easier to navigate" and "plain and familiar, but not a finance app", and chose this over expressive directions; Pakistani character lives in the content and wording, not in ornament.

The green is structural, not decorative. On desktop it is the whole sidebar; on sign-in it is the whole ground; everywhere else it marks the one action, the gauge arc, the chart bars and the selected tab. Status colours (a brighter green, amber, red) appear only where something is OK, due soon or overdue. Everything else is neutral, including data figures, so the numbers read as numbers rather than alarms.

Density is comfortable and touch-first: 44px minimum targets, 16px body, tabular figures for every amount. Motion is one short settle per view change plus value transitions on the gauge and bars. Light is the default because the app is used outdoors at the pump; dark follows the system or the user's preference.

**Key Characteristics:**
- One brand colour, bottle green, used as fills on large structural surfaces and the primary action.
- White cards on a cool near-white ground, 1px hairlines, almost no shadow.
- System UI type with tabular figures; weight, not typeface, carries hierarchy.
- Status colour only for status; data pills and badges stay neutral.
- Category-standard navigation: bottom tab bar on phones, a labelled green sidebar from 900px.

## Colors

One deep, slightly blue-leaning bottle green against cool neutrals, with three status hues held in reserve.

### Primary
- **Bottle Green** (bottle-green): the owner's favourite, sampled from their reference image. Fills the primary button, the gauge arc, chart bars, checked toggles and checkboxes, the selected calendar day and the logo tile; also the light-mode green for text and icons (links, active tab label, feature ticks).
- **Bottle Green Deep** (bottle-green-deep): the darker corner of the sign-in radial gradient, never a flat fill on its own.
- **Bottle Green Hover** (bottle-green-hover): primary button hover.
- **Bottle Green Mist** (bottle-green-soft): selection highlight, focus halo, active phone-tab pill, selected log rows, icon tiles.
- **Lifted Bottle Green** (bottle-green-dark-fill, hover bottle-green-dark-hover): the dark-mode fill, raised so it holds on the dark ground with white labels.
- **Pale Bottle Green** (bottle-green-dark-text): dark-mode green for text and icons, kept separate from the fill.
- **Night Sidebar** (sidebar-dark, sidebar-dark-deep): the dark-mode sidebar and sign-in ground.

### Secondary
- **Status Green** (ok-green on ok-soft): only for "OK" (part within interval, saved confirmation). Brighter than the brand so the two never read as the same thing.
- **Due Amber** (due-amber on due-amber-soft): due soon; also the reconnect banner ground.
- **Overdue Red** (overdue-red on overdue-red-soft): overdue, errors, destructive actions.

### Neutral
- **Cool Paper** (ground): page background, hover wash on rows and ghost buttons, neutral pill fill.
- **White Card** (surface): cards, inputs, sheets, the phone tab bar.
- **Ink** (ink): primary text.
- **Graphite Mute** (mute): secondary text, units, captions, inactive tabs, column heads.
- **Hairline** (hairline): card borders, row dividers, gauge track.
- **Hairline Strong** (hairline-strong): input and ghost-button strokes, toggle off-state, scrollbar thumb.
- Dark mode swaps these for dark-ground, dark-surface, dark-ink, dark-mute, dark-hairline and dark-hairline-strong.

### Named Rules
**The Two Greens Rule.** Fills use the fill token (acc); green text and icons use the text token (acc-fg). In light mode they are the same bottle green; in dark mode the fill lifts to Lifted Bottle Green with white ink and the text becomes Pale Bottle Green. Never use the fill colour for text in dark mode.

**The Status Means Status Rule.** Status Green, Due Amber and Overdue Red appear only when something is OK, due soon, overdue or an error. Data pills, chips and the Full tank / Partial badges are neutral.

**The Structural Green Rule.** Bottle green goes on whole structural surfaces (sidebar, sign-in ground) and on the one primary action per view; it is not sprinkled on headings, card borders or decorative accents.

## Typography

**Display Font:** system-ui (with -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif)
**Body Font:** the same system stack
**Label/Mono Font:** none; tabular figures from the system face

**Character:** The platform's own UI face, so the app feels native on every phone; hierarchy comes from weight (400 / 600 / 650 / 700) and size only.

### Hierarchy
- **Display** (700, 60px, line-height 1, -0.03em, tabular): the efficiency figure inside the gauge. One per view.
- **Headline** (700, 28px, 1.2, -0.015em, balanced wrap): page titles in the page header; 26px on the sign-in card.
- **Title** (650, 17px, 1.3): section headings between cards.
- **Stat** (700, 24px, -0.01em, tabular): stat-card values; 19px on phones, clamp 20 to 26px in the Home grid.
- **Body** (400, 16px, 1.45): all running text and controls.
- **Label** (600, 14px): form labels, stat captions (in mute), row subtitles at 400.
- **Column head** (600, 12px, 0.06em, uppercase, mute): table column headers only, on wide layouts.

### Named Rules
**The Tabular Figures Rule.** Every amount, distance, efficiency and date that sits in a column or stat uses tabular figures, so numbers line up and do not jitter when they change.

**The One Face Rule.** No webfonts and no display face; the system stack is the brand's type.

## Layout

Phones: a single centred column, max 640px, 16px side padding, 120px bottom padding to clear the fixed bottom tab bar. The page header puts the title and the primary action on one row with the vehicle picker beneath at full width. Stat cards sit two-up with 10 to 12px gaps.

From 900px (signed in) the app becomes a sidebar dashboard: a fixed 264px bottle-green sidebar (76px collapsed, 0.25s width transition), content offset by the sidebar width with 28px top and 40px side padding. Content blocks are capped at 900px on Home and 1160px on Log, Service and the table views. Home's stat grid goes four-up; the Service stat row is four-up above 1080px and two-up below.

Tables use container queries, not viewport breakpoints: columns collapse into labelled stacked rows when the table itself is under 880px wide. The log list becomes columns from 680px; the service products list from 560px.

Rhythm: 6 / 10 / 12 / 16px inside components, 28px above section titles, 16px under the page header.

## Elevation & Depth

Flat by default. Cards are separated from the ground by tone and a 1px hairline, not by shadow. Shadow appears only on things that float above the page: the floating add button, bottom sheets, the calendar, the log filter popover, the selected segment of a segmented control, and the sign-in card over its green ground.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 1px 2px rgba(23,25,27,.06), 0 4px 12px rgba(23,25,27,.06)`): the selected segment in a segmented control.
- **Float** (`box-shadow: 0 12px 32px rgba(23,25,27,.16)`): floating action button, calendar, filter popover.
- **Sign-in** (`box-shadow: 0 20px 50px rgba(0,20,12,.35)`): the sign-in card only, tinted to the green ground.
- Dark mode deepens Lift and Float to black at 0.3 to 0.5 alpha.

### Named Rules
**The Hairline Not Shadow Rule.** Resting cards never carry a shadow; if it does not float over other content, it gets a 1px hairline and nothing else.

## Shapes

Soft, consistent corners: 12px cards, 10px controls (buttons, inputs, selects, sidebar items), 16px sheets, the calendar and the sign-in card, 8px for inner segments, 4px top corners on chart bars. Full pills (99px) for pills, chips, status tags, toggles, the active tab-icon pill and calendar month and footer buttons; calendar days and avatars are circles. Borders are always 1px, solid; dashed is reserved for "add another" and the Partial badge.

## Components

### Buttons
Quiet, solid and roomy.
- **Shape:** gently rounded (10px), minimum 44px tall, 10px 18px padding, weight 600.
- **Primary:** bottle-green fill with white label; one per view, usually top right of the page header.
- **Hover / Focus:** hover darkens to Bottle Green Hover; press scales to 0.98; focus-visible is a 2px green outline at 2px offset (white inside the sidebar).
- **Ghost:** white with a strong hairline stroke, ground wash on hover. Danger ghost uses the red for text and stroke.
- **Floating add (phone Log only):** 56px tall, 16px radius, primary fill, Float shadow, above the tab bar.

### Chips
- **Style:** pill, ground fill, 1px hairline, ink text at 13px. Neutral always.
- **Status tags (Parts due):** 12px uppercase 700 pill on the soft status tint with the status colour as text: OK, due soon, overdue.
- **Badges:** Full tank is a neutral filled pill; Partial is transparent with a dashed strong hairline and muted text.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** white card on Cool Paper.
- **Shadow Strategy:** none at rest (see Elevation).
- **Border:** 1px hairline.
- **Internal Padding:** 16px; 22px for in-page forms; table cards run edge to edge with 12 to 18px row padding.

### Inputs / Fields
- **Style:** white field, 1px strong hairline, 10px radius, 11px 12px padding, 44px minimum; selects are semibold with a muted chevron.
- **Focus:** border turns bottle green with a 3px Bottle Green Mist halo, no outline.
- **Error / Disabled:** errors are red 14px text under the field; disabled buttons drop to 0.7 opacity.
- **Toggle:** 52 by 30px pill, strong hairline when off, bottle green when on, white knob.

### Navigation
- **Phone:** fixed bottom tab bar on white with a top hairline; icon above an 11.5px semibold label in mute. The active tab turns green and its icon sits in a Bottle Green Mist pill.
- **Desktop (900px+):** bottle-green sidebar with the logo tile, name and collapse control, six labelled icon tabs (22px icons, 44px rows, 10px radius) in translucent white; hover is a 14% white wash; the current page is a solid white pill with green text. The signed-in user and sign-out sit at the bottom above a translucent white rule.

### Efficiency Gauge
A 180-degree arc, 16px stroke with round caps: hairline track, bottle-green value arc that eases to the new value over 0.9s. The display figure sits inside the arc with its unit in mute beneath.

### Monthly Bars
Bottle-green bars with 4px top corners, value above in 12px mute, month below; they grow from the baseline over 0.7s with a slight per-bar delay.

## Do's and Don'ts

### Do:
- **Do** keep bottle green (#173E2F) to the sidebar, the sign-in ground, the primary action, the gauge, chart bars, toggles and the active tab.
- **Do** use the text token for green text and icons and the fill token for green fills, so dark mode stays legible.
- **Do** separate resting cards with a 1px hairline on Cool Paper, with no shadow.
- **Do** keep every touch target at least 44px tall.
- **Do** set every figure in tabular numerals.
- **Do** limit motion to one short settle per view change (0.3s) and value transitions on the gauge and bars, and honour reduced motion.

### Don't:
- **Don't** use red, amber or the status green for anything that is not a status; data pills and Full tank / Partial badges stay neutral.
- **Don't** drift toward a fintech dashboard: no blue, no KPI-tile walls, no chart-first screens (owner: "not a finance app").
- **Don't** add decorative "local" theming such as truck-art ornament or patterned grounds; the owner declined it.
- **Don't** introduce webfonts or a display face.
- **Don't** put shadows on resting cards or stagger view entrances in a cascade.

## Logo and landing page (2.14.0)
The safri app icon (`img/safri-icon-*.png`: a road-green S on the logo's deep teal-green tile, with a paper plane, fuel nozzle and service gear) replaces the drawn mark. The wordmark is lowercase "safri" in Lexend 600. The landing page (`index.html`, `css/landing.css`) takes its field from the icon tile (#123a35 to #0b2723) and its button and accent from the icon's road green (#1fa87a with dark #062a1f text); Lexend carries its headings, the system stack its body.
