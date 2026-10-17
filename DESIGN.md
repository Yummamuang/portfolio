---
name: YM. Portfolio
description: An appliance faceplate whose program dial is the navigation, in grey plastic, near-black ink and one signal orange.
colors:
  housing: "#d6d6d1"
  plate: "#eeeeea"
  display: "#fafaf8"
  ink: "#1c1c1c"
  ink-muted: "#5c5c57"
  ink-faint: "#64645e"
  rule: "#c8c8c2"
  rule-strong: "#c4c4be"
  stop-idle: "#7d7d77"
  signal: "#f2600c"
  signal-text: "#b23d06"
  knob: "#2a2a28"
  knob-ring: "#333331"
  knob-edge: "#444441"
  tuner-idle: "#a3a39d"
  strip: "#1c1c1c"
  strip-text: "#e6e6e1"
typography:
  display:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 9cqi, 2.875rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-article:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.1em"
  status:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.08em"
  code:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "0.875rem"
    lineHeight: 1.55
rounded:
  plate: "28px"
  display: "18px"
  stop: "12px"
  pill: "999px"
spacing:
  housing-pad: "clamp(8px, 1.6vw, 24px)"
  gutter: "clamp(16px, 3vw, 40px)"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#f47a2f"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.plate}"
  playback-pill:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  stop:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.stop}"
    padding: "12px 14px"
    height: "56px"
  stop-selected:
    backgroundColor: "{colors.display}"
    textColor: "{colors.ink}"
  dial-label:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    padding: "0 8px"
    height: "44px"
  dial-label-current:
    textColor: "{colors.signal-text}"
  display-panel:
    backgroundColor: "{colors.display}"
    rounded: "{rounded.display}"
    padding: "clamp(24px, 3vw, 44px) clamp(20px, 3vw, 48px)"
  status-strip:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.strip-text}"
    typography: "{typography.status}"
    padding: "16px clamp(16px, 3vw, 40px)"
---

# Design System: YM. Portfolio

## Overview

**Creative North Star: "The Program Dial"**

The site is a household appliance seen face-on. A light grey plastic housing frames one rounded faceplate; on the faceplate a dark knob with an orange pointer turns between six programs, and turning it is how you move through the page. Every surface reads as a panel, display window or control on that machine: flat, tonal, edged by 1px rules, with one signal orange that behaves like an indicator lamp rather than a brand colour.

Density is moderate and calm. The type is a single grotesk, Archivo, used tight and heavy for display and tracked in caps for machine labels. Motion is mechanical: the knob detents with a small overshoot, the lamp blinks once, the cursor becomes a ring that snaps around controls like a bezel. Nothing floats, glows or casts a drop shadow.

Write-ups live on the same faceplate in a narrow reading column, so a long read still sits inside the machine and ends on the same black status strip.

**Key Characteristics:**
- Housing, plate and display window as three tonal layers, separated by 1px rules, never by shadow.
- One orange (signal) used only as fill: pointer, lamp, active tick, primary button, text selection.
- One typeface, Archivo Variable, from tight 800-weight display to 0.1em tracked caps labels.
- Dashed outline means "available stop", solid means "selected stop", everywhere stops appear.
- A sticky black status strip names the current program and the next one.

## Colors

A neutral warm-grey appliance palette with a single orange indicator and a darker orange reserved for text.

### Primary
- **Signal Orange** (signal): the indicator. Fills the dial pointer, the lamp, the active tick, primary buttons and the text-selection background. Always carries ink text on top, never sits as text on the plate.
- **Burnt Signal** (signal-text): the readable orange. Current dial label, links on hover, inline links in the role statement, stage numbers, the focus outline and the caret.

### Neutral
- **Plastic Housing** (housing): page background and the frame around the faceplate; also the scrollbar track.
- **Faceplate** (plate): the main surface every page sits on; text colour on ink fills.
- **Display Window** (display): the lighter inset for panels, the featured project card, blockquotes and the pressed stop.
- **Ink** (ink): body text, display type, secondary button border, selected stop border, portrait rule.
- **Muted Ink** (ink-muted): roles, credits, rule lists, the counter, idle dial labels, write-up dek.
- **Faint Ink** (ink-faint): idle dial ticks and the dial hint.
- **Rule / Strong Rule** (rule, rule-strong): 1px dividers; strong rule edges the plate and draws the dial ring.
- **Stop Idle** (stop-idle): the 2px dashed outline of unselected stops; scrollbar thumb.
- **Knob, Knob Ring, Knob Edge** (knob, knob-ring, knob-edge): the dial knob body and its two inset rings. Knob also fills the phone tuner band, the dial's display window on small screens. Used nowhere else.
- **Tuner Idle** (tuner-idle): idle program names on the phone tuner band.
- **Status Strip / Strip Text** (strip, strip-text): the black strip and code blocks, with their light text.

### Named Rules
**The Lamp Rule.** Signal orange is a fill, never text. Any orange type uses signal-text. Signal covers small indicators and the primary action only; one primary button per panel.

**The Ink-On-Orange Rule.** Text on a signal fill is ink, weight 800, never white.

## Typography

**Display Font:** Archivo Variable (with Archivo, system-ui, sans-serif)
**Body Font:** Archivo Variable (same family)
**Label/Mono Font:** ui-monospace, SF Mono, Menlo for code in write-ups only

**Character:** One grotesk doing every job, the way an appliance faceplate uses one typeface for its brand mark and its program labels. Display is heavy and tightly tracked; labels are small, tracked caps.

### Hierarchy
- **Display** (800, clamp 2.5rem to 4.5rem, 0.95, -0.035em): panel titles on Home and the write-up h1.
- **Headline** (800, clamp 1.5rem to 2.875rem by container width, 1, -0.03em, balanced): the featured project title.
- **Title** (800, 1.625rem, 1.2, -0.02em): write-up section headings.
- **Lede** (400, 1.1875rem, 1.45, max 56ch): the plain paragraph under a panel title. The write-up dek (1.3125rem, muted) and the role statement above the featured project (1.25rem, 600, max 60ch) are its siblings.
- **Body** (400, 1rem, 1.5): Home copy. Project summary runs 1.0625rem at max 48ch.
- **Article body** (400, 1.125rem, 1.65; 1.25rem from 1200px; 1.0625rem at 640px and below): write-ups, held to the registered measure below.
- **Label** (600, 0.9375rem, 0.1em, uppercase): dial program labels; 800 and signal-text when current. Stack group terms use 0.8125rem 800 caps; the dial hint 0.875rem 0.14em caps in faint ink.
- **Status** (400, 0.8125rem, 0.08em, uppercase): the status strip.

### Named Rules
**The Plain Lede Rule.** A heading is followed directly by a plain sentence: panel title then lede, write-up h1 then dek. No kicker, eyebrow or category label sits above a heading; the build has none and its tests assert none.

**The Write-up Measure Rule.** Write-ups set `--measure` as a registered custom property (`@property`, `<length>`, inherited) at 48ch, and every direct child of the article takes it as max-width. Code blocks may grow to fit their content up to the column, and blockquotes get the measure plus 96px. At 1200px and wider the measure stays 48ch while the body rises to 20px.

## Layout

The housing pads the viewport by a fluid frame (housing-pad) and holds one plate that fills at least the viewport height. The plate has a header band (maker mark, name, role; lamp, email, GitHub) over a 1px rule, a body, and the status strip pinned to its bottom edge.

Home body is two columns: the dial (380px to 560px, sticky at 16px) flush left, and the display column on the right with gutter padding. Programs stack in the display column as display-window panels 24px apart. At 900px and below the plate becomes one column, the dial becomes the tuner, a sticky dark band across the top, and the strip stops being sticky. The featured project stacks media over text below 1280px; the project list and portrait stack at 640px; stage rows and the stack grid go 4 to 2 to 1 columns at 900px and 480px.

Write-ups centre a column inside the plate (max 1040px wide, fluid top padding, 96px bottom), with every child held to the measure. On phones, code blocks bleed to the plate edges and lose their radius.

Spacing runs on 8, 12, 16, 24 and 32px steps with occasional 10, 14, 22 and 28px fits inside cards. Every interactive target is at least 44px tall.

## Elevation & Depth

Flat. Depth comes from three tonal layers, housing to plate to display window, each edged by a 1px rule. The only shadow in the system is the knob's pair of inset rings, which draw the knob's turned bezel rather than lift anything.

### Shadow Vocabulary
- **Knob bezel** (`box-shadow: inset 0 0 0 12px var(--knob-ring), inset 0 0 0 13px var(--knob-edge)`): the dial knob only.

### Named Rules
**The Faceplate Rule.** Surfaces never cast shadows. A new surface is a lighter inset (display) with a 1px rule, not a raised card.

## Shapes

Corners step down as surfaces nest: plate 28px, display windows 18px, stops, media, photos and code blocks 12px, all buttons and badges fully pill. The lamp and knob are circles; the pointer is an 8px bar with 4px ends. Lines are 1px rules for structure, 2px for stops and the portrait baseline, 3px for the focus outline. The portrait cut-out stands on a 2px ink rule with no frame. The status strip is square.

### Named Rules
**The Stop Grammar Rule.** An unselected stop is a 2px dashed outline in stop-idle; the selected stop is a 2px solid ink outline (and display fill for project stops). Dial ticks follow the same grammar: 2px dashed faint ink idle, 4px solid signal active. Hover on a stop darkens its border to ink without making it solid.

## Components

### Buttons
Pills that read like appliance push-buttons.
- **Shape:** fully round (pill), 48px tall, 24px horizontal padding, 0.9375rem.
- **Primary:** signal fill, ink text at 800, no border. Hover lightens the fill. One per panel.
- **Secondary:** transparent, 1px ink border, ink text at 600. Hover inverts to ink fill with plate text.
- **Playback pill:** 44px pill on the media corner, plate fill, 1px ink border; hover inverts. Its label follows the video state.
- **Focus:** a 3px signal-text outline, 3px offset, on every control; on the strip it switches to strip-text, inset.

### Chips
- **Desktop-only badge:** small pill, 1px ink border, 0.8125rem 600, shown under the summary for projects that need a desktop.
- **Portrait tag:** a square ink label with plate caps, sitting on the portrait baseline as the link name for About.

### Cards / Containers
- **Display panel:** display fill, 1px rule border, 18px corners, fluid padding, 22px internal gap. Holds a display title, a plain lede, optional stage row, actions.
- **Featured project:** a display panel with media (16:10, 12px corners) beside title, summary, badge slot, actions and a tabular "1 / 6" counter. Title and summary hold minimum heights so switching projects does not move the actions.
- **Stage row:** numbered steps separated by a 1px top rule, numbers in signal-text 800.

### Project stops
Six buttons in two columns under the featured project, each a stop: 56px minimum, 12px corners, title only at 0.9375rem 600 (no tag line). Selected uses `aria-pressed` and the solid grammar.

### Navigation
The dial is the navigation (below). The header carries the maker mark (YM., 1.75rem 800), name, role, the lamp, email and GitHub, all 44px targets. Write-ups reuse the header, with the mark linking home.

### Program Dial (signature)
A 560px square face with a thin ring, six program labels placed by angle (first stop at -120°, 48° apart), a tick per stop, and a dark knob carrying an orange pointer. Drag, arrow keys, Home/End or page scroll move the pointer; it detents onto the program with an overshoot curve (`cubic-bezier(0.3, 1.4, 0.5, 1)`, 280ms), the current label turns signal-text, the tick goes solid orange, and the lamp blinks once (400ms, two steps). Dragging tracks the pointer angle without easing and holds at the arc ends. Below 900px the face becomes the tuner (next section).

### Phone tuner (dial variant)
At 900px and below the dial is a 60px sticky band in knob, full bleed, one row of the six program names on a scale. Each name is 86px wide over a tick row: two 1px minor ticks each side and one 2x14px major tick, idle major ticks grey, the current one signal. A fixed pointer, a 12x6px signal notch at the top centre and a 2x20px signal needle at the bottom centre, never crosses the text. The row snap-scrolls with 12px edge fades so about four names show and the edge names are cut off, which says the row scrolls. Swiping only aims: the centred program is chosen once the finger lifts and the row settles, then the page scrolls there. Tap, Enter, arrow keys and Home/End choose directly, Tab alone never does. Page scroll re-centres the row. Idle names are tuner-idle 600, the current name strip-text 800. This band is the one deliberate exception to the Stop Grammar Rule: it is a display window, so selection reads by the pointer, weight and tick, not by outlines.

### Detent ring cursor
On fine pointers the system cursor is joined by a 24px ring with a 1.5px ink border. Over any link or button it snaps around the control with a 4px outset, taking the control's corner radius plus 4px (120ms, `cubic-bezier(0.25, 1, 0.5, 1)`). Inside the dial face it hops to a pill around the program label nearest the pointer's angle, showing where a drag would land. Over the status strip the ring turns strip-text. It shrinks to 0.9 while pressed, hides on Tab and when the pointer leaves the window, and never renders on touch or coarse pointers.

### Status strip
A sticky black band at the bottom of the plate: current program and position on the left ("Work · 1 of 6"), a "Next: Loops" link with a drawn arrow icon on the right that becomes "Back to top" at the last program. Write-ups use the same strip with the write-up name and "Back to the dial".

## Do's and Don'ts

### Do:
- **Do** put every new surface on the plate as a display window with a 1px rule and 18px corners.
- **Do** use signal only as a fill and signal-text for any orange type.
- **Do** follow a heading with a plain lede sentence.
- **Do** draw selectable stops dashed when idle and solid when selected.
- **Do** make every control at least 44px tall and pill-shaped if it is a button.
- **Do** hold write-up text to the registered `--measure` of 48ch.
- **Do** draw icons as inline SVG strokes in currentColor.
- **Do** honour reduced motion: the detent, blink and ring transitions collapse to 1ms.

### Don't:
- **Don't** put a kicker, eyebrow or category label above a heading.
- **Don't** set orange text in signal (#f2600c); it fails contrast on the plate.
- **Don't** add drop shadows; the knob bezel is the only shadow.
- **Don't** add a second accent colour or a second typeface.
- **Don't** add a tag or meta line under project stop titles.
- **Don't** show the detent ring on touch devices.
