/**
 * OpenEOS Design-Tokens als TypeScript-Werte.
 *
 * Für alles, was keine CSS-Variable auflösen kann: Chart-Bibliotheken
 * (Recharts, Chart.js), Canvas, PDF-Erzeugung, E-Mail-Templates,
 * meta[name=theme-color].
 *
 * In normalem Markup immer die CSS-Variablen benutzen — nur die
 * kennen den Dark-Mode.
 */

export const paperLight = {
  paper: '#f5f2ea',
  paper2: '#ece7d9',
  paper3: '#e1dccf',
  surface: '#fbfaf5',
  ink: '#0c0f0d',
  ink2: '#151a17',
  ink3: '#1e2420',
  mute: '#6b7068',
  mute2: '#a8ad9f',
} as const;

export const paperDark = {
  paper: '#0c0f0d',
  paper2: '#151a17',
  paper3: '#232a26',
  surface: '#121715',
  ink: '#f0ede3',
  ink2: '#e2dece',
  ink3: '#d2cdbb',
  mute: '#949a8d',
  mute2: '#6b7268',
} as const;

export const green = {
  signal: 'oklch(0.78 0.18 145)',
  signal2: 'oklch(0.72 0.19 145)',
  ink: 'oklch(0.32 0.12 145)',
  soft: '#d8f3d3',
  soft2: '#d1ebc9',
} as const;

export const status = {
  warn: '#c8871a',
  warnSoft: '#f7ead0',
  warnBright: '#f0b64a',
  danger: '#c0392b',
  dangerSoft: '#f7dedb',
  dangerBright: '#f07a68',
  info: '#2f6d8c',
  infoSoft: '#dceaf1',
  infoBright: '#7fc3e0',
} as const;

export const radii = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 999,
} as const;

export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s7: 32,
  s8: 44,
} as const;

export const fonts = {
  sans: '"Geist", system-ui, sans-serif',
  display: '"Bricolage Grotesque", "Geist", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

/**
 * Kategoriale Reihe für Diagramme. Beginnt beim Markengrün und
 * weicht dann in Farbton und Helligkeit aus, damit die Serien auch
 * bei Rot-Grün-Schwäche und in Graustufen unterscheidbar bleiben.
 */
export const chartSeries = [
  'oklch(0.47 0.14 145)',
  'oklch(0.62 0.13 230)',
  'oklch(0.72 0.15 75)',
  'oklch(0.55 0.16 25)',
  'oklch(0.68 0.13 300)',
  'oklch(0.58 0.09 190)',
] as const;

export const theme = {
  light: { ...paperLight, green, status },
  dark: { ...paperDark, green, status },
  radii,
  spacing,
  fonts,
  chartSeries,
} as const;

export type OpenEosTheme = typeof theme;
