// Icon-Set: Herkunft (Lucide), Vollständigkeit von Gruppen und Suchwörtern,
// Emoji-Mapping (gegen dist).
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import {
  ICON_NODES,
  ICON_STROKE_WIDTH,
  LEGACY_FALLBACK_ICON,
  LUCIDE_VERSION,
  iconGroups,
  iconKeywords,
  iconNames,
  iconSources,
  iconSvg,
  isIconName,
  legacyIcon,
  legacyIconMap,
} from '../dist/icons/index.js';

const svgDir = new URL('../src/icons/svg/', import.meta.url);
const files = readdirSync(svgDir).map((f) => f.replace(/\.svg$/, ''));
const mapping = JSON.parse(readFileSync(new URL('../src/icons/lucide.json', import.meta.url), 'utf8'));

test('93 Icons (die 89 aus 0.4 plus sun, moon, monitor, menu), Namen eindeutig', () => {
  assert.equal(iconNames.length, 93);
  assert.equal(new Set(iconNames).size, iconNames.length);
  assert.deepEqual([...iconNames].sort(), [...files].sort());
  for (const name of ['cart', 'table', 'table-round', 'map', 'beer', 'wine', 'coffee', 'cake', 'icecream', 'utensils', 'soda', 'water']) {
    assert.ok(isIconName(name), name);
  }
});

test('jedes Icon stammt aus Lucide', () => {
  assert.match(LUCIDE_VERSION, /^\d+\.\d+\.\d+$/);
  assert.deepEqual(Object.keys(iconSources).sort(), [...iconNames].sort());
  assert.deepEqual(iconSources, mapping);
  assert.equal(iconSources.cart, 'shopping-cart');
  assert.equal(iconSources.cake, 'cake-slice');
  assert.equal(iconSources.icecream, 'ice-cream-cone');
  assert.equal(iconSources.soda, 'cup-soda');
  assert.equal(iconSources.water, 'glass-water');
  for (const name of iconNames) {
    const svg = readFileSync(new URL(`${name}.svg`, svgDir), 'utf8');
    assert.ok(svg.startsWith(`<!-- Lucide "${iconSources[name]}" (lucide-static ${LUCIDE_VERSION}, ISC`), name);
    assert.ok(ICON_NODES[name].length > 0, name);
  }
});

test('Lizenz: nur Lucide, kein Tabler mehr', () => {
  const licenses = readdirSync(new URL('../src/icons/', import.meta.url)).filter((f) => f.startsWith('LICENSE'));
  assert.deepEqual(licenses, ['LICENSE-lucide.txt']);
  assert.match(readFileSync(new URL('../src/icons/LICENSE-lucide.txt', import.meta.url), 'utf8'), /^ISC License/);
});

test('jedes Icon steht in genau einer Gruppe', () => {
  const grouped = Object.values(iconGroups).flat();
  assert.equal(grouped.length, iconNames.length);
  assert.deepEqual([...grouped].sort(), [...iconNames].sort());
});

test('jedes Icon hat de- und en-Suchwörter', () => {
  assert.deepEqual(Object.keys(iconKeywords).sort(), [...iconNames].sort());
  for (const [name, words] of Object.entries(iconKeywords)) {
    assert.ok(words.de.length > 0 && words.en.length > 0, name);
    for (const word of [...words.de, ...words.en]) assert.equal(word, word.toLowerCase(), `${name}: ${word}`);
  }
});

test('Emoji-Mapping zeigt nur auf vorhandene Icons, pos-icon-Werte nicht mehr', () => {
  for (const [key, target] of Object.entries(legacyIconMap)) {
    assert.ok(isIconName(target), `${key} → ${target}`);
    assert.ok(!key.startsWith('pos-icon:'), key);
  }
  assert.equal(legacyIcon('\u{1F37A}'), 'beer');
  assert.equal(legacyIcon('\u{1F37D}️'), 'utensils', 'Variantenselektor wird ignoriert');
  assert.equal(legacyIcon('☕'), 'coffee');
  assert.equal(legacyIcon('\u{1F35F}'), 'fries');
  assert.equal(legacyIcon('pos-icon:pils'), undefined, 'Produkt-Icons sind Bilder (0.5.0)');
  assert.equal(legacyIcon('unbekannt'), undefined);
  assert.equal(legacyIcon(null), undefined);
  assert.equal(LEGACY_FALLBACK_ICON, 'utensils');
});

test('iconSvg liefert dekoratives SVG im Stil des Sets', () => {
  assert.equal(ICON_STROKE_WIDTH, 1.8);
  const svg = iconSvg('beer', 20);
  assert.match(svg, /^<svg class="oe-icon"/);
  assert.match(svg, /stroke-width="1.8"/);
  assert.match(svg, /stroke="currentColor"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /--oe-ico:20px/);
  assert.equal((svg.match(/<path/g) ?? []).length, ICON_NODES.beer.length);
  assert.match(iconSvg('card'), /<line x1="2" x2="22" y1="10" y2="10"\/>/);
});
