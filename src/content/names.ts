import type { NameParts, PairKey } from './types'

/**
 * Title = `The ${risingAdjectives[rising]} ${identities[`${sun}:${moon}`]}`,
 * e.g. "The Velvet General", "The Drowsy Dragon".
 * Identities adapt the brainstorm's 49 Sun–Moon names, with the duplicates
 * (Collector, Flame) and multi-word names replaced.
 */
export const NAMES: NameParts = {
  identities: {
    // ☀️ Pride Sun
    'pride:pride': 'Sovereign',
    'pride:greed': 'Magnate',
    'pride:lust': 'Idol',
    'pride:envy': 'Pretender',
    'pride:wrath': 'General',
    'pride:gluttony': 'Celebrity',
    'pride:sloth': 'Figurehead',
    // ☀️ Greed Sun
    'greed:pride': 'Emperor',
    'greed:greed': 'Tycoon',
    'greed:lust': 'Patron',
    'greed:envy': 'Magpie',
    'greed:wrath': 'Warlord',
    'greed:gluttony': 'Hoarder',
    'greed:sloth': 'Archivist',
    // ☀️ Lust Sun
    'lust:pride': 'Star',
    'lust:greed': 'Socialite',
    'lust:lust': 'Siren',
    'lust:envy': 'Muse',
    'lust:wrath': 'Heartbreaker',
    'lust:gluttony': 'Hedonist',
    'lust:sloth': 'Daydreamer',
    // ☀️ Envy Sun
    'envy:pride': 'Rival',
    'envy:greed': 'Prospector',
    'envy:lust': 'Romantic',
    'envy:envy': 'Understudy',
    'envy:wrath': 'Avenger',
    'envy:gluttony': 'Window-Shopper',
    'envy:sloth': 'Lurker',
    // ☀️ Wrath Sun
    'wrath:pride': 'Champion',
    'wrath:greed': 'Conqueror',
    'wrath:lust': 'Firebrand',
    'wrath:envy': 'Revolutionary',
    'wrath:wrath': 'Berserker',
    'wrath:gluttony': 'Wildfire',
    'wrath:sloth': 'Volcano',
    // ☀️ Gluttony Sun
    'gluttony:pride': 'Performer',
    'gluttony:greed': 'Gourmet',
    'gluttony:lust': 'Bon Vivant',
    'gluttony:envy': 'Tourist',
    'gluttony:wrath': 'Daredevil',
    'gluttony:gluttony': 'Reveler',
    'gluttony:sloth': 'Hobbit',
    // ☀️ Sloth Sun
    'sloth:pride': 'Sage',
    'sloth:greed': 'Dragon',
    'sloth:lust': 'Poet',
    'sloth:envy': 'Observer',
    'sloth:wrath': 'Stormcloud',
    'sloth:gluttony': 'Lotus-Eater',
    'sloth:sloth': 'Mystic',
  },
  /** First-impression adjectives; each works in front of any identity. */
  risingAdjectives: {
    pride: 'Gilded',
    greed: 'Shrewd',
    lust: 'Velvet',
    envy: 'Side-Eyed',
    wrath: 'Iron',
    gluttony: 'Bubbly',
    sloth: 'Drowsy',
  },
}

/**
 * Central contradiction per Sun:Moon pair (what you do vs. what you secretly want).
 * Same-sin pairs describe intensity rather than contradiction.
 */
export const CONTRADICTIONS: Record<PairKey, string> = {
  // ☀️ Pride Sun
  'pride:pride': "Inside and out, you believe in you. Keeping up Sovereign standards is a full-time job, and you'd never admit you're tired.",
  'pride:greed': "Full Succession energy: you lead like you've already won, but no amount of winning ever quite feels like enough.",
  'pride:lust': "You act like you don't need anyone's approval, while quietly hoping one specific person is watching.",
  'pride:envy': "You walk around like the main character, but secretly you're scanning the cast for someone doing it better.",
  'pride:wrath': "On the outside you're cool, calm and in command. On the inside you have a very detailed list of everyone who disrespected you.",
  'pride:gluttony': "You run the show with total poise, but secretly you just want the show to be more fun.",
  'pride:sloth': "You look like you're running the empire, but what you really want is for someone else to run it while you nap.",

  // ☀️ Greed Sun
  'greed:pride': "You chase every opportunity like it's about the money, but really you're building proof that you matter.",
  'greed:greed': "You collect, save and strategise, and deep down you're still not sure it's enough. It never will be, and honestly that's half the fun.",
  'greed:lust': "You act like everything's a transaction, but secretly every investment you make is a love language.",
  'greed:envy': "You acquire things with purpose. The purpose, quite often, is that someone else had one first.",
  'greed:wrath': "You play the long game calmly, Tony Soprano at the dinner table, but take what's yours and the table gets flipped.",
  'greed:gluttony': "You save, plan and stockpile, then secretly daydream about blowing it all on one perfect weekend.",
  'greed:sloth': "You hustle relentlessly so that one day you'll never have to hustle again. That day keeps getting rescheduled.",

  // ☀️ Lust Sun
  'lust:pride': "You flirt with the whole room, but secretly you're auditioning for its admiration.",
  'lust:greed': "You hand out affection freely, but what you secretly want is someone who's a sure thing.",
  'lust:lust': "Your heart is on your sleeve and in your Moon. You love loudly, want deeply and have never once played it cool.",
  'lust:envy': "You make everyone feel like the only person in the room, while quietly wondering if you're anyone's first choice.",
  'lust:wrath': "You're all charm on the surface, but hurt someone you love and the charm becomes a weapon.",
  'lust:gluttony': "You chase connection, but secretly it's the rush you're after, and the next one is always calling.",
  'lust:sloth': "You come on like a whirlwind romance, but what you really want is a couch, a blanket and comfortable silence.",

  // ☀️ Envy Sun
  'envy:pride': "You study everyone else's success like Anakin eyeing a Council seat, quietly sure you deserved it more.",
  'envy:greed': "You watch what everyone else has, and you're already drawing up the plan to get it, with interest.",
  'envy:lust': "You compare yourself to everyone, but all you really want is someone who'd choose you without comparing.",
  'envy:envy': "You compare out loud and you compare in private. Every lane looks faster, and you've checked all of them twice.",
  'envy:wrath': "You admire from a distance, while privately keeping notes on everyone who got something they didn't deserve.",
  'envy:gluttony': "You want what everyone else has mostly so you can try it too, before moving straight on to the next thing.",
  'envy:sloth': "You keep tabs on everyone's big moves, but secretly you'd rather not make any of your own.",

  // ☀️ Wrath Sun
  'wrath:pride': "You fight hard and loud, but the real battle is proving you deserve respect.",
  'wrath:greed': "You charge in like it's about principle, but secretly you're defending your territory.",
  'wrath:lust': "You come in swinging, but underneath you just want someone who'll stay through the storm.",
  'wrath:envy': "You rage against unfairness, and some of that rage is that it's unfair to you specifically.",
  'wrath:wrath': "Fire on the outside, fire on the inside. You don't have a temper; the temper has you, and it never skips leg day.",
  'wrath:gluttony': "You're intense and fast-moving, and secretly you want the chaos, because chaos is fun.",
  'wrath:sloth': "You erupt fast and loud, but all you actually want is for everything to go quiet so you can finally lie down.",

  // ☀️ Gluttony Sun
  'gluttony:pride': "You live loud and indulgent, but every extra round is a little bid to be remembered as legendary.",
  'gluttony:greed': "You splurge like there's no tomorrow, while quietly calculating exactly how much tomorrow will cost.",
  'gluttony:lust': "You throw yourself at every experience, but what you're really chasing is someone to share them with.",
  'gluttony:envy': "You try everything, partly because you saw someone else try it first.",
  'gluttony:wrath': "You live for the thrill, but secretly some of those wild nights are just a very fun way of blowing off steam.",
  'gluttony:gluttony': "You want more and you want it now, and on the inside you want even more than that. The tasting menu never ends, and you're thrilled.",
  'gluttony:sloth': "You say yes to everything, but secretly the best part of every night is getting home to your pyjamas.",

  // ☀️ Sloth Sun
  'sloth:pride': "You look completely unbothered, but secretly you'd like some credit for how unbothered you look.",
  'sloth:greed': "You seem like you're coasting, but you've quietly secured the bag, the backup bag and a bag for the bags.",
  'sloth:lust': "You keep everything low-key, while secretly longing for a grand romantic gesture to come find you on the couch.",
  'sloth:envy': "You act like you don't care what anyone else is doing, yet you've watched every single one of their stories.",
  'sloth:wrath': "You seem impossible to rattle, but there's a storm under the stillness, and it's been brewing since 2019.",
  'sloth:gluttony': "You do as little as possible, as luxuriously as possible. Rest isn't a break from pleasure for you. It is the pleasure.",
  'sloth:sloth': "Calm outside, calm inside. You've reached a level of peace monks would envy, mostly by not answering emails.",
}
