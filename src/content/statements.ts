import type { Placement, SinId, Statement } from './types'

/**
 * 63 Likert statements: 3 per (placement × sin).
 *  - sun:    first-person behaviour (what you DO)
 *  - moon:   private wants and fears
 *  - rising: how others read you (perception-framed)
 * `reverse: true` means agreeing indicates LESS of the sin.
 */
type Row = [text: string, reverse?: boolean]

const CELLS: Record<Placement, Record<SinId, [Row, Row, Row]>> = {
  sun: {
    pride: [
      ["When I'm right, I make sure everyone in the room knows I was right."],
      ["I'll quietly redo someone else's work because mine would simply be better."],
      ['I name-drop my wins casually, like they just slipped out.'],
    ],
    greed: [
      ['I keep a mental tally of who owes me what, down to the last Tim Hortons coffee.'],
      ["I collect like a Jawa: if it's free, it's coming home with me."],
      ["I lend out my favourite things and honestly don't care if they come back.", true],
    ],
    lust: [
      ["I hold eye contact a beat too long, and I know exactly what I'm doing."],
      ['At parties, I make a point of charming everyone, one by one.'],
      ["I'm the one keeping the group chat flirty and the DMs busy."],
    ],
    envy: [
      ["I check how my friends' trips, jobs and glow-ups stack up against mine."],
      ['When a friend lands a shiny Waterloo tech job, I immediately stalk their LinkedIn.'],
      ['I genuinely cheer when a friend gets the exact thing I wanted.', true],
    ],
    wrath: [
      ['I heckle the TV during hockey, Question Period and the evening news.'],
      ["Stuck behind the ION on King Street, I'm the one honking and yelling at the windshield."],
      ["If someone's rude to a server, I'm the one who says something. Loudly."],
    ],
    gluttony: [
      ["I always order 'a few things for the table' and then a dessert for myself."],
      ['I raid the fridge like Tony Soprano: gabagool, at midnight, standing up.'],
      ['I can stop at one drink, one slice or one episode without even trying.', true],
    ],
    sloth: [
      ["I've cancelled plans just so I could stay home in sweatpants."],
      ['My to-do list has items on it older than most Vines.'],
      ['If a task can wait until tomorrow, it will wait until next week.'],
    ],
  },
  moon: {
    pride: [
      ["Secretly, I need people to see that I'm the best at what I do."],
      ['Being corrected in front of people haunts me for days.'],
      ["Deep down, I think most people just aren't operating at my level."],
    ],
    greed: [
      ['Secretly, I daydream about my net worth more than my love life.'],
      ["The thought of losing what I've built keeps me up at night."],
      ["I'd secretly sit through any Roy family dinner if it meant inheriting the company."],
    ],
    lust: [
      ['Secretly, I want someone a little obsessed with me, Obsession-style, minus the horror.'],
      ['I replay a good flirty conversation in my head for days.'],
      ['I could go months without flirting or romance and honestly not miss it.', true],
    ],
    envy: [
      ["Secretly, someone else's good news can ruin my whole afternoon."],
      ['I privately rank myself against my friends: careers, couples, apartments.'],
      ['The Substance hit home: I quietly resent anyone who seems like a better version of me.'],
    ],
    wrath: [
      ['Like Nathan Fielder, I rehearse arguments in my head, and in my version I destroy them.'],
      ["I hold grudges like they're family heirlooms."],
      ['When someone wrongs me, I honestly forget about it by the next day.', true],
    ],
    gluttony: [
      ["Deep down, 'just one more' (bite, drink, episode) is my life motto."],
      ['My secret fear at any party is the snacks running out early.'],
      ["Like Maomao, I'd secretly taste anything once, even if it might be poison."],
    ],
    sloth: [
      ["When life gets busy, I quietly wish I could hibernate until it's over."],
      ["Apes together strong, but secretly I'd love the other apes to do the lifting."],
      ['Secretly, I feel restless and guilty after a whole day of doing nothing.', true],
    ],
  },
  rising: {
    pride: [
      ["People assume I think I'm better than them before I've said a word."],
      ["Strangers get 'chosen one' energy from me, like I think I'm the Kwisatz Haderach."],
      ['People read me as humble, almost to a fault.', true],
    ],
    greed: [
      ["People assume I'm calculating what everything in the room is worth."],
      ["Friends joke I'd sell my own birthday cake if the price was right."],
      ["People see me as someone who'd hand over my last twenty without blinking.", true],
    ],
    lust: [
      ['People tell me I flirt without even realizing it.'],
      ["I've been told I have Twilight-vampire energy: people feel pulled in and can't say why."],
      ["People always assume I'm seeing someone, or about to be."],
    ],
    envy: [
      ["Friends say I go quiet whenever someone else's life is going great."],
      ['People say my smile at their good news looks a bit like the one from Smile.'],
      ["People read me as someone who never compares their life to anyone else's.", true],
    ],
    wrath: [
      ["My resting face makes people ask who I'm about to fight."],
      ['People seem to sense I could go full Prince Zuko if pushed.'],
      ["People find me so even-tempered they can't picture me raising my voice.", true],
    ],
    gluttony: [
      ["People assume I'm the friend who'll say yes to dessert, drinks and 'one more place.'"],
      ['People assume the last slice of pizza is already mine.'],
      ['At Oktoberfest, people expect me to be ordering another stein and another schnitzel.'],
    ],
    sloth: [
      ["People assume I just woke up from a nap, and they're usually right."],
      ["Strangers read me as so laid-back I'm basically horizontal."],
      ['People picture me as the Lumon innie doing the bare minimum, very slowly.'],
    ],
  },
}

export const STATEMENTS: Statement[] = (Object.keys(CELLS) as Placement[]).flatMap((placement) =>
  (Object.keys(CELLS[placement]) as SinId[]).flatMap((sin) =>
    CELLS[placement][sin].map(([text, reverse], i) => ({
      id: `${placement}-${sin}-${i + 1}`,
      placement,
      sin,
      text,
      ...(reverse ? { reverse: true } : {}),
    })),
  ),
)
