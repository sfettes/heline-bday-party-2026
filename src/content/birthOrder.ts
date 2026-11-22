import type { BirthOrderContent } from './types'

/** Flavour line keyed by birth order, then Sun sin (28 lines). */
export const BIRTH_ORDER: BirthOrderContent = {
  question: 'One last thing — where do you fall in your family?',
  labels: { oldest: 'Oldest', middle: 'Middle', youngest: 'Youngest', only: 'Only child' },
  lines: {
    oldest: {
      pride: "Oldest child: you were born holding a clipboard. Your siblings still call you 'the boss', and it isn't a joke.",
      greed: "Oldest child: you had a savings account before your siblings had teeth, and you charged them interest.",
      lust: "Oldest child: first to bring someone home, and you set the bar for every dramatic introduction since.",
      envy: "Oldest child: you did everything first and you're still convinced the younger ones got the easy-mode version.",
      wrath: "Oldest child: designated family enforcer. Nobody messed with your siblings except you.",
      gluttony: "Oldest child: first to try everything, first to report back, first in line at the buffet.",
      sloth: "Oldest child: the responsible one who would very much like to stop being the responsible one.",
    },
    middle: {
      pride: "Middle child: you learned early that if you wanted the spotlight, you'd have to build the stage yourself.",
      greed: "Middle child: master negotiator. You've brokered more sibling trades than a Sopranos sit-down.",
      lust: "Middle child: the family charmer and peacemaker. You could get both sides to like you, and usually did.",
      envy: "Middle child: a lifetime of checking whether the oldest got more and the youngest got away with more. (They did.)",
      wrath: "Middle child: you've been fighting for fairness since the Great Front-Seat War.",
      gluttony: "Middle child: you learned to eat fast and enjoy it loudly. Leftovers never stood a chance.",
      sloth: "Middle child: forgotten at a gas station once, and honestly you enjoyed the peace and quiet.",
    },
    youngest: {
      pride: "Youngest child: born the main character, raised by a supporting cast.",
      greed: "Youngest child: you inherited everything, including the stuff they swore you'd never get.",
      lust: "Youngest child: you got away with everything with one look, and you're still trying it.",
      envy: "Youngest child: you've been catching up to your siblings since birth, and you have receipts on all of them.",
      wrath: "Youngest child: small but mighty. You learned to fight scrappy because everyone else was bigger.",
      gluttony: "Youngest child: everyone spoiled you, and you've seen no reason to stop.",
      sloth: "Youngest child: someone always did it for you, and you've built a lovely life around that.",
    },
    only: {
      pride: "Only child: you never had to share the spotlight, and you don't see why you should start now.",
      greed: "Only child: everything was already yours. Sharing is a skill you picked up as an adult, mostly.",
      lust: "Only child: you turned your friends into siblings, and you love them loudly.",
      envy: "Only child: you grew up peeking at other people's families and wondering what you were missing.",
      wrath: "Only child: no siblings to fight, so you picked fights with injustice instead.",
      gluttony: "Only child: never once had to split dessert. You have never recovered from that luxury.",
      sloth: "Only child: a quiet house and all the time in the world. Honestly, you still think that's how life should be.",
    },
  },
}
