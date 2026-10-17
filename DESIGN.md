---
name: YM. Portfolio
description: Black-and-white personal portfolio where oversized type rises onto a bare white stage.
colors:
  paper-white: "#ffffff"
  ink-black: "#000000"
  stage-black: "#151515"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(3.5rem, calc(1rem + 8vw), 120px)"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(2.5rem, 10vw, 100px)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(1.25rem, calc(0.8rem + 1vw), 2rem)"
    fontWeight: 500
  body:
    fontFamily: "Prompt, sans-serif"
    fontSize: "clamp(1.25rem, 1.6vw, 1.8rem)"
    fontWeight: 400
  label:
    fontFamily: "productsans, sans-serif"
    fontSize: "larger"
    fontWeight: 400
  logo:
    fontFamily: "Poppins, sans-serif"
    fontSize: "2.25em"
    fontWeight: 700
rounded:
  none: "0"
  pill: "999rem"
spacing:
  gutter: "6%"
  gap: "2em"
  stack: "2rem"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.none}"
    padding: "1em"
  button-outline-hover:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "1em"
  media-frame:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    height: "50vh"
    width: "100%"
  media-frame-dark:
    backgroundColor: "{colors.ink-black}"
    rounded: "{rounded.none}"
    height: "50vh"
    width: "100%"
  nav-link:
    textColor: "{colors.ink-black}"
    typography: "{typography.label}"
  preloader:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.paper-white}"
    height: "100vh"
    width: "100%"
---

# Design System: YM. Portfolio

## Overview

**Creative North Star: "The Monochrome Stage"**

The site is a bare white stage lit in black. Every page opens the same way: a black curtain carrying the "YM." monogram lifts away, and then oversized Poppins headlines rise into view from behind a mask, one line after another, like actors stepping up through a trap door. Nothing on the stage is coloured. The work itself, shown as looping videos and screenshots inside thin black frames, supplies the only colour on the page.

The mood is clean, editorial, and confident. Type is huge and set tight, sections are announced with a single centred word, and there is a lot of empty white around everything. Personality comes from motion rather than ornament: a hollow ring cursor that inverts whatever it passes over, frames that zoom their media on hover, and outlined controls that flood solid black when touched.

This record captures the system as it stands before the planned Vite migration and redesign. Treat it as the incumbent reference, not a mandate for the next world.

**Key Characteristics:**
- Pure black and white. Colour only enters through project media.
- Oversized bold type that animates up from an overflow mask.
- Square corners and 1px black outlines. No shadows anywhere.
- Hover means inversion: outline becomes fill, white becomes black.
- `mix-blend-mode: difference` on the logo, hamburger, and cursor so they read over any background.

## Colors

A strict two-ink palette, with one near-black reserved for a single animated panel.

### Primary
- **Ink Black** (`{colors.ink-black}`): all text, every outline, hover fills, the preloader curtain, and the dark media frame behind video thumbnails.

### Neutral
- **Paper White** (`{colors.paper-white}`): the page background, text on black, the cursor ring, and the logo before blending.
- **Stage Black** (`{colors.stage-black}`): the sliding panel behind screenshot cards (the `webdesign` sweep animation). Slightly softer than ink so the sweep reads as a layer rather than a hole.

### Named Rules
**The Two Inks Rule.** Interface chrome uses only Ink Black and Paper White. A third colour in UI is a defect. Colour belongs to the work being shown.

**The Difference Rule.** Elements that float above content, the logo, hamburger lines, and cursor, use `mix-blend-mode: difference` so they invert against whatever is beneath instead of carrying their own background.

## Typography

**Display Font:** Poppins (with sans-serif), loaded from Google Fonts at 300 to 700
**Body Font:** Prompt (with sans-serif), used for longer Thai-capable reading text on About
**Label Font:** Product Sans Regular, self-hosted from `font/Product-Sans-Regular.ttf`, used for desktop nav links

**Character:** Geometric and round. Poppins at 700 carries the voice at poster scale, Prompt keeps the same geometry for paragraphs and supports Thai, Product Sans gives the nav a softer, lighter tone.

### Hierarchy
- **Display** (700, `calc(1rem + 8vw)` capped at 120px from 1280px, line-height 120%): the hero name on Home. On phones the hero switches to `calc(5px + 12vw)` with "Hi there! I'm" stacked above the name.
- **Hero lead and tail** (lead 500 at `7vw` capped at 85px, tail 400 at `4vw` capped at 50px, desktop sizes): "Hi there!" above and "this is my portfolio" below the display line.
- **Headline** (700, `10vw` on mobile, fixed 100px from 1024px, centred): the one-word page titles "Project", "My Lab", "About Me?".
- **Title** (500, `calc(0.8rem + 1vw)` rising to 2rem at 1536px, centred): captions under project and lab cards.
- **Body** (400 Prompt, 1.25rem at 375px, 1.5rem at 768px, 1.6rem at 1024px, 1.8rem at 1536px): the About paragraph. Large and airy, padded by the page gutter.
- **Label** (400 Product Sans, `larger`): desktop nav links.

### Named Rules
**The Rising Line Rule.** Headlines never fade or pop in. Each line sits inside an `overflow: hidden` wrapper and slides up from `translateY(100%)` to 0 over 0.4s, staggered by about 0.2s per line.

**The One Word Rule.** A page title is a single short word or phrase at headline size, centred. Explanatory copy never sits at headline scale.

## Layout

Single-column flow on a centred canvas capped at 1980px. Horizontal breathing room is a percentage gutter of 6% on desktop, about 2em on mobile.

- **Home** is a fixed full-viewport stage with no scroll. The hero text block sits top-left on desktop, centred on mobile, and the portrait cut-out (`img/bg.png`) anchors the bottom-right corner, sized `calc(22vw + 22vh)` to `calc(25vw + 25vh)` and capped at 650px.
- **Grids** for cards: one column on mobile, two columns for Lab and three columns for Project from 1024px, with a 2em gap.
- **Page titles** sit about 2rem to 4rem below the top, centred.
- **Breakpoints:** 375, 768, 1024, 1280, 1536, 1800, and 1980px. 1024px is the major switch: hamburger becomes inline nav, the custom cursor turns on, and grids go multi-column.
- **Navigation chrome** is fixed. The logo pins top-left and the hamburger pins top-right, both 15px to 25px from the edges on mobile.

## Elevation & Depth

Completely flat. There are no box shadows in the main site. Depth comes from three sources only: inversion (black fill behind white text on hover), blend mode (floating chrome inverts what is beneath), and scale (media zooms to 1.125 inside a clipped frame on hover, implying a window onto something larger).

### Named Rules
**The No Shadow Rule.** Do not add `box-shadow` or `drop-shadow`. If something needs to stand out, invert it or frame it with a 1px line.

## Shapes

Every rectangle has square corners. Frames and buttons are drawn with a single 1px solid Ink Black outline. The only rounded forms are the circular cursor ring (50px, 2px white stroke) and the pill-capped hamburger bars (3px tall, `{rounded.pill}`). Media is clipped by its frame with `overflow: hidden`, so images and videos always fill a hard rectangle.

## Components

### Buttons
Outlined, inverting on touch.
- **Shape:** square corners (`{rounded.none}`), 1px Ink Black border.
- **Default:** transparent background, Ink Black text, 1em padding, about 1.2em text.
- **Hover:** background floods to Ink Black and text turns Paper White over 0.25s with `cubic-bezier(0.645, 0.045, 0.355, 1)`.

### Cards / Containers
The media frame is the signature container, used for every project and lab tile.
- **Corner Style:** square.
- **Background:** Paper White, or Ink Black (`media-frame-dark`) behind videos so letterboxing disappears.
- **Shadow Strategy:** none, see Elevation & Depth.
- **Border:** 1px solid Ink Black.
- **Size:** full column width, 50vh tall. Image or video fills it with `object-fit: cover`.
- **Hover:** the media scales to 1.125 over 0.4s inside the clipped frame.
- **Caption:** a Title-level line centred 20px below the frame. Platform limits go in parentheses, such as "(Desktop only)" or "(Github)".
- **Screenshot sweep:** frames with a still image carry a Stage Black panel that slides down and back up on an 8.8s loop behind the image.

### Navigation
- **Desktop (1024px and up):** inline links at top-right in Product Sans, Ink Black, 2em apart. Hover draws an underline from left to right, a 0.1em `currentColor` bar animated by the `--underline-width` custom property over 0.4s.
- **Mobile:** a three-bar hamburger at top-right that blends with `difference`. It opens a full-viewport panel that slides in from the right over 0.5s, with large centred links in Poppins 500 at `calc(2rem + 2vw)`.
- **Logo:** "YM." in Poppins 700 at 2.25em, fixed top-left, white with `mix-blend-mode: difference`.

### Preloader
A full-screen Ink Black curtain. The letters Y, M, and "." sweep across from the left in a staggered loop. On page load the letters fade out at 0.4s, the curtain collapses to zero height by 0.6s, and is removed at 1.1s.

### Cursor
On desktop only, a 50px hollow circle with a 2px white ring and `mix-blend-mode: difference` follows the pointer, trailing it by 0.4s with `cubic-bezier(0.165, 0.84, 0.44, 1)`. It ignores pointer events.

## Do's and Don'ts

### Do:
- **Do** keep interface colour to Ink Black and Paper White, and let project media carry all colour.
- **Do** reveal headlines line by line from an overflow mask with `cubic-bezier(.615, .19, .305, .91)` over 0.4s.
- **Do** frame every piece of work in a square, 1px black outlined, clipped frame with a centred caption beneath.
- **Do** express hover as inversion or as a 1.125 media zoom.
- **Do** use `mix-blend-mode: difference` for chrome that floats over content.

### Don't:
- **Don't** add rounded corners to frames or buttons.
- **Don't** add shadows, tinted surfaces, or decorative gradients to the interface.
- **Don't** introduce a fourth typeface. Poppins, Prompt, and Product Sans already cover display, body, and nav.
- **Don't** fade headlines in. They rise.
