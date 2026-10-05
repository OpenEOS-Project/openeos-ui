/**
 * Schrift-Setup für Next.js.
 *
 * Liefert die CSS-Variablen, die tokens.css erwartet
 * (--font-oe-sans, --font-oe-mono). Die
 * Klassennamen gehören an ein möglichst hohes Element, üblicherweise
 * <html> oder <body>:
 *
 *   import { openEosFonts } from '@openeos/ui/fonts';
 *
 *   <html className={openEosFonts.className}>
 *
 * Nur in Next.js verwendbar — next ist eine optionale Peer-Dependency.
 *
 * Die Schriften liegen als WOFF2 im Paket (src/fonts/files/) und werden
 * über next/font/local eingebunden: weder der Build noch der Browser
 * fragt bei Google an. Herkunft sind die Fontsource-Pakete
 * @fontsource-variable/{geist,jetbrains-mono} 5.3.0, beide unter der
 * SIL Open Font License 1.1 (OFL-*.txt daneben).
 *
 * Display-Schrift: Seit 0.3.3 ist das Geist im Gewicht 800 (vorher
 * Bricolage Grotesque). Ein zweiter localFont-Aufruf mit derselben
 * Datei würde zwar dieselbe URL erzeugen (Next benennt nach
 * Inhalts-Hash), aber eine zweite @font-face-Familie samt
 * Fallback-Face und Preload anlegen. Stattdessen setzt tokens.css
 * --font-oe-display als Alias auf --font-oe-sans. Wer tokens.css nicht
 * einbindet, verwendet für Überschriften direkt --font-oe-sans.
 *
 * Je Schrift gibt es zwei Dateien, Teilmenge latin (Deutsch inkl.
 * Umlaute, ß und €) und latin-ext (u. a. ẞ, ŁŐŠ …). next/font/local
 * kennt kein unicode-range pro Datei; beide landen daher als
 * @font-face derselben Familie. Der Browser prüft die zuletzt
 * deklarierte Datei zuerst und greift für fehlende Zeichen auf die
 * nächste zurück — deshalb steht latin-ext vorne und latin hinten.
 * Reiner deutscher Text kommt so mit der latin-Datei aus.
 */
import localFont from 'next/font/local';

export const geistSans = localFont({
  variable: '--font-oe-sans',
  src: [
    { path: './fonts/files/geist-latin-ext-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: './fonts/files/geist-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  display: 'swap',
  // Metrisch an Arial angeglichener Platzhalter, bis Geist geladen ist.
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
});

/* Für eine Monospace-Schrift ergibt ein auf Arial skalierter Platzhalter
   keinen Sinn — hier springt die System-Monospace ein. */
export const jetbrainsMono = localFont({
  variable: '--font-oe-mono',
  src: [
    { path: './fonts/files/jetbrains-mono-latin-ext-wght-normal.woff2', weight: '100 800', style: 'normal' },
    { path: './fonts/files/jetbrains-mono-latin-wght-normal.woff2', weight: '100 800', style: 'normal' },
  ],
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
});

/**
 * @deprecated Seit 0.3.3 ist die Display-Schrift Geist. Bleibt als
 * Alias auf `geistSans` erhalten, damit bestehende Importe weiter
 * funktionieren.
 */
export const bricolageDisplay = geistSans;

/** Beide Schrift-Variablen in einem className. */
export const openEosFonts = {
  className: [geistSans.variable, jetbrainsMono.variable].join(' '),
  sans: geistSans,
  /** Display = Geist (Gewicht 800 setzt .oe-display). */
  display: geistSans,
  mono: jetbrainsMono,
} as const;
