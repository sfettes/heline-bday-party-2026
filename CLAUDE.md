# Sinners: Seven Sins placement quiz

Mobile-first birthday party quiz. You get a ☀️ Sun, 🌙 Moon and ⬆️ Rising sin from 63 Likert statements. The party is on **2026-12-18**.

- **PLAN.md**: locked decisions, architecture, workstreams, status. Read it first, and keep its Status section current.
- **docs/content-brief.md**: tone, pop-culture palette, writing rules for all content.
- **docs/brainstorm.txt**: original brainstorm (ideas only; PLAN.md wins on conflicts).

## Layout
- `src/content/types.ts`: content contracts. **Don't change them casually**; the engine and UI depend on them.
- `src/content/*.ts`: data modules. Placeholders are marked with `TODO:` via `todo()`.
- `src/engine/`: pure logic: scoring, tiebreaks, session state machine, result codes, titles, compatibility. Fully unit-tested.
- `src/ui/`: Preact screens and components. `src/styles/`: design tokens and CSS.
- `src/wall/`: Firebase/Firestore party wall. `firestore.rules`: security rules.
- `src/router.ts`: hash routes (`#/`, `#/q`, `#/r/:code`, `#/c/:a/:b`, `#/wall/:party`, `#/qr`).

## Commands
- `npm run dev` (dev server), `npm run build` (typecheck + build), `npm test` (unit + content-structure tests)
- `npm run check:content`: also fails on leftover `TODO:` placeholders. Must pass before the content is reviewed.

## Rules
- Before finishing any change, run `npm test` and `npm run build`. Both must pass.
- Canonical sin emoji and letters live in `src/content/sins.ts`. Never use other emoji for sins.
- Result codes look like `PEW-y` (Sun, Moon, Rising letters, plus optional birth order). They are stable public URLs, so don't change the alphabet.
- Browser storage access must stay wrapped in try/catch (`src/storage.ts`).
- Design: night-sky editorial. No UI kits, no generic gradients-and-emoji "AI" look. Must work at 360px wide with a 16px gutter and no horizontal scroll.
- Commit with clear messages. CI deploys `main` to GitHub Pages automatically.
