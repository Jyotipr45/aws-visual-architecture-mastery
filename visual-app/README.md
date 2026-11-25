# 🎬 visual-app: the interactive AWS learning app

The interactive, animated part of **AWS Visual Architecture Mastery**, built with **React + TypeScript + Tailwind CSS + Framer Motion**.

▶️ **Live:** https://jyotipr45.github.io/aws-visual-architecture-mastery/visual-app/

## What's inside

| Feature | What it does |
|---|---|
| 🎞️ **Cloud Evolution Timeline** | 5 eras (bare-metal → virtualization → cloud → containers → serverless), each with an animated diagram |
| 👣 **Step-by-step walkthrough** | Every era is broken into small steps that highlight exactly which boxes and arrows matter |
| 🔵 **Animated packets** | Glowing dots travel along each connection in order, using spring and easing physics |
| 🔍 **Detail inspector** | Click any box, badge, arrow or era: plain-English explanation, real-world analogy, aliases, FoodDash role, exact connection rules (protocol, port, direction), advanced notes, ARNs and common mistakes |
| 📖 **Lesson 0.1** | The full lesson inside the app: story, 17-term glossary with filter, interactive capacity planner, lab commands with copy buttons, what-if cards, cleanup checklist |
| 🌗 **Light / Dark / System theme** | Follows `prefers-color-scheme` when set to System and remembers your choice |
| 🔎 **Zoom, pan and Fit** | Zoom up to 300%, drag to pan, `Ctrl` + scroll to zoom, ⤢ Fit to return to the full diagram |
| ⌨️ **Keyboard** | `←` `→` steps · `Shift` + `←` `→` eras · `Space` play/pause · `Esc` closes details |

## Run it on your computer

You need **Node.js 20 or newer** (`node -v` to check).

```bash
cd visual-app
npm install      # downloads React, Vite, Tailwind, Framer Motion (about 40 packages)
npm run dev      # starts a local dev server, usually http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Type-checks with TypeScript, then builds an optimized site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder locally so you can test the production build |
| `npm run typecheck` | Only runs the TypeScript checks |

## How the code is organized

| File | Job |
|---|---|
| `src/types.ts` | TypeScript shapes for concepts, nodes, connections, steps and eras |
| `src/concepts.ts` | **All the teaching content**: every box, arrow and era explained in full |
| `src/eras.ts` | Diagram layout (positions on a 1000 × 520 grid), connections and walkthrough steps per era |
| `src/lesson01.ts` | Lesson 0.1 content, mirrored from the Markdown lesson |
| `src/Diagram.tsx` | The animated SVG: nodes, arrows, travelling packets, zoom and pan |
| `src/DetailPanel.tsx` | The detail inspector (side panel on desktop, slide-up sheet on mobile) |
| `src/LessonView.tsx` | The interactive lesson page |
| `src/App.tsx` | Layout, era bar, controls, walkthrough and keyboard shortcuts |
| `src/theme.tsx` | Light / Dark / System theme logic and switcher |
| `src/tones.ts` | Colour sets that work in both themes |

**Adding a new era or lesson** means adding data to `concepts.ts` and `eras.ts`. The components draw whatever the data describes.

## How it's deployed

On every push to `main`, the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`:
1. installs dependencies and runs `npm run build` here,
2. builds the rest of the repo (Markdown lessons, legacy HTML animations) with Jekyll,
3. places this app's `dist/` at `/visual-app/` on the site,
4. deploys everything to GitHub Pages.

`vite.config.ts` uses `base: "./"`, so the built app works from any sub-folder.

> 📝 Dependency versions are pinned exactly in `package.json`, so `npm install` always fetches the same versions.
