import type { PlacementMeta, Sin, SinId } from './types'

/** Canonical sin list. Order matters: it is the fallback tie order and the code alphabet. */
export const SINS: Record<SinId, Sin> = {
  pride: { id: 'pride', name: 'Pride', latin: 'superbia', emoji: '👑', letter: 'P', virtue: 'Humility', accent: '#E8C468' },
  greed: { id: 'greed', name: 'Greed', latin: 'avaritia', emoji: '💰', letter: 'G', virtue: 'Generosity', accent: '#7FC8A9' },
  lust: { id: 'lust', name: 'Lust', latin: 'luxuria', emoji: '❤️', letter: 'L', virtue: 'Devotion', accent: '#E8798F' },
  envy: { id: 'envy', name: 'Envy', latin: 'invidia', emoji: '👀', letter: 'E', virtue: 'Gratitude', accent: '#9CCB6B' },
  wrath: { id: 'wrath', name: 'Wrath', latin: 'ira', emoji: '🔥', letter: 'W', virtue: 'Patience', accent: '#F08A5D' },
  gluttony: { id: 'gluttony', name: 'Gluttony', latin: 'gula', emoji: '🍰', letter: 'U', virtue: 'Temperance', accent: '#E9A6D0' },
  sloth: { id: 'sloth', name: 'Sloth', latin: 'acedia', emoji: '😴', letter: 'S', virtue: 'Diligence', accent: '#8FB3E8' },
}

export const PLACEMENT_META: Record<PlacementMeta['id'], PlacementMeta> = {
  sun: { id: 'sun', name: 'Sun', emoji: '☀️', tagline: 'What you do', description: 'Your everyday habits and how you actually behave.' },
  moon: { id: 'moon', name: 'Moon', emoji: '🌙', tagline: 'What you secretly want', description: 'The private wants and fears running underneath.' },
  rising: { id: 'rising', name: 'Rising', emoji: '⬆️', tagline: 'How others read you', description: 'The first impression you give before anyone knows you.' },
}
