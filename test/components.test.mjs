// Markup-Stichproben der React-Komponenten (Server-Rendering gegen dist):
// Klassen, Zugänglichkeit, keine Unicode-Symbole.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  CartLine,
  ChoiceGroup,
  FloorPlan,
  Icon,
  IconBox,
  Keypad,
  Receipt,
  Segment,
  StatusPill,
  Stepper,
  TableChip,
  TableGrid,
  TableMap,
  Tile,
  UserChip,
} from '../dist/index.js';

const render = (element) => renderToStaticMarkup(element);
/* Pfeile, Kreuze, Haken, Rücktaste, Auslassungspunkte, Emojis */
const SYMBOLS = /[←-⇿⌀-⏿✀-➿…×−✕✓⌫▾\u{1F300}-\u{1FAFF}]/u;
const noSymbols = (html) => assert.doesNotMatch(html, SYMBOLS);

test('Icon: dekorativ ohne Label, role=img mit Label', () => {
  assert.match(render(h(Icon, { name: 'beer' })), /aria-hidden="true"/);
  const labeled = render(h(Icon, { name: 'lock', label: 'Sperren', size: 20, filled: true }));
  assert.match(labeled, /role="img"/);
  assert.match(labeled, /aria-label="Sperren"/);
  assert.match(labeled, /--oe-ico:20px/);
  assert.match(labeled, /oe-icon--filled/);
});

test('Keypad: Standardtasten mit Icons statt Zeichen', () => {
  const html = render(h(Keypad, { onKey() {}, size: 'lg', disabledKeys: ['enter'] }));
  noSymbols(html);
  assert.match(html, /class="oe-keypad oe-keypad--lg"/);
  assert.match(html, /aria-label="Löschen"/);
  assert.match(html, /class="is-accent" aria-label="Bestätigen" disabled=""/);
  assert.equal((html.match(/<button/g) ?? []).length, 12);
});

test('Tile product: Icon-Box, Menge, Preis, Hinweise', () => {
  const html = render(
    h(Tile, { variant: 'product', name: 'Pils', sub: '0,5 l', price: '4,50 €', qty: 2, inCart: true, icon: h(Icon, { name: 'beer' }), hints: h(Icon, { name: 'sliders' }) }),
  );
  assert.match(html, /class="oe-tile oe-tile--product is-in"/);
  assert.match(html, /<span class="oe-tile__qty">2<\/span>/);
  assert.match(html, /<span class="oe-tile__price">4,50 €<\/span>/);
  assert.doesNotMatch(render(h(Tile, { variant: 'product', name: 'Wasser', qty: 0, icon: 'x' })), /oe-tile__qty/);
});

test('Tile simple bleibt kompatibel', () => {
  assert.equal(render(h(Tile, { name: 'Pils', meta: '4,50 €', light: true })), '<button type="button" class="oe-tile oe-tile--light"><b>Pils</b><span>4,50 €</span></button>');
});

test('TableChip und TableGrid', () => {
  assert.match(render(h(TableChip, { label: 'A03', state: 'free', size: 'lg', current: true, hint: 'frei' })), /class="oe-tablechip oe-tablechip--lg is-current"/);
  assert.match(render(h(TableChip, { label: 'A07', state: 'wait' })), /oe-tablechip--wait/);
  assert.match(render(h(TableGrid, { min: 104 })), /--oe-tables-min:104px/);
  assert.equal(TableMap, TableGrid);
});

test('Stepper: Papierkorb bei removeAtMin', () => {
  const html = render(h(Stepper, { value: 1, onIncrement() {}, onDecrement() {}, removeAtMin: true }));
  assert.match(html, /aria-label="Entfernen"/);
  assert.match(html, /class="oe-stepper__val"[^>]*>1</);
  assert.match(render(h(Stepper, { value: 2, onIncrement() {}, onDecrement() {}, removeAtMin: true })), /aria-label="Weniger"/);
});

test('Segment mit Icon, ChoiceGroup als radiogroup', () => {
  const seg = render(h(Segment, { value: 'a', onChange() {}, size: 'lg', options: [{ id: 'a', label: 'Nummer', icon: 'grid' }, { id: 'b', label: 'Karte', icon: 'map', disabled: true }] }));
  assert.match(seg, /oe-segment--lg/);
  assert.match(seg, /<svg[^>]*class="oe-icon"/);
  const choices = render(h(ChoiceGroup, { value: 'cash', onChange() {}, 'aria-label': 'Zahlart', options: [{ id: 'cash', label: 'Bar', icon: 'cash' }, { id: 'card', label: 'Karte', icon: 'contactless' }] }));
  assert.match(choices, /role="radiogroup"/);
  assert.match(choices, /role="radio" aria-checked="true" tabindex="0"/);
  assert.match(choices, /role="radio" aria-checked="false" tabindex="-1"/);
});

test('IconBox, CartLine, StatusPill, UserChip', () => {
  assert.match(render(h(IconBox, { icon: 'cart', tone: 'accent', badge: 3 })), /oe-icobox oe-icobox--accent[\s\S]*oe-icobox__badge">3</);
  assert.doesNotMatch(render(h(IconBox, { icon: 'cart', badge: 0 })), /badge/);
  /* Eigene Akzentfarbe geht vor tone und kommt als CSS-Variable. */
  const tinted = render(h(IconBox, { icon: 'tag', tone: 'accent', accent: '#ec4899' }));
  assert.match(tinted, /class="oe-icobox oe-icobox--tint"/);
  assert.match(tinted, /--oe-icobox-accent:#ec4899/);
  assert.doesNotMatch(render(h(IconBox, { icon: 'tag', accent: null })), /tint|style=/);
  assert.match(render(h(CartLine, { name: 'Pils', total: '9,00 €', qtyText: '2 Stk.', sent: 'gesendet' })), /^<li class="oe-cartline is-sent">/);
  assert.match(render(h(StatusPill, { dot: 'live', label: 'Online', hideLabel: true })), /class="oe-sr-only">Online</);
  const chip = render(h(UserChip, { name: 'Anna B.', onLock() {} }));
  assert.match(chip, />AB</);
  assert.match(chip, /aria-label="Kasse sperren"/);
});

test('Receipt: Preis-Spalte und Hinweiszeile', () => {
  const html = render(h(Receipt, { title: 'OpenEOS', lines: [{ qty: '2', name: 'Pils', price: '4,50', total: '9,00' }], sum: '9,00 €', note: 'TESTBON' }));
  assert.match(html, /<li class="has-price">/);
  assert.match(html, /oe-receipt__note">TESTBON</);
});

test('FloorPlan: Lage nur über CSS-Variablen, Zustände als Klassen', () => {
  const tables = [
    { id: 't1', label: 'A01', shape: 'rect', x: 60, y: 40, width: 80, height: 80, rotation: 0, seats: 4, state: 'busy', hint: '24,10 €' },
    { id: 't2', label: 'A02', shape: 'round', x: 600, y: 400, width: 100, height: 100, rotation: 45, state: 'wait' },
  ];
  const decor = [{ id: 'd1', type: 'bar', x: 0, y: 700, width: 400, height: 80, rotation: 0, label: 'Theke' }];
  const view = render(h(FloorPlan, { width: 1200, height: 800, tables, decor, currentId: 't2' }));
  assert.match(view, /--oe-floor-w:1200;--oe-floor-h:800/);
  assert.match(view, /--oe-floor-min-w:600px/);
  assert.match(view, /class="oe-floor__table oe-floor__table--busy" style="--x:5%;--y:5%;--w:6.6667%;--h:10%;--r:0deg"/);
  assert.match(view, /oe-floor__table--round oe-floor__table--wait is-current/);
  assert.match(view, /aria-label="Tisch A01, 4 Plätze"/);
  assert.match(view, /class="oe-floor__decor oe-floor__decor--bar"[^>]*aria-hidden="true">Theke</);
  assert.doesNotMatch(view, /oe-floor--grid/);
  const edit = render(h(FloorPlan, { width: 1200, height: 800, tables, decor, mode: 'edit', selectedId: 't1' }));
  assert.match(edit, /class="oe-floor oe-floor--edit oe-floor--grid"/);
  assert.match(edit, /role="button" tabindex="0" aria-pressed="true"/);
  assert.match(edit, /oe-floor__handle/);
  noSymbols(view + edit);
});

test('FloorPlan 0.6: Umriss, Zonen, Wände, Warnungen, Werkzeuge', () => {
  const tables = [
    { id: 't1', label: 'A01', shape: 'rect', x: 900, y: 100, width: 80, height: 80, rotation: 0 },
    { id: 't2', label: 'A02', shape: 'rect', x: 120, y: 520, width: 80, height: 80, rotation: 0 },
    { id: 't3', label: 'A03', shape: 'rect', x: 300, y: 300, width: 80, height: 80, rotation: 0 },
  ];
  const outline = [{ x: 0, y: 0 }, { x: 600, y: 0 }, { x: 600, y: 400 }, { x: 1200, y: 400 }, { x: 1200, y: 800 }, { x: 0, y: 800 }];
  const zones = [
    { id: 'z1', zoneType: 'kitchen', points: [{ x: 0, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 200 }, { x: 0, y: 200 }] },
    { id: 'z2', zoneType: 'blocked', label: 'Notausgang', points: [{ x: 100, y: 500 }, { x: 300, y: 500 }, { x: 300, y: 700 }] },
  ];
  const walls = [{ id: 'w1', points: [{ x: 0, y: 0 }, { x: 600, y: 0 }, { x: 600, y: 400 }], thickness: 12 }];
  const view = render(h(FloorPlan, { width: 1200, height: 800, tables, outline, zones, walls }));
  assert.match(view, /<svg class="oe-floor__svg" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true"/);
  assert.match(view, /class="oe-floor__outside" d="M0 0H1200V800H0Z M0 0 L600 0 L600 400 L1200 400 L1200 800 L0 800Z" fill-rule="evenodd"/);
  assert.match(view, /class="oe-floor__zone oe-floor__zone--kitchen"/);
  assert.match(view, /class="oe-floor__zone oe-floor__zone--blocked"[\s\S]*oe-floor__zone-hatch/);
  assert.match(view, /oe-floor__wall-line" points="0,0 600,0 600,400" stroke-width="12"/);
  assert.match(view, /oe-floor__zonelabel oe-floor__zonelabel--kitchen" style="--x:8.3333%;--y:12.5%"[^>]*><svg[^>]*>[\s\S]*?<span>Küche</);
  assert.match(view, />Notausgang</);
  assert.doesNotMatch(view, /has-issue/, 'Warnungen nur im Bearbeitungsmodus');
  assert.doesNotMatch(view, /role="button"/, 'Zonen und Wände sind in der Ansicht nicht anklickbar');

  const edit = render(h(FloorPlan, { width: 1200, height: 800, tables, outline, zones, walls, mode: 'edit', selectedId: 'z2' }));
  assert.match(edit, /oe-floor__table has-issue is-outside"[^>]*aria-label="Tisch A01, außerhalb des Raums"/);
  assert.match(edit, /oe-floor__table has-issue is-blocked"[^>]*aria-label="Tisch A02, im gesperrten Bereich"/);
  assert.match(edit, /aria-label="Tisch A03" role="button"/);
  assert.match(edit, /oe-floor__zone-fill"[^>]*role="button" tabindex="0" aria-label="Gesperrt: Notausgang" aria-pressed="true"/);
  assert.match(edit, /oe-floor__wall-hit"[^>]*aria-label="Wand"/);
  assert.equal((edit.match(/class="oe-floor__point"/g) || []).length, 3, 'drei Punktgriffe der gewählten Zone');
  assert.equal((edit.match(/oe-floor__point--add/g) || []).length, 3, 'drei Kantenmitten (geschlossen)');

  const draw = render(h(FloorPlan, { width: 1200, height: 800, tables, mode: 'edit', tool: 'wall' }));
  assert.match(draw, /class="oe-floor oe-floor--edit oe-floor--grid oe-floor--tool-wall"/);
  assert.match(draw, /oe-floor__toolbar[\s\S]*Wand zeichnen[\s\S]*Fertig/);
  assert.match(draw, /<button type="button" class="oe-btn oe-btn--sm oe-btn--primary" disabled="">/, 'Fertig erst ab zwei Punkten');

  const shape = render(h(FloorPlan, { width: 1200, height: 800, tables: [], mode: 'edit', tool: 'outline' }));
  assert.match(shape, /oe-floor__room is-editing/);
  assert.equal((shape.match(/class="oe-floor__point"/g) || []).length, 4, 'ohne Umriss: Rechteck mit vier Ecken');
  assert.match(shape, /aria-label="Punkt 4"/);
  noSymbols(view + edit + draw + shape);
});

test('Sheet: Wischen schließt ab Schwelle oder schnellem Wisch, sonst Rückfedern', async () => {
  const { swipeShouldClose } = await import('../dist/index.js');
  // Weg: ab 120 px bzw. 35 % eines niedrigen Blatts
  assert.equal(swipeShouldClose(130, 0, 800), true);
  assert.equal(swipeShouldClose(100, 0, 800), false);
  assert.equal(swipeShouldClose(75, 0, 200), true);
  // Schneller Wisch mit etwas Weg
  assert.equal(swipeShouldClose(40, 0.8, 800), true);
  assert.equal(swipeShouldClose(10, 2, 800), false);
  // Nach oben oder gar nicht gezogen
  assert.equal(swipeShouldClose(0, 3, 800), false);
});
