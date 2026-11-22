# Content brief (for every content-writing session)

Source material: `docs/brainstorm.txt` (text of the original brainstorm PDF). Use it for ideas only. **PLAN.md §1–2 overrides it** wherever they disagree.

## Audience and tone
- Birthday party for **Heline**. The party is titled **"Sinners"**. Guests are a friend group who like quizzes, are taking it on their phones, and are probably holding a drink.
- **Playful / party tone.** Witty, a bit roast-y, never mean. A result should make someone laugh and say "…okay that's so me".
- Lust is about charm, magnetism, wanting connection and attention. Keep it suggestive at most, never explicit.
- Second person ("you") in results. First person ("I…") in statements.

## Pop-culture palette (host-supplied; lean on these)
- **Film/TV:** Caesar (*Planet of the Apes*), *Dune*, *Twilight*, *The Substance*, *Smile* 1 & 2, *Obsession*, *The Hunger Games*, *The Sopranos*, *The Pitt*, *Severance*, *Succession*, *Star Wars*, *The Rehearsal* (Nathan Fielder), *Avatar: The Last Airbender*
- **Anime:** *The Apothecary Diaries*
- **Vine references** are welcome ("road work ahead", "what are those", "look at all those chickens", etc.).
- **Local:** Kitchener–Waterloo. Local political and civic figures, well-known Canadian politicians, and K-W landmarks and culture (e.g. Oktoberfest, the ION LRT, the universities, the tech scene, Waterloo Park) are all fair game.
- Real people: keep it affectionate and about their *public persona*. Nothing about appearance, health or family, and no accusations.

## Statement-writing rules (Agent A)
- 63 statements: 3 per (placement × sin). Answered on a 7-point Disagree↔Agree scale.
- **Sun** = what you *do*. First-person behaviour: "I'm the one who…", "When the group chat goes quiet, I…"
- **Moon** = what you *privately* want or fear: "Secretly, I…", "It stings more than I admit when…"
- **Rising** = how others *read* you, framed through perception: "People assume I'm…", "Strangers tend to…", "My resting face says…"
- Never name the sin, its Latin name, or an obvious synonym in the same sentence ("jealous" for Envy, "lazy" for Sloth, "angry" for Wrath).
- One idea per statement, under ~20 words, readable at a glance on a phone.
- About 15% reverse-worded (`reverse: true`): agreeing means *less* of the sin. Spread them across sins.
- Use pop-culture hooks in roughly a third of the statements. A guest who misses the reference must still be able to answer.
- Every statement should load clearly on one sin. Avoid statements that two sins would both strongly agree with. A blind reviewer will try to guess each statement's sin.
- Tiebreakers: one prompt per placement, plus one short option line per sin, all in the same voice.

## Results-writing rules (Agent B)
- 21 placement write-ups, 49 Sun–Moon contradictions, 49 identity nouns plus 7 Rising adjectives, growth tips, compatibility, and birth-order lines. Types are in `src/content/types.ts`.
- Titles read "The {Rising adjective} {identity}". Check that a sample of combinations reads well (e.g. "The Velvet General", "The Drowsy Tycoon"). Identities are nouns without "The"; adjectives must work in front of any noun.
- Growth tips are light-hearted, not therapy-speak.

## Off-limits
- Nothing about any real guest by name except Heline, and only kindly.
- (Host may add more here.)
