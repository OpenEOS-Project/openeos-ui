// Icon-Set: Vollständigkeit von Gruppen, Suchwörtern und Mapping (gegen dist).
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { test } from 'node:test';
import {
  ICON_NODES,
  LEGACY_FALLBACK_ICON,
  iconGroups,
  iconKeywords,
  iconNames,
  iconSvg,
  isIconName,
  legacyIcon,
  legacyIconMap,
} from '../dist/icons/index.js';

const files = readdirSync(new URL('../src/icons/svg/', import.meta.url)).map((f) => f.replace(/\.svg$/, ''));

test('89 Icons: 77 aus dem Entwurf + 12 neue, Namen eindeutig', () => {
  assert.equal(iconNames.length, 89);
  assert.equal(new Set(iconNames).size, iconNames.length);
  assert.deepEqual([...iconNames].sort(), [...files].sort());
  for (const name of ['map', 'history', 'undo', 'copy', 'rotate', 'table-round', 'stage', 'wall', 'text', 'zoom-in', 'zoom-out', 'drawer']) {
    assert.ok(isIconName(name), name);
  }
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

test('Mapping zeigt nur auf vorhandene Icons', () => {
  for (const [key, target] of Object.entries(legacyIconMap)) assert.ok(isIconName(target), `${key} → ${target}`);
  assert.equal(legacyIcon('pos-icon:pommes'), 'fries');
  assert.equal(legacyIcon('pos-icon:pils'), 'beer');
  assert.equal(legacyIcon('pos-icon:wasser'), 'water');
  assert.equal(legacyIcon('pos-icon:apfelschorle'), 'bottle');
  assert.equal(legacyIcon('pos-icon:currywurst'), 'sausage');
  assert.equal(legacyIcon('\u{1F37A}'), 'beer');
  assert.equal(legacyIcon('\u{1F37D}️'), 'utensils', 'Variantenselektor wird ignoriert');
  assert.equal(legacyIcon('☕'), 'coffee');
  assert.equal(legacyIcon('\u{1F35F}'), 'fries');
  assert.equal(legacyIcon('unbekannt'), undefined);
  assert.equal(legacyIcon(null), undefined);
  assert.equal(LEGACY_FALLBACK_ICON, 'utensils');
});

test('iconSvg liefert dekoratives SVG im Stil des Sets', () => {
  const svg = iconSvg('beer', 20);
  assert.match(svg, /^<svg class="oe-icon"/);
  assert.match(svg, /stroke-width="1.8"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /--oe-ico:20px/);
  assert.equal((svg.match(/<path/g) ?? []).length, ICON_NODES.beer.length);
});
