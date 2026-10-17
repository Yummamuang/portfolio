# Portfolio

Personal portfolio of Panatakorn Supak (GitHub: Yummamuang). Product context, audience, and evidence live in `PRODUCT.md`. Read it before design or content work.

## Stack and deploy

- Vite with vanilla TypeScript, no UI framework. pnpm, Node 22.22.2 or newer (24.15 or newer on the 24 line).
- `base` is `/portfolio/` because GitHub Pages serves the site at `https://yummamuang.github.io/portfolio/`.
- `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on every push to `main`.
- The old static site lives unchanged in `public/` and is copied into `dist/` as-is.

## Running locally

- `pnpm install`, then `pnpm dev` and open `http://localhost:5173/portfolio/`. Check the port is free first.
- `pnpm test` runs Vitest once. Never call bare `vitest`, it starts watch mode.
- `pnpm lint`, `pnpm format:check`, `pnpm build`, then `pnpm preview` at `http://localhost:4173/portfolio/` to check the production build.

## Layout

- `index.html` is the entry and duplicates `pages/home.html` with root-relative paths (`./css/...`). Pages under `pages/` use `../css/...`. Keep relative paths correct for both depths, since GitHub Pages serves from a subpath.
- `pages/home.html`, `lab.html`, `project.html`, `about.html` share the same header markup: preloader, nav, mobile menu, and `#cursor`. A change to the nav must be copied to all five files.
- `css/main.css` global, `css/responsive.css` breakpoints, `css/animate.css` animations, `css/font.css` fonts, plus one stylesheet per page (`about.css`, `project.css`, `lab.css`, `lasson.css`).
- `js/load.js` preloader and scroll lock, `js/cursor.js` custom cursor, `js/menu_mobile.js` hamburger menu, `js/butter.js` smooth scroll used by lab pages.
- `pages/project/WebDesign-SpaceCat/` is a self-contained sub-site for one project. `pages/lab/lab5/` and `lab7/` are class lab pages. Treat them as archived work, not part of the main site's design system.
- Media: `img/` thumbnails and photos, `video/` project walkthroughs, `font/` Product Sans.
- Icons come from Ionicons 7.1.0 via unpkg.

## Conventions

- No framework, no bundler. Vanilla JS with globals and inline `onclick` handlers, matching the existing files.
- New project cards follow the existing card markup in `pages/project.html` and must link to a demo, video, or repo.
- Do not invent bio, employer, or project facts. Open questions are listed in `PRODUCT.md`.
- `.DS_Store` files are untracked noise. Do not commit them.
