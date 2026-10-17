# Portfolio

Personal portfolio of Panatakorn Supak (GitHub: Yummamuang). Product context, audience, and evidence live in `PRODUCT.md`. Read it before design or content work.

## Stack and deploy

- Vite with vanilla TypeScript, no UI framework. pnpm, and Node 22.22.2+ on the 22 line, 24.15+ on the 24 line, or 26+.
- `base` is `/portfolio/` because GitHub Pages serves the site at `https://yummamuang.github.io/portfolio/`.
- `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on every push to `main`.
- The old static site lives unchanged in `public/` and is copied into `dist/` as-is.

## Running locally

- `pnpm install`, then `pnpm dev` and open `http://localhost:5173/portfolio/`. Check the port is free first.
- `pnpm test` runs Vitest once. Never call bare `vitest`, it starts watch mode.
- `pnpm lint`, `pnpm format:check`, `pnpm build`, then `pnpm preview` at `http://localhost:4173/portfolio/` to check the production build.

## Layout

- `index.html` is the Home page: header plate, the program dial (`#dial`), six program sections (`#work`, `#loops`, `#agents`, `#stack`, `#about`, `#contact`) and the status strip.
- `writing/*.html` are the write-up pages. Each new HTML page must be added to `build.rollupOptions.input` in `vite.config.ts`, or it is not built.
- `src/main.ts` wires the Home page; `src/article.ts` loads the write-up styles.
- `src/dial/`: `dial-model.ts` pure stop math, `dial.ts` knob and labels, `scroll-spy.ts` current section. `src/work/`: project data and the Work panel. `src/cursor/`: the detent ring cursor. Tests sit next to the file they cover.
- `src/styles/`: `tokens.css` design tokens, then one stylesheet per area.
- `public/` holds the old site unchanged: `pages/` (old Home, Lab, Project, About and the archived sub-sites), `css/`, `js/`, `img/`, `video/`, `font/`. Reference public files as `/img/...` in HTML and as `` `${import.meta.env.BASE_URL}img/...` `` in TypeScript.
- `public/pages/project/WebDesign-SpaceCat/` and `public/pages/lab/lab5/`, `lab7/` are archived work. Do not edit them.

## Conventions

- Vanilla TypeScript modules, no UI framework. The archived pages in `public/` keep their old globals and inline handlers.
- New project cards follow the existing card markup in `pages/project.html` and must link to a demo, video, or repo.
- Do not invent bio, employer, or project facts. Open questions are listed in `PRODUCT.md`.
- `.DS_Store` files are untracked noise. Do not commit them.
