import type { TiebreakerSet } from './types'

/** Forced-choice tiebreakers. Only the tied sins' options are shown, so each line stands alone. */
export const TIEBREAKERS: TiebreakerSet[] = [
  {
    placement: 'sun',
    prompt: 'Tie on your Sun. On a normal Tuesday, which is more you?',
    options: {
      pride: 'I make sure people know I did it best.',
      greed: 'I find the angle that leaves me ahead.',
      lust: 'I charm whoever happens to be around.',
      envy: 'I check how I measure up to everyone else.',
      wrath: "I call it out the second something's wrong.",
      gluttony: 'I order one more of everything.',
      sloth: 'I find the couch and stay there.',
    },
  },
  {
    placement: 'moon',
    prompt: "Tie on your Moon. Late at night, what's really on your mind?",
    options: {
      pride: 'Whether people see how good I really am.',
      greed: "Whether what I've got is saved, stashed and secure.",
      lust: 'Whether someone is thinking about me right now.',
      envy: 'Why their life looks so much easier than mine.',
      wrath: 'The comeback I should have said.',
      gluttony: "What I'm going to eat, drink or do next.",
      sloth: "How to get out of tomorrow's plans.",
    },
  },
  {
    placement: 'rising',
    prompt: 'Tie on your Rising. What do strangers clock first?',
    options: {
      pride: "That I think I'm a big deal.",
      greed: "That I'm sizing up what everything is worth.",
      lust: "That I'm flirting, whether I mean to or not.",
      envy: "That I'm comparing myself to them.",
      wrath: "That I'm one comment away from a fight.",
      gluttony: "That I'm here for the snacks and the open bar.",
      sloth: "That I'd rather be napping.",
    },
  },
]
