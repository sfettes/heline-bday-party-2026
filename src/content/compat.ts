import { SIN_IDS, type CompatContent, type CompatMatrix, type PairKey, type Placement, type SinId } from './types'

/**
 * Compatibility matrices derived from the brainstorm's best/hard-match tables.
 * Scale: best ≈ .8–.95 (mutual picks score highest), neutral ≈ .45–.65,
 * hard ≈ .2–.35. Where the tables disagree (one sin's "best" is the other's
 * "hard"), the pair lands in the middle.
 *
 * Each matrix is written as the upper triangle (sorted pairs, SIN_IDS order)
 * and mirrored, so it is symmetric by construction.
 */
type Upper = Partial<Record<PairKey, number>>

function build(placement: Placement, upper: Upper, notes: CompatMatrix['notes']): CompatMatrix {
  const scores = Object.fromEntries(SIN_IDS.map((a) => [a, {}])) as Record<SinId, Record<SinId, number>>
  SIN_IDS.forEach((a, i) =>
    SIN_IDS.slice(i).forEach((b) => {
      const v = upper[`${a}:${b}`]
      if (v === undefined) throw new Error(`compat ${placement}: missing ${a}:${b}`)
      scores[a][b] = v
      scores[b][a] = v
    }),
  )
  return { placement, scores, notes }
}

// ☀️ Sun × Sun: how you get along day to day.
const sun = build(
  'sun',
  {
    'pride:pride': 0.3, 'pride:greed': 0.9, 'pride:lust': 0.92, 'pride:envy': 0.3, 'pride:wrath': 0.8, 'pride:gluttony': 0.55, 'pride:sloth': 0.9,
    'greed:greed': 0.3, 'greed:lust': 0.5, 'greed:envy': 0.88, 'greed:wrath': 0.55, 'greed:gluttony': 0.5, 'greed:sloth': 0.8,
    'lust:lust': 0.6, 'lust:envy': 0.45, 'lust:wrath': 0.5, 'lust:gluttony': 0.92, 'lust:sloth': 0.88,
    'envy:envy': 0.5, 'envy:wrath': 0.8, 'envy:gluttony': 0.9, 'envy:sloth': 0.55,
    'wrath:wrath': 0.25, 'wrath:gluttony': 0.82, 'wrath:sloth': 0.88,
    'gluttony:gluttony': 0.65, 'gluttony:sloth': 0.3,
    'sloth:sloth': 0.3,
  },
  {
    'pride:pride': "Two main characters, one plot. Someone has to agree to be the B-story.",
    'pride:greed': "Empire builders. Just decide in advance who gets the corner office.",
    'pride:lust': "One leads, one charms: the power couple of the group chat.",
    'pride:envy': "One wears the crown, the other keeps measuring it.",
    'pride:sloth': "One runs the empire, the other stops it from burning out.",
    'greed:greed': "Two spreadsheets, one budget, endless audits.",
    'greed:envy': "One spots it, the other secures it. Terrifyingly efficient.",
    'lust:envy': "One flirts with the whole room, the other keeps count.",
    'lust:gluttony': "Every night out becomes a story you'll retell at the wedding.",
    'envy:gluttony': "Two explorers who never stop asking 'okay, what's next?'",
    'wrath:wrath': "Two fires, zero extinguishers.",
    'wrath:gluttony': "Chaos legends. Everything becomes a story (and occasionally an incident report).",
    'wrath:sloth': "The sword and the sanctuary: one fights, the other makes peace worth fighting for.",
    'gluttony:sloth': "One wants one more round; the other already has their pyjamas on.",
    'sloth:sloth': "Beautifully peaceful. Nothing will ever get booked.",
  },
)

// 🌙 Moon × Moon: how your inner selves connect.
const moon = build(
  'moon',
  {
    'pride:pride': 0.55, 'pride:greed': 0.8, 'pride:lust': 0.93, 'pride:envy': 0.2, 'pride:wrath': 0.88, 'pride:gluttony': 0.5, 'pride:sloth': 0.92,
    'greed:greed': 0.6, 'greed:lust': 0.3, 'greed:envy': 0.88, 'greed:wrath': 0.5, 'greed:gluttony': 0.25, 'greed:sloth': 0.9,
    'lust:lust': 0.7, 'lust:envy': 0.82, 'lust:wrath': 0.88, 'lust:gluttony': 0.93, 'lust:sloth': 0.92,
    'envy:envy': 0.45, 'envy:wrath': 0.5, 'envy:gluttony': 0.9, 'envy:sloth': 0.55,
    'wrath:wrath': 0.2, 'wrath:gluttony': 0.8, 'wrath:sloth': 0.5,
    'gluttony:gluttony': 0.6, 'gluttony:sloth': 0.25,
    'sloth:sloth': 0.6,
  },
  {
    'pride:lust': "You make each other feel adored and respected: the full set.",
    'pride:envy': "One person's insecurity sets off the other's. Handle with care (and compliments).",
    'pride:wrath': "You understand each other's ambition, and each other's grudges.",
    'pride:sloth': "One gives direction, the other gives peace. Deeply restful.",
    'greed:lust': "One guards the vault, the other wants the door left open.",
    'greed:gluttony': "One budgets the trip, the other books three more.",
    'greed:sloth': "Security meets serenity. A very cozy fortress.",
    'lust:gluttony': "Shared joy, shared passion, shared dessert.",
    'lust:sloth': "Warmth plus safety: the emotional version of a weighted blanket.",
    'envy:gluttony': "Two curious hearts reminding each other the grass is green right here.",
    'wrath:wrath': "Too much fire for one fireplace.",
    'wrath:sloth': "One calms the storm; the other may find the storm exhausting.",
    'gluttony:sloth': "One wants an adventure, the other wants a nap. Compromise: adventure nap.",
  },
)

// ⬆️ Rising × Rising: first impressions and chemistry.
const rising = build(
  'rising',
  {
    'pride:pride': 0.35, 'pride:greed': 0.9, 'pride:lust': 0.93, 'pride:envy': 0.5, 'pride:wrath': 0.8, 'pride:gluttony': 0.55, 'pride:sloth': 0.9,
    'greed:greed': 0.5, 'greed:lust': 0.5, 'greed:envy': 0.88, 'greed:wrath': 0.45, 'greed:gluttony': 0.45, 'greed:sloth': 0.9,
    'lust:lust': 0.65, 'lust:envy': 0.8, 'lust:wrath': 0.55, 'lust:gluttony': 0.92, 'lust:sloth': 0.92,
    'envy:envy': 0.35, 'envy:wrath': 0.8, 'envy:gluttony': 0.9, 'envy:sloth': 0.5,
    'wrath:wrath': 0.3, 'wrath:gluttony': 0.92, 'wrath:sloth': 0.78,
    'gluttony:gluttony': 0.65, 'gluttony:sloth': 0.35,
    'sloth:sloth': 0.55,
  },
  {
    'pride:pride': "Two crowns, one room. Someone's going to have to bow first.",
    'pride:greed': "Empire Builders: power-couple energy, possibly a merger.",
    'pride:lust': "The Royal Romance: everyone notices when you walk in together.",
    'greed:sloth': "The Architect: one dreams it, one builds it. Eventually.",
    'lust:sloth': "Heart and Home: one brings the warmth, the other brings the calm.",
    'envy:envy': "Two people quietly sizing each other up across the room. Riveting.",
    'envy:gluttony': "The Endless Quest: two people who never stop exploring.",
    'wrath:wrath': "Instant tension. Could be a rivalry, could be a buddy-cop movie.",
    'wrath:gluttony': "The Chaos Legends: road work ahead? Yeah, you'll take it.",
    'wrath:sloth': "The Sword and the Sanctuary.",
  },
)

export const COMPAT: CompatContent = {
  weights: { sun: 0.3, moon: 0.5, rising: 0.2 },
  matrices: { sun, moon, rising },
  needs: {
    pride: "Someone who admires you, but isn't afraid to tell you when you're wrong.",
    greed: "Someone steady and reliable who shows you there's plenty to go around.",
    lust: "Someone real: affectionate, honest and allergic to mind games.",
    envy: "Someone who makes you feel chosen and reminds you of your own shine.",
    wrath: "Someone loyal and honest who can calm the fire without putting it out.",
    gluttony: "Someone who'll say yes to the adventure, and also to staying in sometimes.",
    sloth: "Someone gentle who can still coax you off the couch.",
  },
  bands: [
    { min: 0, label: "Natural Nemeses", blurb: "Jedi and Sith energy. Fantastic for a debate, risky for a shared road trip. Proceed with snacks." },
    { min: 0.45, label: "Frenemies", blurb: "You'll argue about where to eat, then have a great time anyway. Mostly." },
    { min: 0.6, label: "Co-Conspirators", blurb: "Good vibes, a little friction. You'd survive a group project, and probably a road trip." },
    { min: 0.72, label: "Partners in Crime", blurb: "You balance each other out. Someone tonight will ask if you two came together." },
    { min: 0.85, label: "Sinfully Soulmates", blurb: "Written in the stars, or at least in this quiz. Go make a toast together." },
  ],
}
