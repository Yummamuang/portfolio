# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite with vanilla TypeScript, built and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. The old static site is kept unchanged in `public/`.

## Users

Primary: recruiters, HR, and hiring engineers screening Panatakorn Supak for a Software Engineer role. They arrive from a job application or GitHub link, skim quickly, and decide whether to reach out.

## Product Purpose

Personal portfolio of Panatakorn Supak, a Software Engineer. It exists to show real, inspectable work and make contact easy.
Success: a hiring reader understands who Panatakorn is and what they build within one visit, opens at least one project, and contacts them by email or GitHub.

Panatakorn is currently employed as a Software Engineer. The site is being refreshed to look and work better and to add newer work, not built from scratch.

## About Facts

- Current role: Software Engineer. Employer is not named on the site.
- Contact email: `oak.ptkn@gmail.com`. Replaces `Panatakorn.s@kkumail.com` everywhere.
- Background: Computer Science, Khon Kaen University.
- Work stack, taken from the day-job codebase. List the technologies only, never the client, product, or business domain:
  - Frontend: TypeScript, React, Next.js, Nx monorepo with pnpm, Mantine, Tailwind CSS, TanStack Query, React Hook Form with Zod, OpenAPI-generated clients, OIDC auth, SignalR.
  - Backend: C# and .NET 8, ASP.NET Core, Entity Framework Core, PostgreSQL, MassTransit, Quartz, OpenIddict, Clean Architecture on the legacy services.
  - Observability: Serilog, OpenTelemetry.
  - Testing: xUnit, FluentAssertions, Moq, property-based tests with CsCheck, Vitest, Testing Library, Playwright end-to-end.
  - Infra and delivery: Docker, Kubernetes, GitHub Actions.
  - AI-assisted engineering: Claude Code agent workflows and loop engineering.
- Earlier stack shown in older projects: Node.js, Laravel, Python.

## Positioning

Every project links to something real: a live demo, a recorded video walkthrough, or a public GitHub repo. The portfolio itself is hand-built and is part of the evidence of frontend skill.

## Operating Context

- Readers usually come from a link in a CV or job application and view on desktop or phone.
- Sections today: Home (intro), Lab (frontend and type experiments), Project (built work), About me (bio and contact).
- Several Lab and Project pieces are desktop-only and say so in their labels.

## Capabilities and Constraints

- Must stay deployable as static files on GitHub Pages.
- Existing pages: `index.html`, `pages/home.html`, `pages/lab.html`, `pages/project.html`, `pages/about.html`.
- Bundled sub-sites that must keep working after any migration: `pages/project/WebDesign-SpaceCat/` (Cat Space shop design, many pages) and `pages/lab/lab5/`, `pages/lab/lab7/` (class lab pages).
- `pages/about.html` still describes a KKU student and uses the old email. Rewrite it from About Facts above.
- The AI-engineering work is published as write-up pages: `writing/loop-engineering.html` and `writing/agent-workflow.html`. Raw skill files are not published, because they mention workplace names and paths. A cleaned public repo may come later and would be linked from the write-ups.

## Brand Commitments

- Name: Panatakorn Supak. Monogram "YM." (from the handle Yummamuang) is used as logo and preloader.
- GitHub handle: `Yummamuang`.

## Evidence on Hand

Projects in `pages/project.html`:
- Cat Space Shop website design, video `video/catspace.mp4`, full site in `pages/project/WebDesign-SpaceCat/`.
- Manga Recommendation website, live at https://manga-system.vercel.app/, image `img/manga-direct.png`.
- Snake game in Python, https://github.com/Yummamuang/Snake-Game-Development, image `img/snakegame.jpg`.
- Gym Management System in Laravel, https://github.com/Yummamuang/Gym-Management-System, image `img/gymmanagementsystem.png`.
- Data engineering mini project comparing view counts of the top 15 games on YouTube, Twitch, and Facebook, https://github.com/Yummamuang/Data-Engineering-Mini-Project, image `img/dataengineering.jpg`.
- Web app for detecting and assessing eruption potential of maxillary impacted canines in panoramic radiographs, https://github.com/Yummamuang/prediction-of-maxillary-impacted-canine, video `video/canine.mp4`.

Lab pieces in `pages/lab.html`: WebDesign (`video/webdesign.mp4`) and FontDesign (`video/fontdesign-1.mp4`).

New work cleared to add, from Panatakorn's own Claude Code setup:
- Skill `subagent-driven-development`: `~/.claude/skills/subagent-driven-development/`
- Skill `writing-plans`: `~/.claude/skills/writing-plans/`
- Both skills share their names and descriptions with skills in the open-source superpowers plugin, and `code-reviewer.md` says it is vendored from it. Panatakorn has customized them heavily, adding the agent team, browser testing, and review gates. Present them as customized versions and credit superpowers. Do not claim them as written from scratch.
- Loop engineering: the research and setup plan `~/.claude/docs/loop-engineering.md`, the loop prompt `~/.claude/loop.md`, and the gate and stop hooks `~/.claude/hooks/gate-default.sh`, `~/.claude/hooks/verify-stop.sh`. The research doc quotes other people. Credit those quotes, do not present them as Panatakorn's words.

Photos: `img/my_pic.jpg`, `img/my_profile_pic.jpg`, `img/bg.png`.

Absent, do not fabricate: employer name, workplace projects, client names, testimonials, metrics, awards, a CV file, LinkedIn. There is no CV or LinkedIn to link. Workplace code and business details are not publishable. Only the stack list in About Facts comes from the day job.

## Product Principles

1. Proof over claims. Every project points to a demo, video, or repo the reader can open.
2. Respect a recruiter's minute. Who, what they build, best work, and how to contact must be reachable without hunting.
3. The site is a work sample. Its own build quality, responsiveness, and performance are judged as part of the portfolio.
4. Keep it current. Newer work leads, older class work stays as supporting history.
