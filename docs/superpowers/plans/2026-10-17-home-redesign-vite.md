# Home Redesign on Vite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the static portfolio to Vite with a GitHub Actions deploy to GitHub Pages, and replace the Home page with the "Program Dial" design where projects lead, plus two write-up pages.

**Architecture:** Vanilla TypeScript on Vite, no UI framework. The old site moves unchanged into `public/` so every archived page and sub-site keeps its relative links. The new Home is `index.html` with static semantic markup; small TS modules add the dial behavior, the scroll spy and the Work panel. The dial math is a pure module so it can be unit tested. Write-ups are extra Vite HTML entries under `writing/`.

**Tech Stack:** Vite, TypeScript, Vitest with jsdom, ESLint (flat config, typescript-eslint), Prettier, `@fontsource-variable/archivo`, pnpm, GitHub Actions (`actions/configure-pages`, `upload-pages-artifact`, `deploy-pages`).

**Card:** none (personal repo) · **Branch:** feat/home-redesign-vite
**Worktree:** none: repo not in `<project>/main` layout · **Main:** /Users/yummamuang/Workspace/projects/portfolio

## Global Constraints

- Site URL is `https://yummamuang.github.io/portfolio/`. Vite `base` is exactly `'/portfolio/'`.
- Dev server: `pnpm dev` at `http://localhost:5173/portfolio/`. Production preview: `pnpm build && pnpm preview` at `http://localhost:4173/portfolio/`.
- Node `>=22` locally. CI uses Node 22. pnpm version is pinned through `packageManager` in `package.json`.
- Vanilla TypeScript only. No React, Vue or other UI framework. No runtime requests to third-party hosts: fonts are self-hosted through `@fontsource-variable/archivo`.
- Prettier owns formatting of TS, CSS, HTML, JSON and YAML. Code blocks in this plan show content, not final formatting: run `pnpm format` before every `pnpm format:check`.
- TypeScript: no `any`, no non-null `!`, no `as` casts to silence the compiler, `??` not `||` for defaults.
- Everything under `public/pages/project/WebDesign-SpaceCat/`, `public/pages/lab/lab5/` and `public/pages/lab/lab7/` stays byte-for-byte unchanged.
- Copy rules from `PRODUCT.md`: "Proof over claims. Every project points to a demo, video, or repo the reader can open." Never add employer names, workplace projects, client names, testimonials, metrics, awards, a CV or LinkedIn. Never mention workplace names or paths from the skill files.
- Credits: quotes by Peter Steinberger, Boris Cherny and Addy Osmani are attributed to them. `subagent-driven-development` and `writing-plans` are presented as customized versions of the open-source superpowers skills, never as written from scratch.
- Accessibility: text contrast at least 4.5:1 (3:1 at 24px and up). Orange text uses `#b23d06`, the bright orange `#f2600c` is only a fill. Touch targets at least 44px. Visible `:focus-visible` on every interactive element. `prefers-reduced-motion: reduce` turns off transitions, animation and video autoplay.
- Every UI task's implementer reads `/Users/yummamuang/.claude/skills/impeccable/reference/craft-floor.md` before editing markup or CSS.
- The direction contract lives only in the impeccable surface brief. Never copy it into source, comments, `data-*` attributes or anything shipped in `dist/`.
- Commits: English, Conventional Commits, stage named files only, never `git add -A`, end each message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push, never merge, never change repository settings. Those are the user's actions.

---

### Task 1: Tooling scaffold

**Depends on:** none

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml` (generated)
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.js`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Create: `.gitignore`
- Modify: `CLAUDE.md` (sections "Stack and deploy" and "Running locally")

**Interfaces:**
- Produces: scripts `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm test`, `pnpm lint`, `pnpm format`, `pnpm format:check`. `vite.config.ts` exports a config with `base: '/portfolio/'`, `test.environment: 'jsdom'` and `build.rollupOptions.input.main` pointing at `index.html`. Later tasks add inputs to that object.

- [ ] **Step 1: Write `package.json`**

Run `pnpm -v` and put the exact printed version after `pnpm@`.

```json
{
  "name": "portfolio",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@<output of pnpm -v>",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run --passWithNoTests",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
pnpm view @fontsource-variable/archivo version
pnpm add -D vite typescript vitest jsdom @types/node eslint @eslint/js typescript-eslint globals prettier
pnpm add @fontsource-variable/archivo
```

Expected: the first command prints a version, `pnpm-lock.yaml` is created, no errors. If the first command returns 404, install `@fontsource/archivo` instead, and in every later step replace `import '@fontsource-variable/archivo'` with the four lines `import '@fontsource/archivo/400.css'`, `import '@fontsource/archivo/500.css'`, `import '@fontsource/archivo/600.css'`, `import '@fontsource/archivo/800.css'`. The `--font` token already falls back to `'Archivo'`.

- [ ] **Step 3: Write `vite.config.ts`**

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/portfolio/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
})
```

If `pnpm build` in a later step prints a deprecation warning naming a replacement for `build.rollupOptions`, rename the key to the one the warning names and keep the same `input` object.

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client", "node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 5: Write `eslint.config.js`**

```js
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  { ignores: ['dist', 'public', 'node_modules'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
)
```

- [ ] **Step 6: Write Prettier and git ignore files**

`.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

`.prettierignore`:

```
dist
public
pnpm-lock.yaml
*.md
.impeccable
```

`.gitignore`:

```
node_modules
dist
.DS_Store
.superpowers
work-memory
```

- [ ] **Step 7: Run every check**

```bash
pnpm lint && pnpm format:check && pnpm test && pnpm exec tsc --noEmit
```

Expected: all exit 0. `pnpm test` prints "No test files found, exiting with code 0".

- [ ] **Step 8: Update `CLAUDE.md`**

Replace the "Stack and deploy" section with:

```markdown
## Stack and deploy

- Vite with vanilla TypeScript, no UI framework. pnpm, Node 22 or newer.
- `base` is `/portfolio/` because GitHub Pages serves the site at `https://yummamuang.github.io/portfolio/`.
- `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on every push to `main`.
- The old static site lives unchanged in `public/` and is copied into `dist/` as-is.
```

Replace the "Running locally" section with:

```markdown
## Running locally

- `pnpm install`, then `pnpm dev` and open `http://localhost:5173/portfolio/`. Check the port is free first.
- `pnpm test` runs Vitest once. Never call bare `vitest`, it starts watch mode.
- `pnpm lint`, `pnpm format:check`, `pnpm build`, then `pnpm preview` at `http://localhost:4173/portfolio/` to check the production build.
```

- [ ] **Step 9: Commit**

```bash
git add package.json pnpm-lock.yaml vite.config.ts tsconfig.json eslint.config.js .prettierrc.json .prettierignore .gitignore CLAUDE.md
git commit -m "build: add vite, typescript and test tooling"
```

---

### Task 2: Move the old site into `public/`

**Depends on:** Task 1

**Files:**
- Move: `css/`, `js/`, `img/`, `video/`, `font/`, `pages/` → `public/css/`, `public/js/`, `public/img/`, `public/video/`, `public/font/`, `public/pages/`
- Delete: `index.html` (old copy of `pages/home.html`)
- Create: `index.html` (temporary entry, replaced in Task 6)
- Modify: `public/pages/home.html`, `public/pages/lab.html`, `public/pages/project.html`, `public/pages/about.html` (logo and "Home" links only)
- Modify: `.vscode/settings.json`

**Interfaces:**
- Produces: old assets at the same URLs under the base, for example `/portfolio/img/bg.png`, `/portfolio/video/canine.mp4`, `/portfolio/pages/project/WebDesign-SpaceCat/index.html`. New code references public files as `/img/...` in HTML (Vite adds the base) and as `` `${import.meta.env.BASE_URL}img/...` `` in TypeScript.

**Browser check:**
- Preconditions: `pnpm dev` running, port 5173.
- Base URL: `http://localhost:5173/portfolio/`

| # | Action | Expected |
|---|---|---|
| 1 | Open `http://localhost:5173/portfolio/pages/project.html` | Old Project page shows six project tiles, the Cat Space video plays |
| 2 | Click "Cat Space Shop Website Design" | New tab shows the Cat Space shop home page with its images loaded |
| 3 | Back on the Project page, click the "YM." logo | Browser goes to `http://localhost:5173/portfolio/` and shows the temporary page with heading "Panatakorn Supak" |
| 4 | Open `http://localhost:5173/portfolio/pages/lab/lab5/index.html` | Lab 5 page renders its type samples with no missing styles |
| 5 | Open `http://localhost:5173/portfolio/pages/about.html` | Bio reads "a Software Engineer" (not "student") and the email link reads "oak.ptkn@gmail.com" |

- [ ] **Step 1: Move the folders with history**

```bash
mkdir public
git mv css js img video font pages public/
git rm index.html
```

- [ ] **Step 2: Point the archive pages' Home links at the new Home**

```bash
sed -i '' 's#href="\./home\.html"#href="../"#g' public/pages/home.html public/pages/lab.html public/pages/project.html public/pages/about.html
grep -c 'href="../"' public/pages/home.html public/pages/lab.html public/pages/project.html public/pages/about.html
```

Expected: each file reports `3`.

- [ ] **Step 2b: Bring the old About page up to date**

The owner asked for the old About page's bio and email to match today ("แก้ bio + email ให้ตรงปัจจุบัน"). In `public/pages/about.html`, replace the whole `<p>` inside `<div class="about_me">` (it starts with `Hi, I'm Panatakorn Supak, a passionate Computer Science student` and ends after the `Github` link) with:

```html
            <p>
                Hi, I'm Panatakorn Supak, a Software Engineer. I studied Computer Science at Khon Kaen University.<br>
                I work with TypeScript, React, Next.js, C# and .NET 8, and PostgreSQL.<br><br>
                <a href="mailto:oak.ptkn@gmail.com">oak.ptkn@gmail.com</a>
                or
                <a href="https://github.com/Yummamuang" target="_blank">Github</a>
            </p>
```

Then confirm the old email is gone from the main archive pages:

```bash
grep -c 'kkumail' public/pages/about.html public/pages/home.html public/pages/lab.html public/pages/project.html
```

Expected: every file reports `0`.

- [ ] **Step 3: Write the temporary `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Panatakorn Supak · Software Engineer</title>
  </head>
  <body>
    <main>
      <h1>Panatakorn Supak</h1>
      <ul>
        <li><a href="./pages/project.html">Projects</a></li>
        <li><a href="./pages/lab.html">Lab</a></li>
        <li><a href="./pages/about.html">About</a></li>
      </ul>
    </main>
  </body>
</html>
```

- [ ] **Step 4: Update the VS Code preview path**

`.vscode/settings.json`:

```json
{
  "livePreview.defaultPreviewPath": "/public/pages/project.html"
}
```

- [ ] **Step 5: Build and check the output keeps the archive**

```bash
pnpm build
test -f dist/pages/project/WebDesign-SpaceCat/index.html && test -f dist/video/canine.mp4 && test -f dist/pages/lab/lab7/index.html && echo ARCHIVE_OK
git diff --cached -M --stat HEAD | grep -E 'WebDesign-SpaceCat|lab5|lab7' | grep -v '=>' | head
```

Expected: `ARCHIVE_OK`, and the second command prints nothing: every archived file shows up only as a rename (`=>`), never as an edit.

- [ ] **Step 6: Commit**

```bash
git add public index.html .vscode/settings.json
git commit -m "build: move the static site into vite public"
```

---

### Task 3: GitHub Actions deploy workflow

**Depends on:** Task 2

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `pnpm lint`, `pnpm test`, `pnpm build` from Task 1, output in `dist/`.

- [ ] **Step 1: Check the latest major version of each action**

```bash
for repo in actions/checkout actions/setup-node pnpm/action-setup actions/configure-pages actions/upload-pages-artifact actions/deploy-pages; do
  printf '%s ' "$repo"; gh api "repos/$repo/releases/latest" --jq .tag_name
done
```

Use the major of each printed tag in Step 2 (for example `v5.0.0` becomes `@v5`). The versions written below are the floor: never go lower.

- [ ] **Step 2: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm format:check
      - run: pnpm test
      - run: pnpm build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`pnpm/action-setup` reads the pnpm version from `packageManager` in `package.json`, so it takes no `version` input.

- [ ] **Step 3: Validate the workflow syntax**

```bash
python3 -c "import sys, yaml; yaml.safe_load(open('.github/workflows/deploy.yml')); print('YAML_OK')"
pnpm install --frozen-lockfile && pnpm lint && pnpm format:check && pnpm test && pnpm build && echo CI_STEPS_OK
```

Expected: `YAML_OK` then `CI_STEPS_OK`. If `python3` has no `yaml` module, run `pnpm dlx js-yaml .github/workflows/deploy.yml > /dev/null && echo YAML_OK` instead.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy the vite build to github pages"
```

**Human checkpoint, not an executor step:** GitHub Pages currently builds from `main` at `/` (legacy). Merging this branch while that setting is active publishes the raw `index.html` that points at `/src/main.ts`, and the site breaks. Before or right at merge, the user switches Settings → Pages → Source to "GitHub Actions" (or runs `gh api -X PUT repos/Yummamuang/portfolio/pages -f build_type=workflow`). The executor reports this in its final summary and does not run it.

---

### Task 4: Home media assets

**Depends on:** Task 2

**Files:**
- Create: `public/img/portrait.webp`
- Create: `public/img/posters/canine.jpg`
- Create: `public/img/posters/catspace.jpg`

**Interfaces:**
- Produces: `/img/portrait.webp` (1050×1400, transparent), `/img/posters/canine.jpg` and `/img/posters/catspace.jpg` (1280 wide). Task 9 references them.

- [ ] **Step 1: Make the portrait cut-out**

```bash
mkdir -p "$TMPDIR/portfolio-assets" public/img/posters
sips -Z 1400 public/img/bg.png --out "$TMPDIR/portfolio-assets/portrait.png"
cwebp -q 82 -alpha_q 90 "$TMPDIR/portfolio-assets/portrait.png" -o public/img/portrait.webp
sips -g pixelWidth -g pixelHeight -g hasAlpha public/img/portrait.webp
```

Expected: `pixelWidth: 1050`, `pixelHeight: 1400`, `hasAlpha: yes`, file under 150 KB (`ls -l public/img/portrait.webp`).

- [ ] **Step 2: Grab video posters**

```bash
ffmpeg -y -ss 1 -i public/video/canine.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 3 public/img/posters/canine.jpg
ffmpeg -y -ss 1 -i public/video/catspace.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 3 public/img/posters/catspace.jpg
```

Open both JPGs and confirm each shows a real frame of its project, not a black frame. If one is black, rerun that command with `-ss 3`.

- [ ] **Step 3: Commit**

```bash
git add public/img/portrait.webp public/img/posters/canine.jpg public/img/posters/catspace.jpg
git commit -m "feat(home): add portrait cut-out and video posters"
```

---

### Task 5: Record the direction contract

**Depends on:** none

**Files:**
- Create: the surface brief for `index.html`, written by the impeccable script (it chooses the path)

- [ ] **Step 1: Write the brief body to a temp file**

Write this exactly to `$TMPDIR/home-surface-brief.md`:

```markdown
## Scope

Home (`index.html`), single page. Visitor mode: Experience. Audience: recruiters, HR and hiring engineers screening for a Software Engineer role, arriving from an application or GitHub, often with under a minute. Primary action: open a project (GitHub, live site or bundled site) or email oak.ptkn@gmail.com. Work leads, then Loops, Agents, Stack, About, Contact.

## Direction contract

THESIS: Home is an appliance faceplate whose program dial is the navigation. It refuses the split hero over a row of equal cards.

OWN-WORLD: Light grey plastic housing (#d6d6d1) around a faceplate (#eeeeea), near-black ink (#1c1c1c), one signal orange (#f2600c) for the pointer, lamp and primary action, dark orange (#b23d06) for orange text. One grotesk, Archivo: tracked caps for labels, tight bold display. Pill buttons, 28px faceplate corners, 1px rules, dashed outlines for unselected stops, solid for the selected one, a black status strip.

STORY: A recruiter sees Panatakorn's face, role and one real project at a glance, turns or scrolls through the six programs, and opens a repo, demo or write-up, or sends an email.

FIRST VIEWPORT: Header plate with YM., name, role, lamp, email and GitHub. Left, a 560px dial with six program labels, Work selected. Right, the featured project: media left; kicker, title, summary, "View on GitHub" and "Next project" right. Below it, the six-project list in two columns beside the portrait cut-out standing on a rule, tagged "About me". Black status strip at the bottom.

FORM: Program Dial, candidate 4 of 7, seed:3b55bd4398fb39dd. Signature interaction: the pointer rotates and detents onto the active program on drag, arrow keys or page scroll, and the lamp blinks once.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
```

- [ ] **Step 2: Save it through the script and read it back**

```bash
/Users/yummamuang/.claude/skills/impeccable/scripts/impeccable surface-brief write index.html "$TMPDIR/home-surface-brief.md"
/Users/yummamuang/.claude/skills/impeccable/scripts/impeccable surface-brief read index.html
```

Expected: the read prints all six blocks THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM (with `seed:3b55bd4398fb39dd`) and FINISH.

- [ ] **Step 3: Commit the brief file the script reported**

```bash
git add <path printed by the write command>
git commit -m "docs(home): record the program dial direction"
```

---

### Task 6: Design tokens and page shell

**Depends on:** Task 1, Task 2, Task 5

**Files:**
- Create: `src/main.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/shell.css`
- Modify: `index.html` (replaces the temporary page from Task 2)

**Interfaces:**
- Produces: CSS custom properties in `tokens.css` (names below), classes `.housing`, `.plate`, `.plate-header`, `.plate-body`, `.display`, `.program`, `.kicker`, `.button-primary`, `.button-secondary`, `.visually-hidden`, `.status-strip`. Placeholders that later tasks replace, each exactly as written in Step 5: `<nav class="dial" id="dial" aria-label="Programs"></nav>`, and one `<section id="<program>" class="program" ...>` per program. Element `[data-dial-status]` in the strip and `[data-lamp]` in the header.

**Browser check:**
- Preconditions: `pnpm dev` running, port 5173.
- Base URL: `http://localhost:5173/portfolio/`

| # | Action | Expected |
|---|---|---|
| 1 | Open `http://localhost:5173/portfolio/` at 1440×900 | Grey housing around a lighter faceplate with rounded corners; header shows "YM.", "Panatakorn Supak", "Software Engineer", an orange dot, "oak.ptkn@gmail.com" and "GitHub" |
| 2 | Look at the bottom of the window | A black strip reads "Program 1 / 6 · Work" on the left |
| 3 | Press Tab once | A "Skip to projects" link appears at the top left with a visible outline |
| 4 | Resize to 390×844 | No horizontal scrollbar; header items wrap onto two lines |

- [ ] **Step 1: Read the craft floor**

Read `/Users/yummamuang/.claude/skills/impeccable/reference/craft-floor.md` in full before writing CSS.

- [ ] **Step 2: Write `src/styles/tokens.css`**

```css
:root {
  --housing: #d6d6d1;
  --plate: #eeeeea;
  --display: #fafaf8;
  --ink: #1c1c1c;
  --ink-muted: #5c5c57;
  --ink-faint: #64645e;
  --rule: #c8c8c2;
  --rule-strong: #c4c4be;
  --stop-idle: #a3a39d;
  --signal: #f2600c;
  --signal-text: #b23d06;
  --knob: #2a2a28;
  --knob-ring: #333331;
  --knob-edge: #444441;
  --strip: #1c1c1c;
  --strip-text: #e6e6e1;
  --strip-muted: #a3a39d;

  --font: 'Archivo Variable', 'Archivo', system-ui, sans-serif;

  --radius-plate: 28px;
  --radius-display: 18px;
  --radius-stop: 12px;
  --radius-pill: 999px;

  --gutter: clamp(16px, 3vw, 40px);
  --housing-pad: clamp(8px, 1.6vw, 24px);

  --ease-detent: cubic-bezier(0.3, 1.4, 0.5, 1);
  --dur-detent: 280ms;
}
```

- [ ] **Step 3: Write `src/styles/base.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--housing);
  color: var(--ink);
  font-family: var(--font);
  font-size: 1rem;
  line-height: 1.5;
}

img,
video {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
}

a:hover {
  color: var(--signal-text);
}

:focus-visible {
  outline: 3px solid var(--signal-text);
  outline-offset: 3px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.kicker {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--signal-text);
}

.button-primary,
.button-secondary {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 24px;
  border-radius: var(--radius-pill);
  font: inherit;
  font-size: 0.9375rem;
  text-decoration: none;
  cursor: pointer;
}

.button-primary {
  background: var(--signal);
  color: var(--ink);
  border: 0;
  font-weight: 800;
}

.button-primary:hover {
  background: #d85508;
  color: var(--ink);
}

.button-secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
  font-weight: 600;
}

.button-secondary:hover {
  background: var(--ink);
  color: var(--plate);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Write `src/styles/shell.css`**

```css
.skip-link {
  position: absolute;
  left: 16px;
  top: -64px;
  z-index: 10;
  padding: 12px 16px;
  background: var(--ink);
  color: var(--plate);
  border-radius: var(--radius-stop);
}

.skip-link:focus {
  top: 16px;
}

.housing {
  min-height: 100svh;
  padding: var(--housing-pad);
}

.plate {
  min-height: calc(100svh - 2 * var(--housing-pad));
  display: flex;
  flex-direction: column;
  background: var(--plate);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-plate);
}

.plate-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  padding: 12px var(--gutter);
  border-bottom: 1px solid var(--rule);
}

.maker {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 16px;
}

.maker-mark {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.maker-name {
  font-weight: 600;
}

.maker-role {
  font-size: 0.875rem;
  color: var(--ink-muted);
}

.plate-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 24px;
  font-size: 0.875rem;
}

.plate-links a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.lamp {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--signal);
}

.lamp[data-blink] {
  animation: lamp-blink 400ms steps(2, jump-none) 1;
}

@keyframes lamp-blink {
  50% {
    opacity: 0.15;
  }
}

.plate-body {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(380px, 560px) minmax(0, 1fr);
  gap: clamp(16px, 2vw, 32px);
  padding: 0 var(--gutter) 0 0;
}

.display {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-block: 24px;
  min-width: 0;
}

.program {
  min-height: calc(100svh - 220px);
  scroll-margin-top: 24px;
}

.status-strip {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px var(--gutter);
  background: var(--strip);
  color: var(--strip-text);
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 0 0 var(--radius-plate) var(--radius-plate);
}

.status-cycle {
  color: var(--strip-muted);
}

@media (max-width: 900px) {
  .plate-body {
    grid-template-columns: minmax(0, 1fr);
    padding: 0 16px;
  }

  .status-cycle,
  .status-stack {
    display: none;
  }
}
```

- [ ] **Step 5: Replace `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Panatakorn Supak · Software Engineer</title>
    <meta
      name="description"
      content="Panatakorn Supak, Software Engineer. Projects, loop engineering and agent workflows."
    />
    <script type="module" src="/src/main.ts"></script>
  </head>
  <body>
    <a class="skip-link" href="#work">Skip to projects</a>
    <div class="housing">
      <div class="plate">
        <header class="plate-header">
          <p class="maker">
            <a class="maker-mark" href="./">YM.</a>
            <span class="maker-name">Panatakorn Supak</span>
            <span class="maker-role">Software Engineer</span>
          </p>
          <div class="plate-links">
            <span class="lamp" data-lamp aria-hidden="true"></span>
            <a href="mailto:oak.ptkn@gmail.com">oak.ptkn@gmail.com</a>
            <a href="https://github.com/Yummamuang">GitHub</a>
          </div>
        </header>
        <div class="plate-body">
          <nav class="dial" id="dial" aria-label="Programs"></nav>
          <main class="display">
            <section id="work" class="program" aria-labelledby="work-title">
              <h2 id="work-title">Work</h2>
            </section>
            <section id="loops" class="program" aria-labelledby="loops-title">
              <h2 id="loops-title">Loop engineering</h2>
            </section>
            <section id="agents" class="program" aria-labelledby="agents-title">
              <h2 id="agents-title">Agent workflow</h2>
            </section>
            <section id="stack" class="program" aria-labelledby="stack-title">
              <h2 id="stack-title">Stack</h2>
            </section>
            <section id="about" class="program" aria-labelledby="about-title">
              <h2 id="about-title">About</h2>
            </section>
            <section id="contact" class="program" aria-labelledby="contact-title">
              <h2 id="contact-title">Contact</h2>
            </section>
          </main>
        </div>
        <footer class="status-strip">
          <span data-dial-status>Program 1 / 6 · Work</span>
          <span class="status-cycle">Pick · Gate · Review · Stop</span>
          <span class="status-stack">.NET · Next.js · Claude Code</span>
        </footer>
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 6: Write `src/main.ts`**

```ts
import '@fontsource-variable/archivo'
import './styles/tokens.css'
import './styles/base.css'
import './styles/shell.css'
```

- [ ] **Step 7: Build and check public URLs got the base**

```bash
pnpm lint && pnpm format:check && pnpm build
grep -o 'href="[^"]*"' dist/index.html | head
```

Expected: build passes. Stylesheet and script URLs in `dist/index.html` start with `/portfolio/assets/`.

- [ ] **Step 8: Commit**

```bash
git add index.html src/main.ts src/styles/tokens.css src/styles/base.css src/styles/shell.css
git commit -m "feat(home): add faceplate shell and design tokens"
```

---

### Task 7: Dial model

**Depends on:** Task 1

**Files:**
- Create: `src/dial/dial-model.ts`
- Test: `src/dial/dial-model.test.ts`

**Interfaces:**
- Produces:
  - `type ProgramId = 'work' | 'loops' | 'agents' | 'stack' | 'about' | 'contact'`
  - `interface Program { id: ProgramId; title: string; angle: number }`
  - `const PROGRAMS: readonly Program[]` in dial order, angles `-120, -72, -24, 24, 72, 120`
  - `stepIndex(index: number, delta: number): number` clamps to `0..5`, no wrap
  - `angleForIndex(index: number): number`
  - `indexForAngle(angle: number): number` nearest stop, clamped
  - `indexForProgram(id: ProgramId): number`
  - `pointerAngle(center: Point, point: Point): number` degrees clockwise from 12 o'clock, range `(-180, 180]`
  - `isProgramId(value: string): value is ProgramId`
  - `interface Point { x: number; y: number }`

**Rules:**
- Shape brief §6: "เปลี่ยนโปรแกรมได้ 4 ทาง: หมุนด้วยการลาก, scroll, คีย์ลูกศร, หรือกดชื่อโปรแกรม" · example: a drag release between two stops snaps to the nearer stop (-100° → Work, -95° → Loops), stepping past either end stays on the end program, angles outside the arc clamp to the first or last program. No property-testing library in the repo, so these are boundary examples.
- Shape brief §3: "6 โปรแกรม: Work → Loops → Agents → Stack → About → Contact" · example: `PROGRAMS` ids equal that order.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import {
  PROGRAMS,
  angleForIndex,
  indexForAngle,
  indexForProgram,
  isProgramId,
  pointerAngle,
  stepIndex,
} from './dial-model'

describe('PROGRAMS', () => {
  it('lists the six programs in dial order starting with work', () => {
    expect(PROGRAMS.map((program) => program.id)).toEqual([
      'work',
      'loops',
      'agents',
      'stack',
      'about',
      'contact',
    ])
  })

  it('spaces the stops 48 degrees apart from -120 to 120', () => {
    expect(PROGRAMS.map((program) => program.angle)).toEqual([-120, -72, -24, 24, 72, 120])
  })
})

describe('stepIndex', () => {
  it('moves one stop forward', () => {
    expect(stepIndex(0, 1)).toBe(1)
  })

  it('stays on the last program when stepping past it', () => {
    expect(stepIndex(5, 1)).toBe(5)
  })

  it('stays on the first program when stepping before it', () => {
    expect(stepIndex(0, -1)).toBe(0)
  })
})

describe('indexForAngle', () => {
  it('snaps an angle short of the midpoint to the nearer stop', () => {
    expect(indexForAngle(-100)).toBe(0)
  })

  it('snaps an angle past the midpoint to the next stop', () => {
    expect(indexForAngle(-95)).toBe(1)
  })

  it('clamps angles past the last stop to the last program', () => {
    expect(indexForAngle(170)).toBe(5)
  })

  it('clamps angles before the first stop to the first program', () => {
    expect(indexForAngle(-170)).toBe(0)
  })
})

describe('angleForIndex', () => {
  it('returns the stop angle of a program index', () => {
    expect(angleForIndex(3)).toBe(24)
  })
})

describe('indexForProgram', () => {
  it('returns the dial position of a program id', () => {
    expect(indexForProgram('stack')).toBe(3)
  })
})

describe('pointerAngle', () => {
  const center = { x: 0, y: 0 }

  it('reads a point straight above the center as 0 degrees', () => {
    expect(pointerAngle(center, { x: 0, y: -10 })).toBeCloseTo(0)
  })

  it('reads a point to the right of the center as 90 degrees', () => {
    expect(pointerAngle(center, { x: 10, y: 0 })).toBeCloseTo(90)
  })

  it('reads a point to the lower left as -135 degrees', () => {
    expect(pointerAngle(center, { x: -10, y: 10 })).toBeCloseTo(-135)
  })
})

describe('isProgramId', () => {
  it('accepts a program id', () => {
    expect(isProgramId('about')).toBe(true)
  })

  it('rejects an unknown id', () => {
    expect(isProgramId('work-title')).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to see it fail**

Run: `pnpm exec vitest run src/dial/dial-model.test.ts`
Expected: FAIL, "Failed to resolve import './dial-model'".

- [ ] **Step 3: Write `src/dial/dial-model.ts`**

```ts
export type ProgramId = 'work' | 'loops' | 'agents' | 'stack' | 'about' | 'contact'

export interface Program {
  id: ProgramId
  title: string
  angle: number
}

export interface Point {
  x: number
  y: number
}

const FIRST_STOP_ANGLE = -120
const STOP_SPACING = 48

const PROGRAM_TITLES: ReadonlyArray<readonly [ProgramId, string]> = [
  ['work', 'Work'],
  ['loops', 'Loops'],
  ['agents', 'Agents'],
  ['stack', 'Stack'],
  ['about', 'About'],
  ['contact', 'Contact'],
]

export const PROGRAMS: readonly Program[] = PROGRAM_TITLES.map(([id, title], index) => ({
  id,
  title,
  angle: FIRST_STOP_ANGLE + index * STOP_SPACING,
}))

const LAST_INDEX = PROGRAMS.length - 1

function clampIndex(index: number): number {
  return Math.min(LAST_INDEX, Math.max(0, index))
}

export function stepIndex(index: number, delta: number): number {
  return clampIndex(index + delta)
}

export function angleForIndex(index: number): number {
  return FIRST_STOP_ANGLE + clampIndex(index) * STOP_SPACING
}

export function indexForAngle(angle: number): number {
  return clampIndex(Math.round((angle - FIRST_STOP_ANGLE) / STOP_SPACING))
}

export function indexForProgram(id: ProgramId): number {
  return PROGRAMS.findIndex((program) => program.id === id)
}

export function pointerAngle(center: Point, point: Point): number {
  const radians = Math.atan2(point.x - center.x, center.y - point.y)
  return (radians * 180) / Math.PI
}

export function isProgramId(value: string): value is ProgramId {
  return PROGRAMS.some((program) => program.id === value)
}
```

- [ ] **Step 4: Run the test to see it pass**

Run: `pnpm exec vitest run src/dial/dial-model.test.ts`
Expected: PASS, 16 tests.

- [ ] **Step 5: Lint, format and commit**

```bash
pnpm exec eslint src/dial && pnpm exec prettier --check src/dial
git add src/dial/dial-model.ts src/dial/dial-model.test.ts
git commit -m "feat(home): add dial stop math"
```

---

### Task 8: Dial controller, scroll spy and dial markup

**Depends on:** Task 6, Task 7

**Files:**
- Create: `src/dial/dial.ts`
- Test: `src/dial/dial.test.ts`
- Create: `src/dial/scroll-spy.ts`
- Test: `src/dial/scroll-spy.test.ts`
- Create: `src/styles/dial.css`
- Modify: `index.html` (replace `<nav class="dial" id="dial" aria-label="Programs"></nav>`)
- Modify: `src/main.ts` (full rewrite below)
- Modify: `src/styles/tokens.css` (`--stop-idle` value, Step 9b)
- Modify: `src/styles/shell.css` (status strip on phones, Step 9b)

**Interfaces:**
- Consumes: everything listed under Task 7 Produces. `[data-dial-status]` and `[data-lamp]` from Task 6.
- Produces:
  - `createDial(options: DialOptions): DialHandle`
  - `interface DialOptions { root: HTMLElement; status: HTMLElement | null; lamp: HTMLElement | null; onSelect: (id: ProgramId) => void }`
  - `interface DialHandle { setActive(id: ProgramId): void }`
  - `observeSections(sections: HTMLElement[], onActive: (id: string) => void): () => void`, using the global `IntersectionObserver`
  - In `src/main.ts`, a module-level `const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')`. Task 9 keeps it when it rewrites `main.ts`.

**Rules:**
- Shape brief §6: "ชื่อโปรแกรมทุกอันเป็นลิงก์จริงไป `#section`" · example: the six labels are `<a href="#work">` … `<a href="#contact">`, checked in the Browser check.
- Shape brief §6: "เปลี่ยนโปรแกรมได้ 4 ทาง: หมุนด้วยการลาก, scroll, คีย์ลูกศร, หรือกดชื่อโปรแกรม" · example: ArrowRight on Work selects Loops; ArrowLeft on Work keeps Work and does not call `onSelect`; a drag released at the Loops side snaps to Loops; a drag carried past Contact into the bottom gap stays on Contact; the scroll spy reports the section that enters the middle band.
- Global constraint: "`prefers-reduced-motion: reduce` turns off transitions, animation" · example: covered by `base.css`, checked in the Browser check with reduced motion emulated.

**Browser check:**
- Preconditions: `pnpm dev` running, port 5173. Window 1440×900.
- Base URL: `http://localhost:5173/portfolio/`

| # | Action | Expected |
|---|---|---|
| 1 | Open the base URL | Dial on the left with labels WORK, LOOPS, AGENTS, STACK, ABOUT, CONTACT around a dark knob; WORK is dark orange and bold; the pointer points at WORK |
| 2 | Click "LOOPS" | Page scrolls to the "Loop engineering" heading; pointer turns to LOOPS; strip reads "Program 2 / 6 · Loops"; the orange dot blinks once |
| 3 | Tab to the knob and press ArrowRight twice | Pointer moves to STACK; page scrolls to the "Stack" heading |
| 4 | Drag the knob clockwise to the right side and release | Pointer settles exactly on the nearest label; page scrolls to that section |
| 5 | Scroll the page back to the top with the mouse wheel | Pointer returns to WORK; strip reads "Program 1 / 6 · Work" |
| 6 | Resize to 390×844 | Knob is hidden; six outlined stops sit at the top, wrapping onto a second line with no sideways scrolling; the current one has a solid border and the rest dashed; the black strip sits at the end of the page instead of staying pinned |
| 7 | Back at 1440×900, drag the knob clockwise past CONTACT into the gap at the bottom and release | Pointer stays on CONTACT; it does not jump to WORK |

- [ ] **Step 1: Write the failing scroll spy test**

`src/dial/scroll-spy.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { observeSections } from './scroll-spy'

type Entry = { target: Element; isIntersecting: boolean }

class FakeObserver {
  static last: FakeObserver | undefined
  readonly observed: Element[] = []
  disconnected = false

  constructor(readonly callback: (entries: Entry[]) => void) {
    FakeObserver.last = this
  }

  observe(element: Element) {
    this.observed.push(element)
  }

  disconnect() {
    this.disconnected = true
  }

  fire(target: Element, isIntersecting: boolean) {
    this.callback([{ target, isIntersecting }])
  }
}

function makeSections() {
  return ['work', 'loops'].map((id) => {
    const section = document.createElement('section')
    section.id = id
    return section
  })
}

describe('observeSections', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports the id of a section entering the middle band', () => {
    const onActive = vi.fn()
    const [, loops] = makeSections()
    if (!loops) throw new Error('fixture missing loops')
    observeSections(makeSections(), onActive)

    FakeObserver.last?.fire(loops, true)

    expect(onActive).toHaveBeenCalledWith('loops')
  })

  it('ignores a section leaving the band', () => {
    const onActive = vi.fn()
    const [work] = makeSections()
    if (!work) throw new Error('fixture missing work')
    observeSections(makeSections(), onActive)

    FakeObserver.last?.fire(work, false)

    expect(onActive).not.toHaveBeenCalled()
  })

  it('observes every section it is given', () => {
    observeSections(makeSections(), vi.fn())

    expect(FakeObserver.last?.observed.map((section) => section.id)).toEqual(['work', 'loops'])
  })

  it('stops observing when the returned function runs', () => {
    const stop = observeSections(makeSections(), vi.fn())

    stop()

    expect(FakeObserver.last?.disconnected).toBe(true)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm exec vitest run src/dial/scroll-spy.test.ts`
Expected: FAIL, "Failed to resolve import './scroll-spy'".

- [ ] **Step 3: Write `src/dial/scroll-spy.ts`**

```ts
// A section counts as current once it crosses a thin band around the middle of the viewport.
const MIDDLE_BAND = '-45% 0px -50% 0px'

export function observeSections(
  sections: HTMLElement[],
  onActive: (id: string) => void,
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onActive(entry.target.id)
      }
    },
    { rootMargin: MIDDLE_BAND },
  )
  for (const section of sections) observer.observe(section)
  return () => observer.disconnect()
}
```

- [ ] **Step 4: Run it to see it pass**

Run: `pnpm exec vitest run src/dial/scroll-spy.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Write the failing dial test**

`src/dial/dial.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDial } from './dial'

const DIAL_MARKUP = `
  <div class="dial-face">
    <div class="dial-knob" data-dial-knob role="slider" tabindex="0" aria-label="Program"
      aria-valuemin="1" aria-valuemax="6" aria-valuenow="1" aria-valuetext="Work"></div>
    <ol class="dial-labels">
      <li><a href="#work" data-program="work" aria-current="true">Work</a></li>
      <li><a href="#loops" data-program="loops">Loops</a></li>
      <li><a href="#agents" data-program="agents">Agents</a></li>
      <li><a href="#stack" data-program="stack">Stack</a></li>
      <li><a href="#about" data-program="about">About</a></li>
      <li><a href="#contact" data-program="contact">Contact</a></li>
    </ol>
  </div>`

function setup() {
  const root = document.createElement('nav')
  root.innerHTML = DIAL_MARKUP
  root.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 200,
    height: 200,
    right: 200,
    bottom: 200,
    toJSON: () => ({}),
  })
  const status = document.createElement('span')
  const lamp = document.createElement('span')
  const onSelect = vi.fn()
  const dial = createDial({ root, status, lamp, onSelect })
  const knob = root.querySelector('[data-dial-knob]')
  if (!(knob instanceof HTMLElement)) throw new Error('knob missing from fixture')
  return { root, status, lamp, onSelect, dial, knob }
}

function press(target: HTMLElement, key: string) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

function pointer(target: HTMLElement, type: string, clientX: number, clientY: number) {
  target.dispatchEvent(new MouseEvent(type, { clientX, clientY, bubbles: true }))
}

describe('createDial', () => {
  let ctx: ReturnType<typeof setup>

  beforeEach(() => {
    ctx = setup()
  })

  it('selects the next program on ArrowRight', () => {
    press(ctx.knob, 'ArrowRight')

    expect(ctx.onSelect).toHaveBeenCalledWith('loops')
    expect(ctx.knob.getAttribute('aria-valuetext')).toBe('Loops')
    expect(ctx.knob.style.getPropertyValue('--dial-angle')).toBe('-72deg')
  })

  it('keeps work selected and stays quiet on ArrowLeft at the first program', () => {
    press(ctx.knob, 'ArrowLeft')

    expect(ctx.onSelect).not.toHaveBeenCalled()
    expect(ctx.knob.getAttribute('aria-valuenow')).toBe('1')
  })

  it('jumps to the last program on End', () => {
    press(ctx.knob, 'End')

    expect(ctx.onSelect).toHaveBeenCalledWith('contact')
  })

  it('marks only the active label as current when set from outside', () => {
    ctx.dial.setActive('about')

    const current = ctx.root.querySelectorAll('[aria-current="true"]')
    expect(current).toHaveLength(1)
    expect(current[0]?.getAttribute('data-program')).toBe('about')
    expect(ctx.onSelect).not.toHaveBeenCalled()
  })

  it('writes the program position into the status strip', () => {
    ctx.dial.setActive('stack')

    expect(ctx.status.textContent).toBe('Program 4 / 6 · Stack')
  })

  it('blinks the lamp once when the program changes', () => {
    ctx.dial.setActive('loops')

    expect(ctx.lamp.hasAttribute('data-blink')).toBe(true)
    ctx.lamp.dispatchEvent(new Event('animationend'))
    expect(ctx.lamp.hasAttribute('data-blink')).toBe(false)
  })

  it('snaps a drag released on the upper left to the nearest program', () => {
    pointer(ctx.knob, 'pointerdown', 100, 100)
    pointer(ctx.knob, 'pointermove', 0, 60)
    pointer(ctx.knob, 'pointerup', 0, 60)

    expect(ctx.onSelect).toHaveBeenCalledWith('loops')
    expect(ctx.knob.hasAttribute('data-dragging')).toBe(false)
  })

  it('keeps contact when a drag continues past it into the gap at the bottom', () => {
    pointer(ctx.knob, 'pointerdown', 100, 100)
    pointer(ctx.knob, 'pointermove', 190, 150)
    pointer(ctx.knob, 'pointermove', 95, 199)
    pointer(ctx.knob, 'pointerup', 95, 199)

    expect(ctx.onSelect).toHaveBeenCalledWith('contact')
    expect(ctx.onSelect).not.toHaveBeenCalledWith('work')
  })
})
```

The gap test moves to (190, 150), about 119° and on the Contact stop, then to (95, 199), about -177° and inside the bottom gap. Without the gap rule that release would snap to Work.

The drag point (0, 60) against the center (100, 100) is at about -68°, nearest to the Loops stop at -72°.

- [ ] **Step 6: Run it to see it fail**

Run: `pnpm exec vitest run src/dial/dial.test.ts`
Expected: FAIL, "Failed to resolve import './dial'".

- [ ] **Step 7: Write `src/dial/dial.ts`**

```ts
import {
  PROGRAMS,
  angleForIndex,
  indexForAngle,
  indexForProgram,
  pointerAngle,
  stepIndex,
  type ProgramId,
} from './dial-model'

export interface DialOptions {
  root: HTMLElement
  status: HTMLElement | null
  lamp: HTMLElement | null
  onSelect: (id: ProgramId) => void
}

export interface DialHandle {
  setActive(id: ProgramId): void
}

const KEY_STEPS: Readonly<Record<string, number>> = {
  ArrowRight: 1,
  ArrowUp: 1,
  ArrowLeft: -1,
  ArrowDown: -1,
}

const ARC_LIMIT = 120

export function createDial({ root, status, lamp, onSelect }: DialOptions): DialHandle {
  const knob = root.querySelector('[data-dial-knob]')
  if (!(knob instanceof HTMLElement)) throw new Error('Dial markup is missing [data-dial-knob]')
  const dialKnob = knob
  const labels = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[data-program]'))
  let activeIndex = 0

  function render(index: number) {
    const program = PROGRAMS[index]
    if (!program) return
    dialKnob.style.setProperty('--dial-angle', `${angleForIndex(index)}deg`)
    dialKnob.setAttribute('aria-valuenow', String(index + 1))
    dialKnob.setAttribute('aria-valuetext', program.title)
    root.dataset.active = program.id
    for (const label of labels) {
      if (label.dataset.program === program.id) label.setAttribute('aria-current', 'true')
      else label.removeAttribute('aria-current')
    }
    if (status) status.textContent = `Program ${index + 1} / ${PROGRAMS.length} · ${program.title}`
  }

  function blinkLamp() {
    if (!lamp) return
    lamp.removeAttribute('data-blink')
    lamp.setAttribute('data-blink', '')
  }

  function activate(index: number) {
    if (index === activeIndex) return false
    activeIndex = index
    render(index)
    blinkLamp()
    return true
  }

  function choose(index: number) {
    const changed = activate(index)
    const program = PROGRAMS[index]
    if (changed && program) onSelect(program.id)
  }

  if (lamp) {
    lamp.addEventListener('animationend', () => lamp.removeAttribute('data-blink'))
  }

  dialKnob.addEventListener('keydown', (event) => {
    const step = KEY_STEPS[event.key]
    if (step !== undefined) {
      event.preventDefault()
      choose(stepIndex(activeIndex, step))
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      choose(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      choose(PROGRAMS.length - 1)
    }
  })

  function angleFromEvent(event: MouseEvent) {
    const box = root.getBoundingClientRect()
    const center = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
    return pointerAngle(center, { x: event.clientX, y: event.clientY })
  }

  let dragging = false
  let dragAngle = angleForIndex(activeIndex)

  // The arc has a gap at the bottom where the pointer angle jumps from +180 to -180.
  // Inside the gap the knob holds the last angle it had on the arc, so a drag past
  // Contact never flips over to Work.
  function trackDrag(event: MouseEvent) {
    const angle = angleFromEvent(event)
    if (Math.abs(angle) <= ARC_LIMIT) dragAngle = angle
    dialKnob.style.setProperty('--dial-angle', `${dragAngle}deg`)
  }

  dialKnob.addEventListener('pointerdown', (event) => {
    dragging = true
    dragAngle = angleForIndex(activeIndex)
    dialKnob.setAttribute('data-dragging', '')
    if (typeof PointerEvent !== 'undefined' && event instanceof PointerEvent) {
      dialKnob.setPointerCapture(event.pointerId)
    }
  })

  dialKnob.addEventListener('pointermove', (event) => {
    if (!dragging) return
    trackDrag(event)
  })

  dialKnob.addEventListener('pointerup', (event) => {
    if (!dragging) return
    dragging = false
    trackDrag(event)
    dialKnob.removeAttribute('data-dragging')
    const index = indexForAngle(dragAngle)
    render(index)
    choose(index)
  })

  render(activeIndex)

  return {
    setActive(id) {
      activate(indexForProgram(id))
    },
  }
}
```

jsdom may not define `PointerEvent`, and the tests send plain `MouseEvent`s with pointer event names. The `typeof` guard skips pointer capture there instead of throwing.

- [ ] **Step 8: Run it to see it pass**

Run: `pnpm exec vitest run src/dial`
Expected: PASS, all dial-model, dial and scroll-spy tests.

- [ ] **Step 9: Read the craft floor, then write `src/styles/dial.css`**

Read `/Users/yummamuang/.claude/skills/impeccable/reference/craft-floor.md` first.

```css
.dial {
  position: sticky;
  top: 16px;
  align-self: start;
  padding-block: 16px;
}

.dial-face {
  position: relative;
  width: min(100%, 560px);
  aspect-ratio: 1;
  margin-inline: auto;
  container-type: inline-size;
}

.dial-ticks {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.dial-ring {
  fill: none;
  stroke: var(--rule-strong);
}

.tick {
  stroke: var(--ink-faint);
  stroke-width: 2;
  stroke-dasharray: 4 4;
}

.dial[data-active='work'] .tick[data-stop='work'],
.dial[data-active='loops'] .tick[data-stop='loops'],
.dial[data-active='agents'] .tick[data-stop='agents'],
.dial[data-active='stack'] .tick[data-stop='stack'],
.dial[data-active='about'] .tick[data-stop='about'],
.dial[data-active='contact'] .tick[data-stop='contact'] {
  stroke: var(--signal);
  stroke-width: 4;
  stroke-dasharray: none;
}

.dial-knob {
  position: absolute;
  inset: 26.8%;
  border-radius: 50%;
  background: var(--knob);
  box-shadow:
    inset 0 0 0 12px var(--knob-ring),
    inset 0 0 0 13px var(--knob-edge);
  transform: rotate(var(--dial-angle, -120deg));
  transition: transform var(--dur-detent) var(--ease-detent);
  cursor: grab;
  touch-action: none;
}

.dial-knob[data-dragging] {
  transition: none;
  cursor: grabbing;
}

.dial-knob:focus-visible {
  outline-offset: 6px;
}

.dial-pointer {
  position: absolute;
  left: calc(50% - 4px);
  top: 7%;
  width: 8px;
  height: 24%;
  border-radius: 4px;
  background: var(--signal);
}

.dial-labels {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dial-labels li {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(var(--stop-angle)) translateY(-42.5cqi)
    rotate(calc(-1 * var(--stop-angle)));
}

.dial-labels a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--ink-muted);
}

.dial-labels a[aria-current='true'] {
  font-weight: 800;
  color: var(--signal-text);
}

.dial-hint {
  margin: 8px 0 0;
  text-align: center;
  font-size: 0.875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

@media (max-width: 900px) {
  .dial {
    top: 0;
    z-index: 2;
    margin-inline: -16px;
    padding: 8px 16px;
    background: var(--plate);
    border-bottom: 1px solid var(--rule);
  }

  .dial-face {
    width: 100%;
    aspect-ratio: auto;
    container-type: normal;
  }

  .dial-ticks,
  .dial-knob,
  .dial-hint {
    display: none;
  }

  .dial-labels {
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .dial-labels li {
    position: static;
    transform: none;
  }

  .dial-labels a {
    border: 2px dashed var(--stop-idle);
    border-radius: var(--radius-stop);
    padding: 0 12px;
    white-space: nowrap;
  }

  .dial-labels a[aria-current='true'] {
    border-style: solid;
    border-color: var(--ink);
  }
}
```

- [ ] **Step 9b: Make unselected stops and the phone strip pass review**

The design critique found the dashed outline of unselected stops at about 2.2:1 against the plate, under the 3:1 minimum for UI component borders, and two sticky bars stacked on a 390px phone. In `src/styles/tokens.css` change `--stop-idle: #a3a39d;` to `--stop-idle: #7d7d77;`. In `src/styles/shell.css`, inside the existing `@media (max-width: 900px)` block, add:

```css
  .status-strip {
    position: static;
  }
```

- [ ] **Step 10: Replace the dial placeholder in `index.html`**

Replace `<nav class="dial" id="dial" aria-label="Programs"></nav>` with:

```html
<nav class="dial" id="dial" aria-label="Programs" data-active="work">
  <div class="dial-face">
    <svg class="dial-ticks" viewBox="0 0 560 560" aria-hidden="true">
      <circle class="dial-ring" cx="280" cy="280" r="196"></circle>
      <line class="tick" data-stop="work" x1="280" y1="64" x2="280" y2="92" transform="rotate(-120 280 280)"></line>
      <line class="tick" data-stop="loops" x1="280" y1="64" x2="280" y2="92" transform="rotate(-72 280 280)"></line>
      <line class="tick" data-stop="agents" x1="280" y1="64" x2="280" y2="92" transform="rotate(-24 280 280)"></line>
      <line class="tick" data-stop="stack" x1="280" y1="64" x2="280" y2="92" transform="rotate(24 280 280)"></line>
      <line class="tick" data-stop="about" x1="280" y1="64" x2="280" y2="92" transform="rotate(72 280 280)"></line>
      <line class="tick" data-stop="contact" x1="280" y1="64" x2="280" y2="92" transform="rotate(120 280 280)"></line>
    </svg>
    <div
      class="dial-knob"
      data-dial-knob
      role="slider"
      tabindex="0"
      aria-label="Program"
      aria-valuemin="1"
      aria-valuemax="6"
      aria-valuenow="1"
      aria-valuetext="Work"
    >
      <span class="dial-pointer"></span>
    </div>
    <ol class="dial-labels">
      <li style="--stop-angle: -120deg"><a href="#work" data-program="work" aria-current="true">Work</a></li>
      <li style="--stop-angle: -72deg"><a href="#loops" data-program="loops">Loops</a></li>
      <li style="--stop-angle: -24deg"><a href="#agents" data-program="agents">Agents</a></li>
      <li style="--stop-angle: 24deg"><a href="#stack" data-program="stack">Stack</a></li>
      <li style="--stop-angle: 72deg"><a href="#about" data-program="about">About</a></li>
      <li style="--stop-angle: 120deg"><a href="#contact" data-program="contact">Contact</a></li>
    </ol>
  </div>
  <p class="dial-hint">Drag the dial or scroll</p>
</nav>
```

- [ ] **Step 11: Rewrite `src/main.ts`**

```ts
import '@fontsource-variable/archivo'
import './styles/tokens.css'
import './styles/base.css'
import './styles/shell.css'
import './styles/dial.css'
import { createDial } from './dial/dial'
import { PROGRAMS, isProgramId } from './dial/dial-model'
import { observeSections } from './dial/scroll-spy'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const dialRoot = document.getElementById('dial')
if (dialRoot) {
  const dial = createDial({
    root: dialRoot,
    status: document.querySelector<HTMLElement>('[data-dial-status]'),
    lamp: document.querySelector<HTMLElement>('[data-lamp]'),
    onSelect: (id) => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' })
    },
  })
  const sections = PROGRAMS.map((program) => document.getElementById(program.id)).filter(
    (section): section is HTMLElement => section !== null,
  )
  observeSections(sections, (id) => {
    if (isProgramId(id)) dial.setActive(id)
  })
}
```

- [ ] **Step 12: Check everything**

```bash
pnpm lint && pnpm format:check && pnpm test && pnpm build
```

Expected: all pass.

- [ ] **Step 13: Commit**

```bash
git add src/dial/dial.ts src/dial/dial.test.ts src/dial/scroll-spy.ts src/dial/scroll-spy.test.ts src/styles/dial.css index.html src/main.ts
git commit -m "feat(home): add program dial navigation"
```

---

### Task 9: Work program

**Depends on:** Task 4, Task 8

**Files:**
- Create: `src/work/projects.ts`
- Test: `src/work/projects.test.ts`
- Create: `src/work/work-panel.ts`
- Test: `src/work/work-panel.test.ts`
- Create: `src/styles/work.css`
- Modify: `index.html` (replace the `#work` placeholder section)
- Modify: `src/main.ts` (full rewrite below)

**Interfaces:**
- Consumes: `/img/portrait.webp`, `/img/posters/canine.jpg`, `/img/posters/catspace.jpg` from Task 4. `reducedMotion` pattern from Task 8's `main.ts`.
- Produces:
  - `interface Project { id: string; title: string; tag: string; summary: string; link: { label: string; href: string }; media: ProjectMedia; desktopOnly: boolean }`
  - `type ProjectMedia = { kind: 'video'; src: string; poster: string } | { kind: 'image'; src: string; alt: string }`
  - `const PROJECTS: readonly Project[]`
  - `createWorkPanel(options: { root: HTMLElement; projects: readonly Project[]; autoplay: boolean }): { select(index: number): void }`

**Rules:**
- PRODUCT.md principle 1: "Proof over claims. Every project points to a demo, video, or repo the reader can open." · `property` checked as examples over the whole list: every entry in `PROJECTS` has a link starting with `https://` or the site base.
- Shape brief §5: "ชิ้นเด่นมีสื่อ (วิดีโอหรือรูป) + ชื่อ + คำอธิบาย 1–2 บรรทัด + ลิงก์" · example: the featured panel renders media, title, summary and the project link for the first project on start.
- Shape brief §5: "วิดีโอที่ยังโหลดไม่เสร็จ (แสดง poster)" · example: every video project has a poster and the rendered `<video>` carries it.
- Shape brief §5: "ป้าย 'Desktop only' ของงานที่ใช้ได้แค่บนจอคอม" · example: the Manga project renders a "Desktop only" tag; Canine does not.
- Global constraint: "`prefers-reduced-motion: reduce` turns off ... video autoplay" · example: with `autoplay: false` the video has `controls` and no `autoplay` attribute.
- User answer: "Canine นำ ตาม canvas" · example: order is Canine, Manga, Cat Space, Gym, Data, Snake.
- User answer after the design critique: "คง Canine นำ + เพิ่มบรรทัดตำแหน่ง" · example: the Work section opens with the role line linking to the agent workflow write-up, checked in the Browser check.
- User answer after the design critique: kickers removed ("เอาออก") · example: the featured panel has no `.kicker`; the position shows as `1 / 6` beside the buttons.

**Browser check:**
- Preconditions: `pnpm dev` running, port 5173. Window 1440×900.
- Base URL: `http://localhost:5173/portfolio/`

| # | Action | Expected |
|---|---|---|
| 1 | Open the base URL | Right side opens with the line "Software Engineer working with .NET and Next.js. I also design agent workflows for Claude Code. See how", then a card with the canine video (playing, muted), heading "Impacted canine assessment", an orange "View on GitHub" button, a "Next project" button and "1 / 6" at the end of that row; no small label above the heading |
| 2 | Below the card, without scrolling | Two-column list of six projects, the first with a solid border and the rest dashed; the portrait stands at the right of the list with an "About me" tag, and the face is fully visible inside the 900px-tall window |
| 3 | Click "Next project" | Card shows "Manga recommendation", "2 / 6", a "Desktop only" tag, and "Open live site"; the second list entry is now solid; clicking the screenshot opens the live site |
| 4 | Click "Snake game" in the list | Card shows "Snake game" with its screenshot and "View on GitHub" |
| 5 | Click "Next project" on Snake game | Card wraps to "Impacted canine assessment" |
| 6 | Click "View on GitHub" | Opens `https://github.com/Yummamuang/prediction-of-maxillary-impacted-canine` |
| 7 | Emulate `prefers-reduced-motion: reduce` and reload | The canine video does not play on its own and shows its poster with playback controls |

- [ ] **Step 1: Write the failing projects test**

`src/work/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { PROJECTS } from './projects'

const base = import.meta.env.BASE_URL

describe('PROJECTS', () => {
  it('orders the projects with the impacted canine project first', () => {
    expect(PROJECTS.map((project) => project.id)).toEqual([
      'canine',
      'manga',
      'catspace',
      'gym',
      'data',
      'snake',
    ])
  })

  it('links every project to a repo, live site or bundled site', () => {
    for (const project of PROJECTS) {
      const opensSomething =
        project.link.href.startsWith('https://') || project.link.href.startsWith(base)
      expect(opensSomething, project.id).toBe(true)
    }
  })

  it('gives every video a poster under the site base', () => {
    for (const project of PROJECTS) {
      if (project.media.kind === 'video') {
        expect(project.media.poster.startsWith(`${base}img/posters/`), project.id).toBe(true)
      }
    }
  })

  it('gives every image alt text', () => {
    for (const project of PROJECTS) {
      if (project.media.kind === 'image') {
        expect(project.media.alt.length, project.id).toBeGreaterThan(0)
      }
    }
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm exec vitest run src/work/projects.test.ts`
Expected: FAIL, "Failed to resolve import './projects'".

- [ ] **Step 3: Write `src/work/projects.ts`**

```ts
export type ProjectMedia =
  | { kind: 'video'; src: string; poster: string }
  | { kind: 'image'; src: string; alt: string }

export interface Project {
  id: string
  title: string
  tag: string
  summary: string
  link: { label: string; href: string }
  media: ProjectMedia
  desktopOnly: boolean
}

const base = import.meta.env.BASE_URL

export const PROJECTS: readonly Project[] = [
  {
    id: 'canine',
    title: 'Impacted canine assessment',
    tag: 'GitHub',
    summary:
      'Web application that detects maxillary impacted canines in panoramic radiographs and assesses their eruption potential.',
    link: {
      label: 'View on GitHub',
      href: 'https://github.com/Yummamuang/prediction-of-maxillary-impacted-canine',
    },
    media: {
      kind: 'video',
      src: `${base}video/canine.mp4`,
      poster: `${base}img/posters/canine.jpg`,
    },
    desktopOnly: false,
  },
  {
    id: 'manga',
    title: 'Manga recommendation',
    tag: 'Live',
    summary: 'Manga recommendation website.',
    link: { label: 'Open live site', href: 'https://manga-system.vercel.app/' },
    media: {
      kind: 'image',
      src: `${base}img/manga-direct.png`,
      alt: 'Screenshot of the manga recommendation website',
    },
    desktopOnly: true,
  },
  {
    id: 'catspace',
    title: 'Cat Space shop',
    tag: 'Design',
    summary: 'Cat Space shop website design.',
    link: { label: 'Open the site', href: `${base}pages/project/WebDesign-SpaceCat/index.html` },
    media: {
      kind: 'video',
      src: `${base}video/catspace.mp4`,
      poster: `${base}img/posters/catspace.jpg`,
    },
    desktopOnly: false,
  },
  {
    id: 'gym',
    title: 'Gym management system',
    tag: 'Laravel',
    summary: 'Gym management system built with the Laravel framework.',
    link: { label: 'View on GitHub', href: 'https://github.com/Yummamuang/Gym-Management-System' },
    media: {
      kind: 'image',
      src: `${base}img/gymmanagementsystem.png`,
      alt: 'Screenshot of the gym management system',
    },
    desktopOnly: false,
  },
  {
    id: 'data',
    title: 'Game view counts mini project',
    tag: 'Data',
    summary:
      'Mini data engineering project comparing view counts for the top 15 popular games on YouTube, Twitch and Facebook.',
    link: {
      label: 'View on GitHub',
      href: 'https://github.com/Yummamuang/Data-Engineering-Mini-Project',
    },
    media: {
      kind: 'image',
      src: `${base}img/dataengineering.jpg`,
      alt: 'Chart from the game view counts project',
    },
    desktopOnly: false,
  },
  {
    id: 'snake',
    title: 'Snake game',
    tag: 'Python',
    summary: 'Snake game written in Python.',
    link: {
      label: 'View on GitHub',
      href: 'https://github.com/Yummamuang/Snake-Game-Development',
    },
    media: {
      kind: 'image',
      src: `${base}img/snakegame.jpg`,
      alt: 'Screenshot of the snake game',
    },
    desktopOnly: false,
  },
]
```

Before committing, open `public/img/dataengineering.jpg` and `public/img/gymmanagementsystem.png` and correct the two `alt` texts if the image is not what they say.

- [ ] **Step 4: Run it to see it pass**

Run: `pnpm exec vitest run src/work/projects.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Write the failing panel test**

`src/work/work-panel.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { PROJECTS } from './projects'
import { createWorkPanel } from './work-panel'

const PANEL_MARKUP = `
  <div data-work-featured></div>
  <ol data-work-list></ol>`

function setup(autoplay = true) {
  const root = document.createElement('section')
  root.innerHTML = PANEL_MARKUP
  createWorkPanel({ root, projects: PROJECTS, autoplay })
  return root
}

function text(root: HTMLElement, selector: string) {
  return root.querySelector(selector)?.textContent ?? ''
}

function click(root: HTMLElement, selector: string) {
  const target = root.querySelector(selector)
  if (!(target instanceof HTMLElement)) throw new Error(`missing ${selector}`)
  target.click()
}

describe('createWorkPanel', () => {
  let root: HTMLElement

  beforeEach(() => {
    root = setup()
  })

  it('features the first project with its link on start', () => {
    expect(text(root, '[data-work-featured] h3')).toBe('Impacted canine assessment')
    expect(root.querySelector('[data-work-featured] a.button-primary')?.getAttribute('href')).toBe(
      'https://github.com/Yummamuang/prediction-of-maxillary-impacted-canine',
    )
    expect(text(root, '[data-work-featured] .work-count')).toBe('1 / 6')
  })

  it('links an image project media frame to the project', () => {
    click(root, '[data-work-next]')

    expect(root.querySelector('[data-work-featured] a.work-media')?.getAttribute('href')).toBe(
      'https://manga-system.vercel.app/',
    )
  })

  it('lists every project as a button', () => {
    expect(root.querySelectorAll('[data-work-list] button')).toHaveLength(6)
  })

  it('features a project chosen from the list and marks it pressed', () => {
    click(root, '[data-work-list] li:nth-child(6) button')

    expect(text(root, '[data-work-featured] h3')).toBe('Snake game')
    expect(
      root.querySelector('[data-work-list] li:nth-child(6) button')?.getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      root.querySelector('[data-work-list] li:nth-child(1) button')?.getAttribute('aria-pressed'),
    ).toBe('false')
  })

  it('wraps from the last project to the first on Next project', () => {
    click(root, '[data-work-list] li:nth-child(6) button')
    click(root, '[data-work-next]')

    expect(text(root, '[data-work-featured] h3')).toBe('Impacted canine assessment')
  })

  it('shows the poster on a video project', () => {
    expect(root.querySelector('[data-work-featured] video')?.getAttribute('poster')).toMatch(
      /img\/posters\/canine\.jpg$/,
    )
  })

  it('tags a desktop-only project', () => {
    click(root, '[data-work-next]')

    expect(text(root, '[data-work-featured] .work-desktop-only')).toBe('Desktop only')
  })

  it('leaves the desktop-only tag off other projects', () => {
    expect(root.querySelector('[data-work-featured] .work-desktop-only')).toBeNull()
  })

  it('shows controls instead of autoplay when autoplay is off', () => {
    const still = setup(false)
    const video = still.querySelector('[data-work-featured] video')

    expect(video?.hasAttribute('autoplay')).toBe(false)
    expect(video?.hasAttribute('controls')).toBe(true)
  })
})
```

- [ ] **Step 6: Run it to see it fail**

Run: `pnpm exec vitest run src/work/work-panel.test.ts`
Expected: FAIL, "Failed to resolve import './work-panel'".

- [ ] **Step 7: Write `src/work/work-panel.ts`**

```ts
import type { Project } from './projects'

interface WorkPanelOptions {
  root: HTMLElement
  projects: readonly Project[]
  autoplay: boolean
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  children: Array<Node | string> = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  node.append(...children)
  return node
}

function renderMedia(project: Project, autoplay: boolean): HTMLElement {
  if (project.media.kind === 'image') {
    const frameLink = el('a', 'work-media')
    frameLink.href = project.link.href
    const image = el('img', '')
    image.src = project.media.src
    image.alt = project.media.alt
    frameLink.append(image)
    return frameLink
  }
  const frame = el('div', 'work-media')
  const video = el('video', '')
  video.setAttribute('src', project.media.src)
  video.setAttribute('poster', project.media.poster)
  video.setAttribute('preload', 'metadata')
  video.setAttribute('playsinline', '')
  video.setAttribute('loop', '')
  video.muted = true
  video.setAttribute('muted', '')
  video.setAttribute('aria-label', `Video of ${project.title}`)
  if (autoplay) video.setAttribute('autoplay', '')
  else video.setAttribute('controls', '')
  frame.append(video)
  return frame
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function createWorkPanel({ root, projects, autoplay }: WorkPanelOptions) {
  const featured = root.querySelector('[data-work-featured]')
  const list = root.querySelector('[data-work-list]')
  if (!(featured instanceof HTMLElement) || !(list instanceof HTMLElement)) {
    throw new Error('Work markup is missing [data-work-featured] or [data-work-list]')
  }
  const featuredRoot = featured
  let current = 0

  const buttons = projects.map((project, index) => {
    const button = el('button', 'work-stop', [
      el('span', 'work-stop-tag', [`${pad(index + 1)} · ${project.tag}`]),
      el('span', 'work-stop-title', [project.title]),
    ])
    button.type = 'button'
    button.addEventListener('click', () => select(index))
    return button
  })
  list.replaceChildren(...buttons.map((button) => el('li', '', [button])))

  function select(index: number) {
    const project = projects[index]
    if (!project) return
    current = index

    const link = el('a', 'button-primary', [project.link.label])
    link.href = project.link.href
    const next = el('button', 'button-secondary', ['Next project'])
    next.type = 'button'
    next.dataset.workNext = ''
    next.addEventListener('click', () => select((current + 1) % projects.length))

    const count = el('span', 'work-count', [`${index + 1} / ${projects.length}`])
    count.setAttribute('aria-label', `Project ${index + 1} of ${projects.length}`)

    const body = el('div', 'work-body', [
      el('h3', 'work-title', [project.title]),
      el('p', 'work-summary', [project.summary]),
    ])
    if (project.desktopOnly) body.append(el('p', 'work-desktop-only', ['Desktop only']))
    body.append(el('div', 'work-actions', [link, next, count]))

    featuredRoot.replaceChildren(renderMedia(project, autoplay), body)
    buttons.forEach((button, buttonIndex) =>
      button.setAttribute('aria-pressed', String(buttonIndex === index)),
    )
  }

  select(0)
  return { select }
}
```

- [ ] **Step 8: Run it to see it pass**

Run: `pnpm exec vitest run src/work`
Expected: PASS, 13 tests.

- [ ] **Step 9: Read the craft floor, then write `src/styles/work.css`**

Read `/Users/yummamuang/.claude/skills/impeccable/reference/craft-floor.md` first.

```css
.program-work {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.work-featured {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 28px;
  padding: 24px;
  background: var(--display);
  border: 1px solid var(--rule);
  border-radius: var(--radius-display);
}

.work-media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: var(--radius-stop);
  background: var(--ink);
}

.work-media img,
.work-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.work-title {
  margin: 0;
  font-size: clamp(2rem, 3.2vw, 2.875rem);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.work-summary {
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.45;
  color: var(--ink);
  max-width: 48ch;
}

.work-desktop-only {
  align-self: flex-start;
  margin: 0;
  padding: 4px 10px;
  border: 1px solid var(--ink);
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 600;
}

.work-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.work-count {
  margin-left: auto;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
  font-variant-numeric: tabular-nums;
}

a.work-media {
  display: block;
}

.work-intro {
  margin: 0;
  max-width: 60ch;
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 600;
}

.work-intro a {
  color: var(--signal-text);
}

.work-lower {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 230px;
  gap: 16px;
  align-items: end;
}

.work-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.work-stop {
  width: 100%;
  min-height: 56px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px 14px;
  background: transparent;
  border: 2px dashed var(--stop-idle);
  border-radius: var(--radius-stop);
  font: inherit;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}

.work-stop[aria-pressed='true'] {
  background: var(--display);
  border-style: solid;
  border-color: var(--ink);
}

.work-stop:hover {
  border-color: var(--ink);
}

.work-stop-tag {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.work-stop[aria-pressed='true'] .work-stop-tag {
  color: var(--signal-text);
}

.work-stop-title {
  font-size: 0.9375rem;
  font-weight: 600;
}

.portrait-link {
  position: relative;
  display: block;
  height: 236px;
  overflow: hidden;
  border-bottom: 2px solid var(--ink);
  text-decoration: none;
}

.portrait-link img {
  position: absolute;
  left: -4px;
  top: -48px;
  width: 238px;
  height: auto;
}

.portrait-tag {
  position: absolute;
  left: 0;
  bottom: 8px;
  padding: 4px 8px;
  background: var(--ink);
  color: var(--plate);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (max-width: 1100px) {
  .work-featured {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .work-lower {
    grid-template-columns: minmax(0, 1fr);
  }

  .work-list {
    grid-template-columns: minmax(0, 1fr);
  }

  .portrait-link {
    order: -1;
    width: 230px;
  }
}
```

- [ ] **Step 10: Replace the `#work` placeholder in `index.html`**

Replace:

```html
<section id="work" class="program" aria-labelledby="work-title">
  <h2 id="work-title">Work</h2>
</section>
```

with:

```html
<section id="work" class="program program-work" aria-labelledby="work-title" data-work>
  <h2 id="work-title" class="visually-hidden">Work</h2>
  <p class="work-intro">
    Software Engineer working with .NET and Next.js. I also design agent workflows for Claude
    Code. <a href="./writing/agent-workflow.html">See how</a>
  </p>
  <div class="work-featured" data-work-featured aria-live="polite"></div>
  <div class="work-lower">
    <ol class="work-list" data-work-list aria-label="All projects"></ol>
    <a class="portrait-link" href="#about">
      <img src="/img/portrait.webp" alt="Panatakorn Supak" width="1050" height="1400" />
      <span class="portrait-tag">About me</span>
    </a>
  </div>
  <noscript>
    <ul>
      <li><a href="https://github.com/Yummamuang/prediction-of-maxillary-impacted-canine">Impacted canine assessment</a></li>
      <li><a href="https://manga-system.vercel.app/">Manga recommendation</a></li>
      <li><a href="./pages/project/WebDesign-SpaceCat/index.html">Cat Space shop</a></li>
      <li><a href="https://github.com/Yummamuang/Gym-Management-System">Gym management system</a></li>
      <li><a href="https://github.com/Yummamuang/Data-Engineering-Mini-Project">Game view counts mini project</a></li>
      <li><a href="https://github.com/Yummamuang/Snake-Game-Development">Snake game</a></li>
    </ul>
  </noscript>
</section>
```

- [ ] **Step 11: Rewrite `src/main.ts`**

```ts
import '@fontsource-variable/archivo'
import './styles/tokens.css'
import './styles/base.css'
import './styles/shell.css'
import './styles/dial.css'
import './styles/work.css'
import { createDial } from './dial/dial'
import { PROGRAMS, isProgramId } from './dial/dial-model'
import { observeSections } from './dial/scroll-spy'
import { PROJECTS } from './work/projects'
import { createWorkPanel } from './work/work-panel'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const workRoot = document.querySelector<HTMLElement>('[data-work]')
if (workRoot) {
  createWorkPanel({ root: workRoot, projects: PROJECTS, autoplay: !reducedMotion.matches })
}

const dialRoot = document.getElementById('dial')
if (dialRoot) {
  const dial = createDial({
    root: dialRoot,
    status: document.querySelector<HTMLElement>('[data-dial-status]'),
    lamp: document.querySelector<HTMLElement>('[data-lamp]'),
    onSelect: (id) => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' })
    },
  })
  const sections = PROGRAMS.map((program) => document.getElementById(program.id)).filter(
    (section): section is HTMLElement => section !== null,
  )
  observeSections(sections, (id) => {
    if (isProgramId(id)) dial.setActive(id)
  })
}
```

- [ ] **Step 12: Check everything, including the portrait URL in the build**

```bash
pnpm lint && pnpm format:check && pnpm test && pnpm build
grep -o 'src="[^"]*portrait[^"]*"' dist/index.html
```

Expected: all pass, and the grep prints `src="/portfolio/img/portrait.webp"`.

- [ ] **Step 13: Commit**

```bash
git add src/work/projects.ts src/work/projects.test.ts src/work/work-panel.ts src/work/work-panel.test.ts src/styles/work.css index.html src/main.ts
git commit -m "feat(home): add projects-first work program"
```

---

### Task 10: Loops, Agents, Stack, About and Contact programs

**Depends on:** Task 9

**Files:**
- Create: `src/styles/sections.css`
- Modify: `index.html` (replace the five placeholder sections `#loops`, `#agents`, `#stack`, `#about`, `#contact`)
- Modify: `src/main.ts` (add one import line)
- Modify: `src/styles/base.css` (remove the unused `.kicker` rule)

**Interfaces:**
- Consumes: `.button-primary`, `.button-secondary` from Task 6. Links to `./writing/loop-engineering.html` and `./writing/agent-workflow.html`, created in Tasks 11 and 12.

**Rules:**
- PRODUCT.md "Absent, do not fabricate: employer name, workplace projects, client names, testimonials, metrics, awards, a CV file, LinkedIn." · example: the copy below names no employer and states no numbers.
- PRODUCT.md "Present them as customized versions and credit superpowers." · example: the Agents section carries the credit line.
- User answer after the design critique: "คงชื่อ เพิ่มประโยคเปิดที่เข้าใจง่าย" · example: the Loops and Agents ledes open with a plain sentence a recruiter understands; the dial labels stay "Loops" and "Agents".
- User answer after the design critique: kickers removed ("เอาออก") · example: `grep kicker` finds nothing in `index.html` or `src`.
- User answer: "เก็บไว้ ลิงก์จาก Home" (old Lab, Project, About pages) · example: About links to `./pages/lab.html`, `./pages/project.html`, `./pages/about.html`.

**Browser check:**
- Preconditions: `pnpm dev` running, port 5173. Window 1440×900.
- Base URL: `http://localhost:5173/portfolio/`

| # | Action | Expected |
|---|---|---|
| 1 | Click "LOOPS" on the dial | Section starts with the heading "Loop engineering" (no small label above it), a lede that opens "A coding agent can work in a loop", four numbered stage boxes that all look the same, and a "Read the write-up" button |
| 2 | Click "AGENTS" | Heading "Agent workflow", four steps, and the line "Customized from the open-source superpowers skills." |
| 3 | Click "STACK" | Six groups: Frontend, Backend, Observability, Testing, Infra and delivery, AI-assisted engineering |
| 4 | Click "ABOUT" | Full-body photo, the bio paragraph, and links "Lab", "Projects", "About" under "Older work" |
| 5 | Click "Projects" under Older work | Old Project page opens at `/portfolio/pages/project.html` |
| 6 | Back, click "CONTACT" | Large "oak.ptkn@gmail.com" link, an orange "Email me" button and a "GitHub" link; the email link and the button open a mail draft |
| 7 | Look at the black strip at the bottom | Middle text reads "Software Engineer" |

- [ ] **Step 1: Read the craft floor**

Read `/Users/yummamuang/.claude/skills/impeccable/reference/craft-floor.md` first.

- [ ] **Step 2: Replace the five placeholder sections in `index.html`**

Replace the `#loops`, `#agents`, `#stack`, `#about` and `#contact` placeholder sections from Task 6 with:

```html
<section id="loops" class="program program-panel" aria-labelledby="loops-title">
  <h2 id="loops-title" class="panel-title">Loop engineering</h2>
  <p class="panel-lede">
    A coding agent can work in a loop: pick one task, check its own result, and stop when the
    checks pass. I design those loops: one change per pass, a gate that has to pass, and a rule for
    when to stop.
  </p>
  <ol class="stage-row" aria-label="One pass of the loop">
    <li class="stage"><span class="stage-no">01</span>Next item in STATE.md</li>
    <li class="stage"><span class="stage-no">02</span>Fix a red gate</li>
    <li class="stage"><span class="stage-no">03</span>Oldest PR comment</li>
    <li class="stage"><span class="stage-no">04</span>Nothing pending: stop</li>
  </ol>
  <ul class="rule-list">
    <li>One logical change per pass</li>
    <li>Never edit a test to make it pass</li>
    <li>Same item fails twice: stop and report</li>
  </ul>
  <div class="panel-actions">
    <a class="button-primary" href="./writing/loop-engineering.html">Read the write-up</a>
  </div>
</section>

<section id="agents" class="program program-panel" aria-labelledby="agents-title">
  <h2 id="agents-title" class="panel-title">Agent workflow</h2>
  <p class="panel-lede">
    How I split work for coding agents: a written plan, one fresh agent for each task, a review
    after every task, and one broad review of the whole branch at the end.
  </p>
  <ol class="stage-row" aria-label="Agent workflow steps">
    <li class="stage"><span class="stage-no">01</span>Write the plan</li>
    <li class="stage"><span class="stage-no">02</span>One subagent per task</li>
    <li class="stage"><span class="stage-no">03</span>Review every task</li>
    <li class="stage"><span class="stage-no">04</span>Review the whole branch</li>
  </ol>
  <p class="panel-credit">Customized from the open-source superpowers skills.</p>
  <div class="panel-actions">
    <a class="button-primary" href="./writing/agent-workflow.html">Read the write-up</a>
  </div>
</section>

<section id="stack" class="program program-panel" aria-labelledby="stack-title">
  <h2 id="stack-title" class="panel-title">Stack</h2>
  <dl class="stack-grid">
    <div class="stack-group">
      <dt>Frontend</dt>
      <dd>TypeScript, React, Next.js, Nx with pnpm, Mantine, Tailwind CSS, TanStack Query, React Hook Form with Zod, OpenAPI clients, OIDC, SignalR</dd>
    </div>
    <div class="stack-group">
      <dt>Backend</dt>
      <dd>C# and .NET 8, ASP.NET Core, Entity Framework Core, PostgreSQL, MassTransit, Quartz, OpenIddict, Clean Architecture</dd>
    </div>
    <div class="stack-group">
      <dt>Observability</dt>
      <dd>Serilog, OpenTelemetry</dd>
    </div>
    <div class="stack-group">
      <dt>Testing</dt>
      <dd>xUnit, FluentAssertions, Moq, property-based tests with CsCheck, Vitest, Testing Library, Playwright</dd>
    </div>
    <div class="stack-group">
      <dt>Infra and delivery</dt>
      <dd>Docker, Kubernetes, GitHub Actions</dd>
    </div>
    <div class="stack-group">
      <dt>AI-assisted engineering</dt>
      <dd>Claude Code agent workflows, loop engineering</dd>
    </div>
  </dl>
  <p class="panel-credit">Earlier projects also used Node.js, Laravel and Python.</p>
</section>

<section id="about" class="program program-panel program-about" aria-labelledby="about-title">
  <div class="about-photo">
    <img
      src="/img/my_pic.jpg"
      alt="Panatakorn Supak standing in front of a white wall"
      width="4032"
      height="1362"
      loading="lazy"
    />
  </div>
  <div class="about-body">
    <h2 id="about-title" class="panel-title">About</h2>
    <p class="panel-lede">
      I'm Panatakorn Supak, a Software Engineer. I studied Computer Science at Khon Kaen
      University. I also design loops and agent workflows for Claude Code.
    </p>
    <p class="older-work">
      Older work:
      <a href="./pages/lab.html">Lab</a>
      <a href="./pages/project.html">Projects</a>
      <a href="./pages/about.html">About</a>
    </p>
  </div>
</section>

<section id="contact" class="program program-panel" aria-labelledby="contact-title">
  <h2 id="contact-title" class="panel-title">Contact</h2>
  <p class="contact-mail"><a href="mailto:oak.ptkn@gmail.com">oak.ptkn@gmail.com</a></p>
  <div class="panel-actions">
    <a class="button-primary" href="mailto:oak.ptkn@gmail.com">Email me</a>
    <a class="button-secondary" href="https://github.com/Yummamuang">GitHub</a>
  </div>
</section>
```

- [ ] **Step 3: Write `src/styles/sections.css`**

```css
.program-panel {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: clamp(24px, 3vw, 44px) clamp(20px, 3vw, 48px);
  background: var(--display);
  border: 1px solid var(--rule);
  border-radius: var(--radius-display);
}

.panel-title {
  margin: 0;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.035em;
}

.panel-lede {
  margin: 0;
  max-width: 56ch;
  font-size: 1.1875rem;
  line-height: 1.45;
}

.stage-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stage {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border: 1px solid var(--rule);
  border-radius: var(--radius-stop);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ink);
}

.stage-no {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--signal-text);
}

.rule-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.9375rem;
  color: var(--ink-muted);
}

.panel-credit {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--ink-muted);
}

.panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 32px;
  margin: 0;
}

.stack-group dt {
  margin-bottom: 6px;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.stack-group dd {
  margin: 0;
  line-height: 1.5;
}

.program-about {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 32px;
  align-items: center;
}

.about-photo {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: var(--radius-stop);
}

.about-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 33% 50%;
}

.about-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.older-work {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 16px;
  margin: 0;
  color: var(--ink-muted);
}

.older-work a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: var(--ink);
}

.contact-mail {
  margin: 0;
  font-size: clamp(1.75rem, 4.5vw, 3.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
}

.contact-mail a {
  text-decoration-thickness: 3px;
  text-underline-offset: 6px;
}

@media (max-width: 900px) {
  .stage-row,
  .stack-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .program-about {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 480px) {
  .stage-row,
  .stack-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

The About photo crops the wide wall photo to a portrait frame with `object-position: 33% 50%`, where the person stands. Open the page and adjust the first value if the person is not centered in the frame.

- [ ] **Step 4: Import the stylesheet**

In `src/main.ts`, add after `import './styles/work.css'`:

```ts
import './styles/sections.css'
```

- [ ] **Step 4b: Remove the kicker style and plain-language strip**

The owner removed kickers after the design critique (the craft floor bans an eyebrow label above a heading). Delete the whole `.kicker { ... }` rule from `src/styles/base.css`; nothing uses it any more. Then confirm no markup still uses it:

```bash
grep -rn 'kicker' index.html src || echo NO_KICKER
```

Expected: `NO_KICKER`.

In `index.html`, change the strip's middle span from `<span class="status-cycle">Pick · Gate · Review · Stop</span>` to `<span class="status-cycle">Software Engineer</span>`.

- [ ] **Step 5: Check everything**

```bash
pnpm lint && pnpm format:check && pnpm test && pnpm build
grep -o 'src="[^"]*my_pic[^"]*"' dist/index.html
```

Expected: all pass, grep prints `src="/portfolio/img/my_pic.jpg"`.

- [ ] **Step 6: Commit**

```bash
git add index.html src/styles/sections.css src/main.ts
git commit -m "feat(home): add loops, agents, stack, about and contact programs"
```

---

### Task 11: Loop engineering write-up page

**Depends on:** Task 6

**Files:**
- Create: `writing/loop-engineering.html`
- Create: `src/article.ts`
- Create: `src/styles/article.css`
- Modify: `vite.config.ts` (add the `loops` input)

**Interfaces:**
- Consumes: `tokens.css`, `base.css`, `shell.css` from Task 6.
- Produces: `/portfolio/writing/loop-engineering.html`. `src/article.ts` and `src/styles/article.css`, reused by Task 12.

**Rules:**
- PRODUCT.md "The research doc quotes other people. Credit those quotes, do not present them as Panatakorn's words." · example: every quote below carries its author in a `<cite>`.
- PRODUCT.md "Raw skill files are not published, because they mention workplace names and paths." · example: the page shows only `loop.md` and the STATE.md template, which name no workplace.

**Browser check:**
- Preconditions: `pnpm dev` running, port 5173.
- Base URL: `http://localhost:5173/portfolio/`

| # | Action | Expected |
|---|---|---|
| 1 | On Home, click "LOOPS" then "Read the write-up" | Page "Loop engineering" opens at `/portfolio/writing/loop-engineering.html` on the same faceplate background |
| 2 | Scroll the article | Sections "The problem", "The idea", "How mine works", "What it changed", "What stays with me", "Credits", in that order; two code blocks |
| 3 | Look at each quote | Each quote shows its author's name under it |
| 4 | Click "Back to the dial" in the bottom strip | Returns to Home |
| 5 | Resize to 390×844 | Text fits the width; code blocks scroll sideways inside their box, the page does not |

- [ ] **Step 1: Read the craft floor**

Read `/Users/yummamuang/.claude/skills/impeccable/reference/craft-floor.md` first.

- [ ] **Step 2: Write `src/article.ts`**

```ts
import '@fontsource-variable/archivo'
import './styles/tokens.css'
import './styles/base.css'
import './styles/shell.css'
import './styles/article.css'
```

- [ ] **Step 3: Write `src/styles/article.css`**

```css
.article {
  width: min(100%, 72ch);
  margin: 0 auto;
  padding: clamp(32px, 6vw, 72px) 20px 96px;
  font-size: 1.125rem;
  line-height: 1.65;
}

.article h1 {
  margin: 0 0 16px;
  overflow-wrap: anywhere;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.035em;
}

.article .dek {
  margin: 0 0 48px;
  font-size: 1.3125rem;
  line-height: 1.45;
  color: var(--ink-muted);
}

.article h2 {
  margin: 56px 0 12px;
  font-size: 1.625rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.article p,
.article ul,
.article ol {
  margin: 0 0 18px;
}

.article li + li {
  margin-top: 6px;
}

.article pre {
  margin: 0 0 24px;
  padding: 18px 20px;
  overflow-x: auto;
  background: var(--strip);
  color: var(--strip-text);
  border-radius: var(--radius-stop);
  font-size: 0.875rem;
  line-height: 1.55;
}

.article code {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 0.9em;
}

.article blockquote {
  margin: 0 0 24px;
  padding: 16px 20px;
  background: var(--display);
  border: 1px solid var(--rule);
  border-radius: var(--radius-stop);
}

.article blockquote p {
  margin: 0 0 6px;
  font-size: 1.25rem;
  font-weight: 600;
}

.article cite {
  font-size: 0.9375rem;
  font-style: normal;
  color: var(--ink-muted);
}

@media (max-width: 640px) {
  .article {
    padding: 40px 16px 72px;
    font-size: 1.0625rem;
  }

  .article pre {
    margin-inline: -16px;
    border-radius: 0;
  }
}

.article-strip a {
  color: var(--strip-text);
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

- [ ] **Step 4: Write `writing/loop-engineering.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Loop engineering · Panatakorn Supak</title>
    <meta
      name="description"
      content="How Panatakorn Supak designs loops that prompt coding agents: a gate, a stop rule and state outside the chat."
    />
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
    <div class="housing">
      <div class="plate">
        <header class="plate-header">
          <p class="maker">
            <a class="maker-mark" href="../">YM.</a>
            <span class="maker-name">Panatakorn Supak</span>
            <span class="maker-role">Software Engineer</span>
          </p>
          <div class="plate-links">
            <a href="mailto:oak.ptkn@gmail.com">oak.ptkn@gmail.com</a>
            <a href="https://github.com/Yummamuang">GitHub</a>
          </div>
        </header>
        <main class="article">
          <h1>Loop engineering</h1>
          <p class="dek">
            Designing the system that prompts a coding agent, instead of prompting it turn by turn.
          </p>

          <h2>The problem</h2>
          <p>
            Prompting an agent one turn at a time makes me the loop. I decide what comes next, I
            check every result, and I decide when the work is done. The agent is fast; the loop
            around it is me, and my checking gets sloppy long before the agent gets tired.
          </p>

          <h2>The idea</h2>
          <p>A loop has four parts:</p>
          <ol>
            <li><strong>Goal</strong>, checked on every pass, with a stop condition you can prove.</li>
            <li><strong>Action</strong>, the agent works toward the goal from where it is now.</li>
            <li><strong>Observation</strong>, the system measures the result: tests, lint, build, diff.</li>
            <li><strong>Adjustment</strong>, the feedback shapes the next pass.</li>
          </ol>
          <p>
            The verifier sets the quality of the loop, not the model. A weak verifier lets a loop
            converge on a wrong answer with full confidence. So I order verifiers by how far I can
            trust them: deterministic checks first (exit codes, tests, lint, typecheck, a clean
            build), then a separate agent judging against a rubric, and a human for anything that
            cannot be undone. The agent that wrote the code never grades it.
          </p>

          <h2>How mine works</h2>
          <p>
            <strong>One item per pass.</strong> A bare <code>/loop</code> in Claude Code reads this
            prompt. It picks exactly one thing and has rules that close the usual escape hatches.
          </p>
          <pre><code>Work the current branch. Pick exactly ONE thing, in this order:

1. If `work-memory/STATE.md` exists and has an item marked `next`, do that item.
2. If the gate is red (`.claude/gate.sh`, or lint/format on changed files), fix it.
3. If the branch has a PR with failing CI or unresolved review comments,
   address the oldest one.
4. Otherwise say "nothing pending" in one line and stop the loop.

Rules:
- One logical change per iteration. Never batch unrelated fixes.
- Never modify a test to make it pass. Fix the code.
- Do not commit or push unless STATE.md or the user explicitly asked for it.
- If the same item fails twice in a row, stop and report what is blocking.
- Update STATE.md before you finish the iteration.</code></pre>
          <p>
            <strong>State outside the chat.</strong> Work that spans sessions lives in a
            <code>STATE.md</code> file, not in the conversation. Every session reads it first and
            updates it last.
          </p>
          <pre><code># STATE
Goal: &lt;the goal for this round&gt;

## Done
- [x] ...

## Next
- [ ] `next` &lt;the one item to do next&gt;

## Blocked
- &lt;what is stuck and what it needs from a person&gt;

## Learned
- &lt;an error already hit, and its fix&gt;</code></pre>
          <p>
            <strong>A gate the agent cannot talk past.</strong> A Stop hook runs whenever the agent
            tries to end a turn with code changes. It skips turns that touched only docs or config.
            Otherwise it runs the repository's own gate script, or a default one scoped to the
            files the turn touched: ESLint, Prettier, and <code>vitest run</code> on each changed
            file's colocated test. When a task finishes, a fuller pass also runs the matching .NET
            test class. If the gate is red, the hook blocks the turn and hands back the last lines
            of output, so the agent has to fix the cause before it can stop.
          </p>
          <p>
            <strong>Stop rules.</strong> A loop without a stop is an open invoice. Mine stops when
            nothing is pending, takes one change per pass, and stops to report when the same item
            fails twice in a row. I also built a fully unattended outer loop with an iteration cap,
            a no-progress check and a spend cap, then set it aside: I keep a person at the start of
            every loop.
          </p>

          <h2>What it changed</h2>
          <p>
            An agent no longer ends a turn on a red gate: the hook sends it back with the failing
            output. Work that spans several sessions picks up from <code>STATE.md</code> instead of
            from whatever I remember. Each pass is one reviewable change.
          </p>

          <h2>What stays with me</h2>
          <p>
            The inner loop, investigate, implement, verify, repeat, is delegated. The outer loop,
            deciding to ship or block and owning the result, is not.
          </p>
          <blockquote>
            <p>Delegating the inner loop is leverage; delegating the outer loop is abdication.</p>
            <cite>Addy Osmani</cite>
          </blockquote>

          <h2>Credits</h2>
          <blockquote>
            <p>
              You shouldn't be prompting coding agents anymore. You should be designing loops that
              prompt your agents.
            </p>
            <cite>Peter Steinberger</cite>
          </blockquote>
          <blockquote>
            <p>
              I don't prompt Claude anymore. I have loops that are running. They're the ones that
              are prompting Claude... My job is to write loops.
            </p>
            <cite>Boris Cherny, creator of Claude Code</cite>
          </blockquote>
          <p>
            The goal, action, observation and adjustment framing comes from IBM. Reading state from
            disk between passes, instead of from a long chat history, comes from Geoff Huntley's
            "Ralph" loop.
          </p>
        </main>
        <footer class="status-strip article-strip">
          <span>Write-up · Loop engineering</span>
          <a href="../">Back to the dial</a>
        </footer>
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 5: Add the page to the Vite inputs**

In `vite.config.ts`, change the `input` object to:

```ts
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        loops: resolve(import.meta.dirname, 'writing/loop-engineering.html'),
      },
```

- [ ] **Step 6: Build and check the page ships**

```bash
pnpm lint && pnpm format:check && pnpm build
test -f dist/writing/loop-engineering.html && echo PAGE_OK
grep -o 'href="/portfolio/assets/[^"]*\.css"' dist/writing/loop-engineering.html
```

Expected: `PAGE_OK` and one stylesheet URL under `/portfolio/assets/`.

- [ ] **Step 7: Commit**

```bash
git add writing/loop-engineering.html src/article.ts src/styles/article.css vite.config.ts
git commit -m "feat(writing): add loop engineering write-up"
```

---

### Task 12: Agent workflow write-up page

**Depends on:** Task 11

**Files:**
- Create: `writing/agent-workflow.html`
- Modify: `vite.config.ts` (add the `agents` input)

**Interfaces:**
- Consumes: `src/article.ts` and `src/styles/article.css` from Task 11.
- Produces: `/portfolio/writing/agent-workflow.html`.

**Rules:**
- PRODUCT.md "Present them as customized versions and credit superpowers. Do not claim them as written from scratch." · example: the Credits section names superpowers and links to it.
- PRODUCT.md "Raw skill files are not published" · example: the page describes the workflow and quotes no skill file.

**Browser check:**
- Preconditions: `pnpm dev` running, port 5173.
- Base URL: `http://localhost:5173/portfolio/`

| # | Action | Expected |
|---|---|---|
| 1 | On Home, click "AGENTS" then "Read the write-up" | Page "Plan first, then one subagent per task" opens at `/portfolio/writing/agent-workflow.html` |
| 2 | Scroll to "Credits" | Text says both skills started from the open-source superpowers plugin, with a working link to its GitHub repository |
| 3 | Click "Back to the dial" | Returns to Home |

- [ ] **Step 1: Confirm the superpowers repository URL**

```bash
gh api repos/obra/superpowers --jq .html_url
```

Expected: `https://github.com/obra/superpowers`. If the call fails or prints another URL, use the URL it prints, or ask the user for the correct one before writing Step 2.

- [ ] **Step 2: Write `writing/agent-workflow.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Agent workflow · Panatakorn Supak</title>
    <meta
      name="description"
      content="How Panatakorn Supak ships with coding agents: a written plan, one subagent per task, and a review after every step."
    />
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
    <div class="housing">
      <div class="plate">
        <header class="plate-header">
          <p class="maker">
            <a class="maker-mark" href="../">YM.</a>
            <span class="maker-name">Panatakorn Supak</span>
            <span class="maker-role">Software Engineer</span>
          </p>
          <div class="plate-links">
            <a href="mailto:oak.ptkn@gmail.com">oak.ptkn@gmail.com</a>
            <a href="https://github.com/Yummamuang">GitHub</a>
          </div>
        </header>
        <main class="article">
          <h1>Plan first, then one subagent per task</h1>
          <p class="dek">
            How I ship with coding agents: a written plan, a fresh subagent for each task, and a
            review after every step.
          </p>

          <h2>The problem</h2>
          <p>
            One long agent session piles up context. It drifts from the plan, forgets early
            decisions, and ends up grading its own work.
          </p>

          <h2>1. Write the plan</h2>
          <p>
            The plan is written for an engineer who knows nothing about the codebase. Every task
            lists:
          </p>
          <ul>
            <li>the files it creates or changes, shared files included, so tasks that would collide never run together;</li>
            <li>the names and types it uses from earlier tasks and hands to later ones;</li>
            <li>the business rules it must keep, quoted word for word from the ticket, each marked as a property that must hold for every input or as boundary examples;</li>
            <li>its test file, next to the file it covers;</li>
            <li>for anything a user can see, browser steps with an observable result for each.</li>
          </ul>
          <p>
            The plan ends with a short summary and an end-to-end demo flow. The rules are approved
            before any code is written.
          </p>

          <h2>2. One subagent per task</h2>
          <p>
            Each task goes to a fresh subagent that sees only its own brief, not the whole
            conversation. Tasks that do not depend on each other and touch no shared file run at
            the same time, in waves worked out from the plan's dependencies.
          </p>

          <h2>3. Review every task</h2>
          <p>
            After each task a separate reviewer checks it against the spec and for code quality.
            When the task changed something a user can see, a browser test follows the plan's steps
            in a real browser.
          </p>

          <h2>4. Review the whole branch</h2>
          <p>One broad review of the whole branch runs at the end, before anything ships.</p>

          <h2>Why it works</h2>
          <p>
            The agent that writes the code is never the one that approves it. Each subagent starts
            clean, so context from one task cannot leak into the next. And the rules a test must
            prove are agreed with a person before the first line of code.
          </p>

          <h2>Credits</h2>
          <p>
            Both skills, <code>writing-plans</code> and <code>subagent-driven-development</code>,
            started from the open-source
            <a href="https://github.com/obra/superpowers">superpowers</a> plugin. I customized them
            with dependency-based parallel waves, rules quoted from the ticket, test gates scoped to
            the files a task touches, browser checks and a demo flow.
          </p>
        </main>
        <footer class="status-strip article-strip">
          <span>Write-up · Agent workflow</span>
          <a href="../">Back to the dial</a>
        </footer>
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 3: Add the page to the Vite inputs**

In `vite.config.ts`, change the `input` object to:

```ts
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        loops: resolve(import.meta.dirname, 'writing/loop-engineering.html'),
        agents: resolve(import.meta.dirname, 'writing/agent-workflow.html'),
      },
```

- [ ] **Step 4: Build and check the page ships**

```bash
pnpm lint && pnpm format:check && pnpm build
test -f dist/writing/agent-workflow.html && echo PAGE_OK
```

Expected: `PAGE_OK`.

- [ ] **Step 5: Commit**

```bash
git add writing/agent-workflow.html vite.config.ts
git commit -m "feat(writing): add agent workflow write-up"
```

---

### Task 13: Finish review and design documentation

**Depends on:** Task 3, Task 10, Task 12

**Files:**
- Create: `.impeccable/review/desktop.png`, `.impeccable/review/mobile.png`
- Modify: `DESIGN.md` (replaced by the documenter)
- Modify: `.impeccable/design.json` (replaced by the documenter)
- Modify: `PRODUCT.md` (section "Stack" and the "AI-engineering work" bullet)
- Modify: `CLAUDE.md` (section "Layout")
- Modify: any source file the finish reviewer's fixes touch

**Interfaces:**
- Consumes: the finished site, the surface brief from Task 5, the Demo flow below.

**Run this task in the orchestrating session, never dispatched to an implementer.** It spawns agents and drives a browser. Take screenshots with `hawk` (Playwright MCP) or the session's own browser tool.

- [ ] **Step 1: Run the design detector once**

```bash
/Users/yummamuang/.claude/skills/impeccable/scripts/impeccable detect --json index.html src writing
```

Fix every finding that is mechanical (a contrast value, a missing focus style, a banned pattern with an obvious replacement). Keep the rest for the reviewer packet.

- [ ] **Step 2: Capture the build**

Run `pnpm build && pnpm preview` (port 4173). With the Playwright MCP browser, disable motion first (emulate `prefers-reduced-motion: reduce`) so no entrance motion hides content, then capture from the top of the document:
- `.impeccable/review/desktop.png`: `http://localhost:4173/portfolio/` at 1440 wide, full page.
- `.impeccable/review/mobile.png`: same URL at 390 wide, full page.

Open both files and confirm each shows the whole page with no blank or half-loaded region before going on.

- [ ] **Step 3: Spawn the finish reviewer**

Spawn `impeccable-finish-reviewer` fresh, with no conversation history, and give it: the original request ("redesign Home as the Program Dial with projects first, migrate to Vite, deploy with GitHub Actions"), the confirmed answers (Canine leads; full write-up pages; old pages kept and linked; portrait from `img/bg.png`), artifact paths `index.html`, `writing/loop-engineering.html`, `writing/agent-workflow.html`, both screenshot paths as required, the direction contract from `impeccable surface-brief read index.html`, the detector output from Step 1, the craft floor path `/Users/yummamuang/.claude/skills/impeccable/reference/craft-floor.md`, and the critique reference: the "Program Dial · projects first" artboard of `https://claude.ai/artifact/BBFYggGcGY9Bybu5VLXU83`, named as a code-led critique reference, not an approved comp.

Act on its disposition word: `recapture` → recapture and review again; `rebuild` → rebuild the named regions and review again; `fix` → apply the listed fixes in one batch, recapture the same files, send them back for a verdict; `ship` → continue. Two fix rounds at most, then put any open items in front of the user.

- [ ] **Step 4: Check provenance of shipping images**

```bash
/Users/yummamuang/.claude/skills/impeccable/scripts/impeccable embed-prompt --scan public/img/portrait.webp public/img/posters public/img/my_pic.jpg public/img/manga-direct.png public/img/gymmanagementsystem.png public/img/dataengineering.jpg public/img/snakegame.jpg
```

Scan only the rasters Home ships; archive-only images stay untouched. For each file it reports, embed its origin as the command instructs. `portrait.webp` comes from `public/img/bg.png`; the posters are frames of `public/video/canine.mp4` and `public/video/catspace.mp4`; the rest are the owner's existing project screenshots and photos.

- [ ] **Step 5: Spawn the documenter**

Spawn `impeccable-documenter` with the project root `/Users/yummamuang/Workspace/projects/portfolio`, the artifact path `index.html`, the direction contract, `PRODUCT.md`, `/Users/yummamuang/.claude/skills/impeccable/reference/document.md`, and the write boundary `DESIGN.md` and `.impeccable/design.json` only. Confirm both files were rewritten with tokens in the frontmatter and the sidecar.

- [ ] **Step 6: Update `PRODUCT.md` and `CLAUDE.md`**

In `PRODUCT.md`, replace the whole `## Stack` section body with:

```markdown
Vite with vanilla TypeScript, built and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. The old static site is kept unchanged in `public/`.
```

In `PRODUCT.md`, replace the line starting `- The AI-engineering work is published as write-up pages on the site:` with:

```markdown
- The AI-engineering work is published as write-up pages: `writing/loop-engineering.html` and `writing/agent-workflow.html`. Raw skill files are not published, because they mention workplace names and paths. A cleaned public repo may come later and would be linked from the write-ups.
```

In `CLAUDE.md`, replace the whole `## Layout` section with:

```markdown
## Layout

- `index.html` is the Home page: header plate, the program dial (`#dial`), six program sections (`#work`, `#loops`, `#agents`, `#stack`, `#about`, `#contact`) and the status strip.
- `writing/*.html` are the write-up pages. Each new HTML page must be added to `build.rollupOptions.input` in `vite.config.ts`, or it is not built.
- `src/main.ts` wires the Home page; `src/article.ts` loads the write-up styles.
- `src/dial/`: `dial-model.ts` pure stop math, `dial.ts` knob and labels, `scroll-spy.ts` current section. `src/work/`: project data and the Work panel. Tests sit next to the file they cover.
- `src/styles/`: `tokens.css` design tokens, then one stylesheet per area.
- `public/` holds the old site unchanged: `pages/` (old Home, Lab, Project, About and the archived sub-sites), `css/`, `js/`, `img/`, `video/`, `font/`. Reference public files as `/img/...` in HTML and as `` `${import.meta.env.BASE_URL}img/...` `` in TypeScript.
- `public/pages/project/WebDesign-SpaceCat/` and `public/pages/lab/lab5/`, `lab7/` are archived work. Do not edit them.
```

Also remove the bullet in `CLAUDE.md` "Conventions" that says "No framework, no bundler. Vanilla JS with globals and inline `onclick` handlers, matching the existing files." and replace it with "Vanilla TypeScript modules, no UI framework. The archived pages in `public/` keep their old globals and inline handlers."

- [ ] **Step 7: Final checks**

```bash
pnpm lint && pnpm format:check && pnpm test && pnpm build
git diff --stat main...HEAD -- public/pages/project/WebDesign-SpaceCat public/pages/lab/lab5 public/pages/lab/lab7 | grep -v '=>' | grep -v 'files changed' | head
git status --short -- public/pages/project/WebDesign-SpaceCat public/pages/lab/lab5 public/pages/lab/lab7
```

Expected: checks pass, and both git commands print nothing: the archived sub-sites were only moved, never edited.

- [ ] **Step 8: Commit**

```bash
git add DESIGN.md .impeccable/design.json .impeccable/review/desktop.png .impeccable/review/mobile.png PRODUCT.md CLAUDE.md
git commit -m "docs(design): document the program dial system"
```

If the reviewer's fixes changed source files, commit them separately first with `fix(home): <what changed>` and only the files they touched.

---

## Demo flow

- Role: a recruiter screening for a Software Engineer role.
- Preconditions: `pnpm build && pnpm preview` running on port 4173. Window 1440×900.
- Starts at: `http://localhost:4173/portfolio/`

### 1. See who this is and one real project

| # | Action | Expected |
|---|---|---|
| 1 | Open the start URL | Header shows "Panatakorn Supak" and "Software Engineer"; the portrait is visible; the card shows "Impacted canine assessment" with its video |
| 2 | Click "Next project" twice | Card shows "Cat Space shop" with "Open the site" |
| 3 | Click "Open the site" | The archived Cat Space shop opens with its images loaded |

### 2. Move through the programs with the dial

| # | Action | Expected |
|---|---|---|
| 1 | Back on Home, drag the knob to the STACK label and release | Pointer settles on STACK; the page shows the Stack groups; the strip reads "Program 4 / 6 · Stack" |
| 2 | Press ArrowLeft twice on the knob | Pointer on LOOPS; page at "Loop engineering" |

### 3. Read how the work gets done

| # | Action | Expected |
|---|---|---|
| 1 | Click "Read the write-up" in Loops | The loop engineering article opens; quotes carry their authors |
| 2 | Click "Back to the dial", then "AGENTS", then "Read the write-up" | The agent workflow article opens with the superpowers credit |

### 4. Get in touch

| # | Action | Expected |
|---|---|---|
| 1 | Click "Back to the dial", then "CONTACT" | Large "oak.ptkn@gmail.com" link |
| 2 | Click the email link | A mail draft to oak.ptkn@gmail.com opens |
