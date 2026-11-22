import type { GrowthTip } from './types'

/** 21 growth tips (sin × placement). Light-hearted, not therapy-speak. */
export const GROWTH: GrowthTip[] = [
  // ☀️ SUN
  {
    placement: 'sun',
    sin: 'pride',
    question: "Do I need to prove myself here, or do I just need to solve this?",
    practices: ["Ask someone for advice and actually take it (at least once)", "Let someone else pick the restaurant, and don't review it", "Celebrate progress, not just trophies"],
    powerMove: "Be the leader, not the lone hero.",
  },
  {
    placement: 'sun',
    sin: 'greed',
    question: "Do I actually need this, or is it just… there?",
    practices: ["Cancel three subscriptions you forgot you had", "Give something away just because", "Do one fun thing with absolutely zero return on investment"],
    powerMove: "Spend on a memory, not a thing.",
  },
  {
    placement: 'sun',
    sin: 'lust',
    question: "Do I want this person, or just the feeling of being wanted?",
    practices: ["Let a conversation be a bit boring and see if it's still good", "Wait an hour before sending the 2 a.m. text", "Give attention without keeping a tally of who gives it back"],
    powerMove: "Let a slow burn actually burn.",
  },
  {
    placement: 'sun',
    sin: 'envy',
    question: "Do I want their whole life, or just one piece of it?",
    practices: ["Mute one account that always makes you feel worse", "Turn the pang into a plan: what's one step toward it?", "Congratulate someone and mean it (practise the face in the mirror)"],
    powerMove: "Compete only with last year's you.",
  },
  {
    placement: 'sun',
    sin: 'wrath',
    question: "What actually deserves my energy right now?",
    practices: ["Count to ten. Okay, five. Fine, three.", "Write the angry text in your Notes app and let it sit overnight", "Turn the rant into a to-do list"],
    powerMove: "Pick your battles, then win them.",
  },
  {
    placement: 'sun',
    sin: 'gluttony',
    question: "Will one more make this better, or just longer?",
    practices: ["Leave one party while it's still fun", "Keep one evening a week completely unplanned", "Savour one thing slowly instead of five things quickly"],
    powerMove: "Quality over quantity. Yes, that includes appetizers.",
  },
  {
    placement: 'sun',
    sin: 'sloth',
    question: "What's the smallest possible step I could take right now?",
    practices: ["If it takes two minutes, do it now", "Set a 15-minute timer and start; you're allowed to stop when it rings", "Reply to one message from last week (they'll understand)"],
    powerMove: "Start badly. Start anyway.",
  },

  // 🌙 MOON
  {
    placement: 'moon',
    sin: 'pride',
    question: "Would I still be proud of this if nobody saw it?",
    practices: ["Admit one small mistake out loud, and notice that you survive", "Ask for help before it becomes an emergency", "Let someone see you mid-mess"],
    powerMove: "Your worth isn't a performance review.",
  },
  {
    placement: 'moon',
    sin: 'greed',
    question: "What does 'enough' actually look like for me?",
    practices: ["Write down your real 'enough' number, for money or anything else", "Let someone else handle the logistics for once", "Notice one thing you have now that you used to wish for"],
    powerMove: "Trust that more will come.",
  },
  {
    placement: 'moon',
    sin: 'lust',
    question: "Am I asking for closeness, or hoping they'll just guess?",
    practices: ["Say what you need in plain words", "Spend an evening alone, on purpose, and enjoy it", "Don't decode the 'k.' Just ask."],
    powerMove: "Choose yourself first.",
  },
  {
    placement: 'moon',
    sin: 'envy',
    question: "Would I still want this if nobody else had it?",
    practices: ["Write down three wins from this month, however small", "Swap one scroll session for something you actually want to do", "Treat someone else's success as a map, not a verdict"],
    powerMove: "Your lane, your pace.",
  },
  {
    placement: 'moon',
    sin: 'wrath',
    question: "Am I angry, or am I actually hurt?",
    practices: ["Name the feeling before you act on it", "Say the small thing before it becomes the big thing", "When the fire rises, move: walk, run, dance it out in the kitchen"],
    powerMove: "Turn the fire into fuel.",
  },
  {
    placement: 'moon',
    sin: 'gluttony',
    question: "What am I trying not to feel right now?",
    practices: ["Sit through one boring evening on purpose", "Eat one whole meal without your phone", "Notice the exact moment 'more' stops being fun"],
    powerMove: "Stillness counts as an experience too.",
  },
  {
    placement: 'moon',
    sin: 'sloth',
    question: "Is this rest, or is this hiding?",
    practices: ["Have one small, slightly awkward conversation this month", "Name something you actually want, even if only to yourself", "Swap one 'whatever's fine' for a real preference"],
    powerMove: "Real peace is on the other side of the conversation.",
  },

  // ⬆️ RISING
  {
    placement: 'rising',
    sin: 'pride',
    question: "Do people see someone they can actually approach?",
    practices: ["Open with a question instead of an opinion", "Laugh at yourself early in the night", "Let someone else tell the story"],
    powerMove: "Lead by lifting other people up.",
  },
  {
    placement: 'rising',
    sin: 'greed',
    question: "Am I connecting here, or networking?",
    practices: ["Ask someone something with zero career value", "Leave the LinkedIn voice at the door", "Share one thing you're hilariously bad at"],
    powerMove: "Be generous first.",
  },
  {
    placement: 'rising',
    sin: 'lust',
    question: "Are they seeing me, or just the charm?",
    practices: ["Let one conversation get properly real", "Notice who you're performing for", "Be slightly less available and see who follows"],
    powerMove: "Lead with substance; the sparkle will follow.",
  },
  {
    placement: 'rising',
    sin: 'envy',
    question: "Am I observing, or keeping score?",
    practices: ["Give a specific compliment in the first five minutes", "Share something about yourself before you analyse anyone else", "Unclench the side-eye"],
    powerMove: "Curiosity looks better on you than comparison.",
  },
  {
    placement: 'rising',
    sin: 'wrath',
    question: "Is my face starting a fight my mouth never agreed to?",
    practices: ["Open with a joke", "Soften your first sentence", "Ask 'what do you think?' before you say what you think"],
    powerMove: "Strength that's also kind is unbeatable.",
  },
  {
    placement: 'rising',
    sin: 'gluttony',
    question: "Am I sharing the spotlight, or hogging the snacks?",
    practices: ["Let a quiet moment happen without filling it", "Follow through on one plan you made at midnight", "Show people your serious side, briefly"],
    powerMove: "Be the fun one who also shows up.",
  },
  {
    placement: 'rising',
    sin: 'sloth',
    question: "Do people actually know that I care?",
    practices: ["Say yes to one plan before you overthink it", "Text first", "Show enthusiasm out loud. Use an exclamation mark!"],
    powerMove: "Let your calm come with a pulse.",
  },
]
