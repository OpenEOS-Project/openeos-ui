import type { IconName } from './generated';

/**
 * Altbestand → OpenEOS-Icon.
 *
 * Produkte und Kategorien speichern ihr Bild bisher als
 * `pos-icon:<id>` (PNG aus @openeos/pos-icons) oder als Emoji. Neue
 * Daten verwenden `oe:<name>`; alte Werte werden über diese Tabelle
 * weiter dargestellt, ohne die Daten anzufassen. Was hier fehlt, zeigt
 * die Anwendung als `utensils` (siehe `LEGACY_FALLBACK_ICON`).
 *
 * Die Emojis stehen nur als Schlüssel in Daten, nie im Markup.
 */
export const legacyIconMap: Readonly<Record<string, IconName>> = {
  /* @openeos/pos-icons (0.4.0) */
  'pos-icon:almdudler': 'soda',
  'pos-icon:almdudler-flasche': 'bottle',
  'pos-icon:apfelschorle': 'bottle',
  'pos-icon:apfelschorle-flasche': 'bottle',
  'pos-icon:baconburger': 'bread',
  'pos-icon:cola': 'soda',
  'pos-icon:cola-flasche': 'bottle',
  'pos-icon:cola-zero': 'soda',
  'pos-icon:cola-zero-flasche': 'bottle',
  'pos-icon:crepes-nutella': 'cake',
  'pos-icon:crepes-puderzucker': 'cake',
  'pos-icon:currywurst': 'sausage',
  'pos-icon:currywurst-brot': 'sausage',
  'pos-icon:currywurst-pommes': 'sausage',
  'pos-icon:double-fire-burger': 'bread',
  'pos-icon:eistee': 'soda',
  'pos-icon:eistee-flasche': 'bottle',
  'pos-icon:gedeck': 'wine',
  'pos-icon:grillwurst': 'sausage',
  'pos-icon:grillwurst-brot': 'sausage',
  'pos-icon:grillwurst-pommes': 'sausage',
  'pos-icon:hamburger': 'bread',
  'pos-icon:johannisbeerschorle': 'bottle',
  'pos-icon:johannisbeerschorle-flasche': 'bottle',
  'pos-icon:limo-orange': 'soda',
  'pos-icon:limo-orange-flasche': 'bottle',
  'pos-icon:limo-zitrone': 'soda',
  'pos-icon:limo-zitrone-flasche': 'bottle',
  'pos-icon:pils': 'beer',
  'pos-icon:pils-flasche': 'bottle',
  'pos-icon:pommes': 'fries',
  'pos-icon:radler': 'beer',
  'pos-icon:radler-flasche': 'bottle',
  'pos-icon:rotwein': 'wine',
  'pos-icon:spezi': 'soda',
  'pos-icon:spezi-flasche': 'bottle',
  'pos-icon:steak': 'flame',
  'pos-icon:steak-brot': 'flame',
  'pos-icon:steak-pommes': 'flame',
  'pos-icon:striebele': 'cake',
  'pos-icon:wasser': 'water',
  'pos-icon:wasser-flasche': 'bottle',
  'pos-icon:wein': 'wine',
  'pos-icon:weinschorle': 'wine',
  'pos-icon:weinschorle-rot': 'wine',
  'pos-icon:weinschorle-weiss': 'wine',
  'pos-icon:weisswein': 'wine',

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
 * Sucht einen Altwert (`pos-icon:<id>` oder Emoji) in `legacyIconMap`.
 * Liefert `undefined`, wenn nichts passt — die Anwendung entscheidet,
 * ob sie dann ein Foto, ein PNG oder `LEGACY_FALLBACK_ICON` zeigt.
 */
export function legacyIcon(value: string | null | undefined): IconName | undefined {
  if (!value) return undefined;
  const key = value.trim().replace(/️/g, '');
  return legacyIconMap[key] ?? legacyIconMap[key.toLowerCase()];
}
