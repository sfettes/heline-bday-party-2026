import type { Figure, FigureSet, Placement, SinId } from './types'

/**
 * Pop-culture figures: 21 sets (placement × sin), 3–4 each.
 *  - sun    = what they visibly DO
 *  - moon   = what they secretly want or fear underneath
 *  - rising = the first impression they give
 * Real people are referenced only for their public persona, affectionately.
 * No figure appears in more than one set.
 */

const f = (name: string, source: string, why: string): Figure => ({ name, source, kind: 'fictional', why })
const r = (name: string, source: string, why: string): Figure => ({ name, source, kind: 'real', why })
const set = (placement: Placement, sin: SinId, figures: Figure[]): FigureSet => ({ placement, sin, figures })

export const FIGURES: FigureSet[] = [
  // ☀️ SUN: what they visibly do
  set('sun', 'pride', [
    f('Logan Roy', 'Succession', 'Runs every room like a hostile takeover he already won.'),
    f('Paul Atreides', 'Dune', 'Gets offered messiah status and treats it like a reasonable job offer.'),
    r('Drake', 'Toronto rapper', 'Crowned himself the 6 God. Humility never made the tracklist.'),
    r('Chris Hadfield', 'Canadian astronaut', 'Sang Bowie aboard the space station. Main-character energy, from orbit.'),
  ]),
  set('sun', 'greed', [
    r("Kevin O'Leary", "Dragons' Den / Shark Tank", 'Will tell you, to your face, that money is his only friend.'),
    f('The Madam', 'The Apothecary Diaries', 'Runs the Verdigris House and never misses a coin.'),
    r('Wayne Gretzky', 'NHL legend', 'Collected so many NHL records he is basically hoarding them.'),
    r('Jim Balsillie', 'BlackBerry co-CEO, Waterloo', 'Built BlackBerry billions, then kept trying to buy an NHL team.'),
  ]),
  set('sun', 'lust', [
    f('Finnick Odair', 'The Hunger Games', 'Offers you a sugar cube and smoulders like it is a public service.'),
    f('Jinshi', 'The Apothecary Diaries', 'Uses his own charm as a court tool, and it always works.'),
    r('Michael Bublé', 'Canadian crooner', 'Serenades the entire country every December like we are all his date.'),
    r('Shawn Mendes', 'Vine star turned pop star', 'Turned six-second Vine covers into a full-time serenading career.'),
  ]),
  set('sun', 'envy', [
    f('Christopher Moltisanti', 'The Sopranos', 'Keeps a running tally of everyone who got made before him.'),
    f('Sue', 'The Substance', 'Literally competes with her other self for screen time.'),
    f('Jessica Stanley', 'Twilight', 'Watches the new girl get all the attention and narrates it loudly.'),
  ]),
  set('sun', 'wrath', [
    f('Caesar', 'Planet of the Apes', 'First word: "NO!" Second move: a full revolution.'),
    r('Rick Mercer', 'Rick Mercer Report', 'Built a whole career ranting down Toronto alleys at the camera.'),
    f('Paulie Walnuts', 'The Sopranos', 'Will reopen a feud from 1987 over one wrong look.'),
  ]),
  set('sun', 'gluttony', [
    f('Tony Soprano', 'The Sopranos', 'Opens the fridge, finds the gabagool, has a whole spiritual moment.'),
    f('Baron Harkonnen', 'Dune', 'Wants all the spice, all the planets, and seconds.'),
    r('Doug Ford', 'Premier of Ontario', 'Campaigned on buck-a-beer. Knows exactly what the people are hungry for.'),
    r('Berry Vrbanovic', 'Long-time Kitchener mayor', 'Tapping the Oktoberfest keg is basically part of the job description.'),
  ]),
  set('sun', 'sloth', [
    f('Mark Scout', 'Severance', 'Outsourced half his life to his innie. Peak delegation.'),
    f('Red Green', 'The Red Green Show', 'Why fix it properly when duct tape is right there?'),
    f('A.J. Soprano', 'The Sopranos', 'His bean bag chair has seen more of him than the school has.'),
  ]),

  // 🌙 MOON: what they secretly want or fear
  set('moon', 'pride', [
    f('Prince Zuko', 'Avatar: The Last Airbender', 'Every single quest is secretly about his honour. He said so. A lot.'),
    f('Kendall Roy', 'Succession', 'Underneath the rap and the sneakers: desperate to be Number One Boy.'),
    r('Nathan Fielder', 'The Rehearsal', 'Rehearses everything, because being caught unprepared is the real nightmare.'),
  ]),
  set('moon', 'greed', [
    f('Greg Hirsch', 'Succession', 'Gangly and apologetic, quietly pocketing every opportunity. And the notebooks.'),
    f('The Cabbage Merchant', 'Avatar: The Last Airbender', 'Everything he loves fits on one cart, and he will NOT let go.'),
    r('William Lyon Mackenzie King', 'Kitchener-born Prime Minister', 'Born in Berlin, Ontario; held the PM job longer than anyone ever.'),
  ]),
  set('moon', 'lust', [
    f('Bella Swan', 'Twilight', 'Would trade being human for the right brooding glance.'),
    f('Elisabeth Sparkle', 'The Substance', 'Underneath it all, she just wants the spotlight to want her back.'),
    f('Anakin Skywalker', 'Star Wars', 'Broke the entire Jedi code over one secret crush.'),
    r('Celine Dion', 'Canadian icon', 'Sings every note like she is yearning across an entire ocean.'),
  ]),
  set('moon', 'envy', [
    f('Azula', 'Avatar: The Last Airbender', 'Flawless on the outside; secretly sure everyone loved Zuko more.'),
    f('Rosalie Hale', 'Twilight', 'Has eternal youth and still envies Bella for being ordinary.'),
    f('Shiv Roy', 'Succession', 'Wants the crown so badly it hurts watching the boys get it.'),
  ]),
  set('moon', 'wrath', [
    f('Katniss Everdeen', 'The Hunger Games', 'Quiet with a bow; inside, already planning to burn the Capitol down.'),
    f('Helly R.', 'Severance', 'A polite innie whose secret engine is pure rage at being trapped.'),
    f('The Smile Entity', 'Smile / Smile 2', 'Grins at everyone. The fury stays strictly behind the teeth.'),
    r('Margaret Atwood', 'Canadian author', 'Polite Canadian surface; underneath, whole dystopias of righteous fury.'),
  ]),
  set('moon', 'gluttony', [
    f('Maomao', 'The Apothecary Diaries', 'Looks bored; secretly lives for her next taste of poison.'),
    f('Dylan G.', 'Severance', 'Would sell his soul for a waffle party. Has tried.'),
    f('Bob & Doug McKenzie', 'SCTV / Strange Brew', 'Beneath the toques: an endless craving for back bacon and beer, eh.'),
    r('Mike Lazaridis', 'BlackBerry co-founder, Waterloo', 'Hungry enough for physics to build Waterloo a whole institute for it.'),
  ]),
  set('moon', 'sloth', [
    f('Haymitch Abernathy', 'The Hunger Games', 'Survived the Games; life goal since is a long, undisturbed nap.'),
    f('Dr. Robby', 'The Pitt', 'Holds the whole ER together while privately dreaming of one day off.'),
    f('Gaoshun', 'The Apothecary Diaries', "Jinshi's long-suffering aide. Just wants five quiet minutes."),
  ]),

  // ⬆️ RISING: the first impression
  set('rising', 'pride', [
    f('Effie Trinket', 'The Hunger Games', 'Pure Capitol snobbery at first glance; turns out she genuinely cares.'),
    f('Princess Leia', 'Star Wars', 'Royal attitude from the first hello, all heart underneath.'),
    r('Mark Carney', 'Former Bank of Canada governor', 'Gives off the aura of a man who has never misplaced a decimal.'),
    r('Shania Twain', 'Canadian country-pop icon', 'Arrives radiating "that don\'t impress me much." It rarely does.'),
  ]),
  set('rising', 'greed', [
    f('Han Solo', 'Star Wars', 'Swears he is only in it for the money. He is not.'),
    f('Moira Rose', "Schitt's Creek", 'Broke, living in a motel, still radiating old money.'),
    r('Ryan Reynolds', 'Vancouver-born actor', 'Looks like he would sell you gin, a phone plan and a football club.'),
  ]),
  set('rising', 'lust', [
    f('Edward Cullen', 'Twilight', 'Literally sparkles. You notice him before he says a word.'),
    f('Lando Calrissian', 'Star Wars', 'Cape, smirk, "hello, what have we here?" Flirts with the doorframe.'),
    r('Keanu Reeves', 'Toronto-raised actor', 'Everyone leaves meeting him a little bit in love.'),
  ]),
  set('rising', 'envy', [
    r('Young Busco', 'Vine ("What are those?!")', 'Clocks your shoes first and judges second: "What are THOSE?!"'),
    f('Harmony Cobel', 'Severance', 'Watches you from across the office, taking notes on everything you have.'),
    f('Feyd-Rautha', 'Dune', 'Stares at Paul like he personally stole his destiny.'),
  ]),
  set('rising', 'wrath', [
    f('Toph Beifong', 'Avatar: The Last Airbender', 'Looks ready to throw you through a wall. Will. Then hugs you.'),
    f('Dana Evans', 'The Pitt', 'Charge nurse who would fight you, then fetch you a warm blanket.'),
    r('Lennox Lewis', 'Kitchener-raised heavyweight champ', 'Heavyweight-champion aura; actually a famously calm, chess-loving gentleman.'),
  ]),
  set('rising', 'gluttony', [
    f('Onkel Hans', 'K-W Oktoberfest', 'Looks three steins and a schnitzel into the best day ever.'),
    r('Mike Myers', 'Toronto-born comedian', 'Shows up with nine characters, four accents and maximum everything.'),
    r('Seth Rogen', 'Vancouver-born actor', 'That laugh makes any room feel like the snacks just arrived.'),
  ]),
  set('rising', 'sloth', [
    r('Drew Gooden', 'Vine ("Road work ahead")', 'Deadpan, unbothered, coasting: "Uh, yeah, I sure hope it does."'),
    r('Avril Lavigne', 'Napanee-raised pop-punk star', 'Radiates "why\'d you have to go and make things so complicated?"'),
    f('David Rose', "Schitt's Creek", 'Looks far too unbothered to try; secretly a total perfectionist.'),
  ]),
]
