/**
 * Schrift-Setup für Next.js.
 *
 * Liefert die CSS-Variablen, die tokens.css erwartet
 * (--font-oe-sans, --font-oe-display, --font-oe-mono). Die
 * Klassennamen gehören an ein möglichst hohes Element, üblicherweise
 * <html> oder <body>:
 *
 *   import { openEosFonts } from '@openeos/ui/fonts';
 *
 *   <html className={openEosFonts.className}>
 *
 * Nur in Next.js verwendbar — next ist eine optionale Peer-Dependency.
 */
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from 'next/font/google';

export const geistSans = Geist({
  variable: '--font-oe-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

/* Bricolage Grotesque ist eine Variable Font. Sobald die opsz-Achse
   angefordert wird, darf keine feste Gewichtsliste danebenstehen —
   ohne weight lädt Next die volle variable Instanz, womit alle
   Schnitte und die optische Größe verfügbar sind (.oe-display setzt
   font-variation-settings: "opsz" 96). */
export const bricolageDisplay = Bricolage_Grotesque({
  variable: '--font-oe-display',
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-oe-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

/** Alle drei Schrift-Variablen in einem className. */
export const openEosFonts = {
  className: [geistSans.variable, bricolageDisplay.variable, jetbrainsMono.variable].join(' '),
  sans: geistSans,
  display: bricolageDisplay,
  mono: jetbrainsMono,
} as const;
