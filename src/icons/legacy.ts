import type { IconName } from './generated';

/**
 * Altbestand (Emoji) → OpenEOS-Icon.
 *
 * Kategorien speicherten ihr Icon früher als Emoji. Neue Daten verwenden
 * `oe:<name>`; alte Emojis werden über diese Tabelle weiter als Linien-Icon
 * dargestellt, ohne die Daten anzufassen. Was hier fehlt, zeigt die
 * Anwendung als `utensils` (siehe `LEGACY_FALLBACK_ICON`).
 *
 * Seit 0.5.0 stehen hier keine `pos-icon:<id>`-Werte mehr: Produkt-Icons
 * aus @openeos/pos-icons sind Bilder und werden als Bild gezeigt, nicht
 * auf ein Linien-Icon abgebildet (README, „Migration 0.4 → 0.5“).
 *
 * Die Emojis stehen nur als Schlüssel in Daten, nie im Markup.
 */
export const legacyIconMap: Readonly<Record<string, IconName>> = {
  /* Emojis aus Kategorie-Icons (ohne Variantenselektor U+FE0F) */
  '\u{1F37A}': 'beer', // Bierkrug
  '\u{1F37B}': 'beer', // anstoßende Bierkrüge
  '\u{1F377}': 'wine', // Weinglas
  '\u{1F942}': 'wine', // Sektgläser
  '\u{1F37E}': 'bottle', // Flasche mit Korken
  '\u{1F943}': 'shot', // Whiskyglas
  '\u{1F964}': 'soda', // Becher mit Strohhalm
  '\u{1F9C3}': 'soda', // Trinkpäckchen
  '\u{1F4A7}': 'water', // Tropfen
  '\u{1F6B0}': 'water', // Trinkwasser
  '☕': 'coffee', // Heißgetränk
  '\u{1F375}': 'coffee', // Teetasse
  '\u{1F370}': 'cake', // Kuchenstück
  '\u{1F9C1}': 'cake', // Cupcake
  '\u{1F382}': 'cake', // Geburtstagstorte
  '\u{1F369}': 'cake', // Donut
  '\u{1F36A}': 'cake', // Keks
  '\u{1F95E}': 'cake', // Pfannkuchen
  '\u{1F32D}': 'sausage', // Hotdog
  '\u{1F35E}': 'bread', // Brot
  '\u{1F968}': 'bread', // Brezel
  '\u{1F956}': 'bread', // Baguette
  '\u{1F354}': 'bread', // Hamburger
  '\u{1F96A}': 'bread', // Sandwich
  '\u{1F35F}': 'fries', // Pommes
  '\u{1F366}': 'icecream', // Softeis
  '\u{1F368}': 'icecream', // Eiscreme
  '\u{1F367}': 'icecream', // Wassereis
  '\u{1F37D}': 'utensils', // Teller mit Besteck
  '\u{1F374}': 'utensils', // Gabel und Messer
  '\u{1F355}': 'utensils', // Pizza
  '\u{1F525}': 'flame', // Feuer
  '\u{1F969}': 'flame', // Fleischstück
  '\u{1F356}': 'flame', // Fleisch am Knochen
  '\u{1F357}': 'flame', // Geflügelkeule
  '\u{1F957}': 'leaf', // Salat
  '\u{1F966}': 'leaf', // Brokkoli
  '\u{1F331}': 'leaf', // Keimling
  '♻': 'deposit', // Recycling
  '\u{1F3F7}': 'tag', // Etikett
  '⭐': 'star', // Stern
};

/** Anzeige-Icon, wenn weder `oe:`-Wert noch Mapping greifen. */
export const LEGACY_FALLBACK_ICON: IconName = 'utensils';

/**
 * Sucht einen Altwert (Emoji) in `legacyIconMap`. Liefert `undefined`,
 * wenn nichts passt — auch für `pos-icon:<id>` (seit 0.5.0); die
 * Anwendung entscheidet, ob sie dann ein Foto, ein POS-Icon-Bild oder
 * `LEGACY_FALLBACK_ICON` zeigt.
 */
export function legacyIcon(value: string | null | undefined): IconName | undefined {
  if (!value) return undefined;
  const key = value.trim().replace(/️/g, '');
  return legacyIconMap[key] ?? legacyIconMap[key.toLowerCase()];
}
