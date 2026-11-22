/** Marker for unfinished content. `npm run check:content` fails while any remain. */
export const TODO = 'TODO:'
export const todo = (what: string) => `${TODO} ${what}`
