# Seven Sins Placement Quiz — Build Plan

Party: **Thursday, December 18, 2026** · Plan written: 2026-11-22 · Source brainstorm: `personality test .pdf`

## 1. Locked decisions (from interview)

| Area | Decision |
|---|---|
| Format | 16personalities-style statements on a 7-point Disagree ↔ Agree scale (circles that get bigger toward the ends) |
| Length | **63 statements**: 3 per (placement × sin) cell, plus tiebreakers shown only when sins tie (≈ 9–12 min) |
| Tone | Playful / party, with plenty of pop-culture references |
| Placements | ☀️ **Sun** = what you *do* (habits, behavior) · 🌙 **Moon** = what you privately want or fear · ⬆️ **Rising** = how others *read* you (first impression/vibe) |
| Sun vs Rising separation | Sun items are first-person behavior ("I'm the one who…"); Rising items are perception-framed ("People assume I'm…", "Strangers usually…") |
| Results | Modular: 21 placement write-ups, 49 Sun–Moon "central contradiction" lines, and a generated 343-way title (Rising adjective + Sun–Moon identity) |
| Extras | Growth tips · Compatibility · Shareable result card · Birth-order modifier · Pop-culture figures |
| Pop-culture figures | 21 sets (sin × placement), a mix of fictional characters and real celebrities, kept affectionate |
| Question UI | One statement per screen, Sun/Moon/Rising shuffled together, auto-advance on tap, back button, progress bar |
| Visual | Night-sky editorial: deep ink background, warm off-white serif headings, one accent per sin, fine-line celestial ornaments |
| Social | Live party wall (Firebase Firestore, realtime, TV view). Compare-via-link as a fallback that is always available |
| Guest identity | First name / nickname only |
| Personalization | Birthday framing ("Heline's …") plus inside jokes supplied by the host |
| Hosting | GitHub Pages (static) + Firebase free tier for the wall |

## 2. Canonical content model (resolves contradictions in the brainstorm)

- **One emoji per sin**, used everywhere: 👑 Pride · 💰 Greed · ❤️ Lust · 👀 Envy · 🔥 Wrath · 🍰 Gluttony · 😴 Sloth (the PDF's first set; drop ⚔️/🌌/💎/🌿).
- **Naming:** `The {Rising adjective} {Sun–Moon identity}`, for example "The Velvet General". It uses the PDF's 49 Sun–Moon identities (Sovereign, General, Pretender, …), with duplicates fixed: "Collector" and "Flame" each appear twice. Seven Rising adjectives are rewritten for the *first-impression* meaning, e.g. Pride→Gilded, Lust→Velvet, Sloth→Drowsy.
- **Not used:** the "Energy Modifier (Knight/Oracle/Trickster)", which the brainstorm never defines.
- **Birth order** (oldest / middle / youngest / only): one optional question at the end. It adds a single flavor line keyed to the Sun sin, 28 lines in total.

## 3. Scoring

1. Answers map to −3…+3. A few reverse-worded items are inverted before scoring.
2. Each placement's score for a sin is the mean of its 3 items. The top sin in each placement wins it.
3. **Ties:** simulation shows that with 3 items per cell, about 18% of placements end in a tie for the top spot. When that happens, the quiz asks a forced-choice tiebreaker that offers only the tied sins ("Which sounds more like you?"). There is one tiebreaker prompt per placement, and its answer options are drawn per sin. If a tie still remains, the stronger single "strongly agree" answer decides it.
4. Results show each placement as bars of percent strength across all 7 sins, like the 16p trait bars. These use the person's answers centered on their own average, so someone who agrees with everything still sees a spread.
5. **Result code:** Sun, Moon and Rising plus birth order are encoded as a short code (e.g. `PEW-y`). It is used in the share URL (`#/r/PEW-y`), the compare links and the wall records.
6. **Compatibility:** 50% Moon×Moon, 30% Sun×Sun, 20% Rising×Rising, using 7×7 symmetric matrices derived from the PDF's best/hard-match tables.

## 4. Architecture

- **Stack:** Vite + Preact + TypeScript, plain CSS with tokens, no UI kit (avoids the template look). Hash routing so GitHub Pages works.
- **Routes:**
  - `#/`: intro
  - `#/q`: the quiz
  - `#/r/:code`: result
  - `#/c/:codeA/:codeB`: compare
  - `#/wall/:party`: TV wall
- **Content:** typed TS modules under `src/content/` (sins, statements, tiebreakers, placements, contradictions, names, growth, compatibility, figures, birthOrder, jokes). Content agents write only these files, against fixed types.
- **State:** answers kept in `localStorage`, so a phone that locks mid-quiz picks up where it left off.
- **Share card:** drawn on a 1080×1920 canvas, exported as PNG through the Web Share API, with a download fallback.
- **Firestore:** `parties/{partyId}/results/{autoId}` = `{name, code, createdAt}`.
  - Rules: create-only, schema validation, name 1–24 characters, no update or delete, reads limited to that party.
  - The wall listens with `onSnapshot` and shows a live grid of names and titles, sin distribution, the rarest combo, the group's dominant sin, and "most compatible pair".
- **Deploy:** a GitHub Action builds to Pages. A printable QR code page (`#/qr`) is included.

## 5. Execution: subagent breakdown

**Phase 0: Foundation (me, sequential).** `git init`, scaffold Vite, content **types and schemas**, scoring engine + unit tests (including the tie simulation), routing skeleton. This fixes the contracts so the agents below can work in parallel.

**Phase 1: Parallel build (5 agents, run concurrently).**

| Agent | Scope | Output |
|---|---|---|
| A. Statement writer | 63 statements (3 per cell) plus tiebreaker options, playful with pop-culture hooks, obeying the Sun/Moon/Rising framing rules; about 15% reverse-worded; no sin named in the text | `src/content/statements.ts`, `tiebreakers.ts` |
| B. Results writer | 21 placement write-ups, 49 contradictions, 49 identities + 7 Rising adjectives (deduplicated), growth tips, 28 birth-order lines, compatibility matrices and blurbs | `placements.ts`, `contradictions.ts`, `names.ts`, `growth.ts`, `compat.ts`, `birthOrder.ts` |
| C. Pop-culture curator | 21 sets of 3–4 figures (mixed fictional and real, affectionate, widely recognizable to the group's age range), each with a one-line "why" | `figures.ts` |
| D. Frontend / design | Quiz flow, 7-circle scale, result page, compare page, share-card canvas, night-sky design system; built against placeholder content | `src/ui/**`, `src/styles/**` |
| E. Wall + infra | Firestore client and security rules, wall view, party-code handling, GitHub Pages Action, QR page | `src/wall/**`, `firestore.rules`, `.github/workflows/` |

**Phase 2: Independent verification (2 fresh agents, not shown the authors' reasoning).**
- **Blind item check:** give a reviewer the 63 statements without labels and ask it to guess the sin and placement for each. Any statement guessed wrong, or easy to confuse with another sin, gets rewritten.
- **Simulated respondents:** run about 10k synthetic answer sets plus 7 "pure-sin" personas. Confirm that every sin is reachable in every placement, that no sin dominates, that the tiebreak rate is acceptable, and that personas get their own sin.

Plus me: an end-to-end mobile pass (iOS Safari and Android Chrome sizes), accessibility checks (tap targets, contrast, reduced motion), and a Lighthouse run.

**Phase 3: Playtest and tune (with you).**

## 6. Execution model and review gates

Work runs in autonomous Claude sessions. You review only at the gates below. Between gates, sessions keep going on their own, using `npm test`, `npm run check:content`, `npm run build` and the Phase 2 verifiers as the definition of done.

| Gate | What you review | Unblocks |
|---|---|---|
| **G1: Content draft** | 63 statements + tiebreakers, title naming scheme, a sample of ~10 full results, figure sets (with blind-check and simulation reports attached) | UI wiring to real content |
| **G2: Playable build** | Live GitHub Pages URL on your phone: feel, look, length, results page, share card, compare | Party wall polish |
| **G3: Party dry-run** | Wall on a TV with a few test results, QR page, Heline's own result | Content freeze |
| **Freeze** | Done by about Dec 14, leaving buffer before **Dec 18** | |

## 7. Status

- [x] Interview complete (2026-11-22)
- [x] Phase 0: foundation (scaffold, content contracts, engine and tests, router, CI, CLAUDE.md, content brief)
- [x] Infra: Firebase `heline-bday-quiz` (Firestore + rules published from the console); GitHub `sfettes/heline-bday-party-2026` (host pushes over SSH; Claude is denied `git push` via `.claude/settings.json`)
- [x] Phase 1 done, on branches waiting for PRs:
  - `content/statements`: 63 statements + tiebreakers
  - `content/figures`: 21 figure sets
  - `content/results`: write-ups, names, contradictions, growth, compat, birth order, party copy
  - `wall/party-wall`: Firestore client, live wall, QR page, PostToWall
  - `ui/design`: design system and all screens; includes `wall/party-wall` plus the PostToWall mount, so merge it after the wall PR
- [x] Phase 2 (partial):
  - Blind item check: sin 63/63, direction 63/63, placement 61/63. 7 statements sharpened.
  - Simulated respondents: in the engine tests.
  - Full integration passes test, `check:content` and build. Headless 390px walkthrough reached a result with no horizontal scroll and no console errors; wall verified against live Firestore (`test-smoke`).
- [ ] G1: content review. G2: playable build on a real phone. G3: party dry-run. Then freeze.
- Known: the headless browser lacks an emoji font, so check sin emoji on real phones and the TV. 9 test docs sit under party `test-smoke` (delete from the console if wanted).

## 8. Open inputs from the host
- Party title is "Sinners" for now (it can change).
- Off-limits list for jokes (optional, goes in `docs/content-brief.md`).
