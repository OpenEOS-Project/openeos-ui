// Lage des Dropdown-Panels (jsdom): senkrechtes Abschneiden durch Vorfahren.
// jsdom rechnet kein Layout — Rechtecke, Panelgrößen und der Überlauf
// werden hier je Element vorgegeben.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
const { window } = dom;
globalThis.window = window;
globalThis.document = window.document;
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true, writable: true });
globalThis.HTMLElement = window.HTMLElement;
globalThis.Node = window.Node;
globalThis.MutationObserver = window.MutationObserver;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/* Viewport 1024 × 768. */
Object.defineProperty(window.document.documentElement, 'clientWidth', { configurable: true, get: () => 1024 });
Object.defineProperty(window, 'innerHeight', { configurable: true, get: () => 768 });

/* jsdom kennt weder den Standardwert "visible" noch die Kurzform `overflow`. */
const cs = window.getComputedStyle.bind(window);
globalThis.getComputedStyle = window.getComputedStyle = (el) => {
  const s = cs(el);
  return {
    direction: s.direction || 'ltr',
    overflowX: el.style?.overflowX || 'visible',
    overflowY: el.style?.overflowY || 'visible',
  };
};

/** Vorgegebene Rechtecke [left, top, right, bottom] und Panelgrößen [w, h]. */
const rects = new WeakMap();
const sizes = new WeakMap();
const proto = window.HTMLElement.prototype;
proto.getBoundingClientRect = function () {
  const [left, top, right, bottom] = rects.get(this) ?? [0, 0, 1024, 768];
  return { left, top, right, bottom, width: right - left, height: bottom - top, x: left, y: top };
};
Object.defineProperty(proto, 'offsetWidth', { configurable: true, get() { return (sizes.get(this) ?? [0, 0])[0]; } });
Object.defineProperty(proto, 'offsetHeight', { configurable: true, get() { return (sizes.get(this) ?? [0, 0])[1]; } });

const { createElement: h, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { Dropdown, DropdownOption, Tooltip } = await import('../dist/index.js');

/** Höchsthöhe des Panels aus dem letzten `openIn` ('' = keine). */
let lastMaxHeight = '';

/**
 * Dropdown in einer Karte. `card` ist deren Rechteck, `trigger` das des
 * Auslösers, `panel` die Panelhöhe; `overflowY` der senkrechte Überlauf der Karte.
 */
function openIn({ card, trigger, panel = 120, overflowX = 'hidden', overflowY = 'hidden', placement }) {
  const host = document.createElement('div');
  host.style.overflowX = overflowX;
  host.style.overflowY = overflowY;
  rects.set(host, card);
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() =>
    root.render(
      h(
        Dropdown,
        { label: 'Aktionen', align: 'end', placement },
        h(DropdownOption, null, 'Eins'),
        h(DropdownOption, null, 'Zwei'),
      ),
    ),
  );
  const wrap = host.querySelector('.oe-dd');
  rects.set(wrap, trigger);
  sizes.set(host.querySelector('.oe-dd__panel'), [180, panel]);
  act(() => host.querySelector('.oe-dd__trigger').click());
  const panelEl = host.querySelector('.oe-dd__panel');
  lastMaxHeight = panelEl.style.maxHeight;
  const cls = panelEl.classList;
  const placed = cls.contains('oe-dd__panel--top') ? 'top' : 'bottom';
  act(() => root.unmount());
  host.remove();
  return placed;
}

/* Eine Tabelle mit einer Zeile: Karte 100…300, Zeile ganz unten. Unter der
   Karte wäre im Viewport viel Platz, in der Karte aber nicht. */
const card = [100, 100, 900, 300];
const lastRow = [800, 250, 832, 282];

test('Dropdown: öffnet nach oben, wenn eine Karte (overflow: hidden) unten abschneidet', () => {
  assert.equal(openIn({ card, trigger: lastRow }), 'top');
});

test('Dropdown: overflow-y: clip schneidet genauso ab', () => {
  assert.equal(openIn({ card, trigger: lastRow, overflowX: 'clip', overflowY: 'clip' }), 'top');
});

test('Dropdown: nur waagerecht abschneidend (overflow-x: clip) zählt senkrecht nicht', () => {
  assert.equal(openIn({ card, trigger: lastRow, overflowX: 'clip', overflowY: 'visible' }), 'bottom');
});

test('Dropdown: ohne abschneidende Vorfahren bleibt es unten, solange der Viewport reicht', () => {
  assert.equal(openIn({ card, trigger: lastRow, overflowX: 'visible', overflowY: 'visible' }), 'bottom');
});

test('Dropdown: genug Platz unten in der Karte → unten', () => {
  assert.equal(openIn({ card: [100, 100, 900, 600], trigger: [800, 140, 832, 172] }), 'bottom');
  assert.equal(lastMaxHeight, '', 'passt → keine Begrenzung');
});

test('Dropdown: passt nirgends → die Seite mit mehr Platz', () => {
  // Karte 100…300, Panel 200 hoch: oben 250-5-108 = 137, unten 292-287 = 5 → oben
  assert.equal(openIn({ card, trigger: lastRow, panel: 200 }), 'top');
  // … und auf diesen Platz begrenzt, der Rest scrollt
  assert.equal(lastMaxHeight, '137px');
  // Auslöser oben in der Karte: oben 0, unten mehr → bleibt unten
  assert.equal(openIn({ card, trigger: [800, 110, 832, 142], panel: 200 }), 'bottom');
  // gewünscht oben, oben kaum Platz, unten mehr → unten
  assert.equal(openIn({ card, trigger: [800, 110, 832, 142], panel: 200, placement: 'top' }), 'bottom');
});

test('Dropdown: gewünscht oben bleibt oben, wenn es dort passt', () => {
  assert.equal(openIn({ card, trigger: lastRow, placement: 'top' }), 'top');
});

test('Tooltip im Portal: senkrechter Überlauf der Vorfahren zählt nicht', () => {
  const host = document.createElement('div');
  host.style.overflowX = 'hidden';
  host.style.overflowY = 'hidden';
  rects.set(host, card);
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(h(Tooltip, { label: 'Hilfe', placement: 'bottom' }, h('button', null, 'x'))));
  const btn = host.querySelector('button');
  rects.set(btn, lastRow);
  // Höhe der Blase vorgeben: sie entsteht erst beim Öffnen.
  const tipHeight = Object.getOwnPropertyDescriptor(proto, 'offsetHeight');
  Object.defineProperty(proto, 'offsetHeight', {
    configurable: true,
    get() { return this.getAttribute('role') === 'tooltip' ? 30 : tipHeight.get.call(this); },
  });
  act(() => btn.focus());
  const tip = document.querySelector('[role="tooltip"]');
  assert.ok(tip);
  assert.match(tip.className, /oe-tip__bubble--bottom/);
  Object.defineProperty(proto, 'offsetHeight', tipHeight);
  act(() => root.unmount());
  host.remove();
});
