// Verhalten im DOM (jsdom): Tooltip öffnen/schließen, Zeilenklick,
// Aktionen stoppen die Weitergabe.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });

const { createElement: h, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { DataTable, IconButton, Tooltip } = await import('../dist/index.js');

const tick = (ms = 0) => act(() => new Promise((r) => setTimeout(r, ms)));
const Pointer = window.PointerEvent ?? window.MouseEvent;
const fire = (el, type, init = {}) => act(() => {
  el.dispatchEvent(new Pointer(type, { bubbles: true, cancelable: true, ...init }));
});

function mount(element) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(element));
  return { host, unmount: () => act(() => root.unmount()) };
}

test('Tooltip: Hover öffnet nach Verzögerung im Portal, Verlassen schließt', async () => {
  const { host, unmount } = mount(h(IconButton, { icon: 'edit', label: 'Bearbeiten' }));
  const btn = host.querySelector('button');
  assert.equal(document.querySelector('[role="tooltip"]'), null);
  fire(btn, 'pointerover', { pointerType: 'mouse' });
  await tick(50);
  assert.equal(document.querySelector('[role="tooltip"]'), null, 'noch nicht nach 50 ms');
  await tick(320);
  const tip = document.querySelector('[role="tooltip"]');
  assert.ok(tip, 'offen nach 300 ms');
  assert.equal(tip.textContent, 'Bearbeiten');
  assert.equal(tip.parentElement, document.body);
  assert.match(tip.className, /oe-tip__bubble oe-tip__bubble--float oe-tip__bubble--(top|bottom)/);
  assert.equal(btn.getAttribute('aria-describedby'), tip.id);
  fire(btn, 'pointerout', { pointerType: 'mouse' });
  assert.equal(document.querySelector('[role="tooltip"]'), null);
  assert.equal(btn.getAttribute('aria-describedby'), null);
  unmount();
});

test('Tooltip: Fokus öffnet sofort, Escape und Blur schließen; eigener Handler bleibt', async () => {
  let focused = 0;
  const { host, unmount } = mount(
    h(Tooltip, { label: 'Hilfe', placement: 'bottom' }, h('button', { onFocus: () => focused++ }, 'x')),
  );
  const btn = host.querySelector('button');
  act(() => btn.focus());
  assert.equal(focused, 1);
  assert.ok(document.querySelector('[role="tooltip"]'));
  act(() => {
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  });
  assert.equal(document.querySelector('[role="tooltip"]'), null);
  act(() => btn.focus());
  act(() => btn.blur());
  assert.equal(document.querySelector('[role="tooltip"]'), null);
  unmount();
});

test('Tooltip: Klick mit Maus schließt, disabled öffnet nicht', async () => {
  const { host, unmount } = mount(h(IconButton, { icon: 'edit', label: 'Bearbeiten', disabled: false }));
  const btn = host.querySelector('button');
  fire(btn, 'pointerover', { pointerType: 'mouse' });
  await tick(320);
  assert.ok(document.querySelector('[role="tooltip"]'));
  fire(btn, 'pointerdown', { pointerType: 'mouse' });
  assert.equal(document.querySelector('[role="tooltip"]'), null);
  unmount();
  const off = mount(h(Tooltip, { label: 'x', disabled: true }, h('button', null, 'y')));
  fire(off.host.querySelector('button'), 'pointerover', { pointerType: 'mouse' });
  await tick(320);
  assert.equal(document.querySelector('[role="tooltip"]'), null);
  off.unmount();
});

test('DataTable: Zeilenklick, Enter, Aktionen ohne Weitergabe, Dropdown mit Texten', async () => {
  const clicked = [];
  const acted = [];
  const rows = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
  const { host, unmount } = mount(
    h(DataTable, {
      rows,
      rowKey: 'id',
      caption: 'x',
      columns: [{ id: 'name', header: 'Name', cell: (r) => h('a', { href: '/' + r.id }, r.name) }],
      actions: (r) => [
        { id: 'edit', label: 'Bearbeiten', icon: 'edit', onClick: () => acted.push('edit:' + r.id) },
        { id: 'del', label: 'Löschen', icon: 'trash', danger: true, onClick: () => acted.push('del:' + r.id) },
        { id: 'copy', label: 'Kopie', icon: 'copy', onClick: () => acted.push('copy:' + r.id) },
      ],
      onRowClick: (r) => clicked.push(r.id),
    }),
  );
  const trs = host.querySelectorAll('tbody tr');
  assert.equal(trs.length, 2);
  act(() => trs[0].querySelector('td').click());
  assert.deepEqual(clicked, ['1']);
  // Link in der Zelle: kein Zeilenklick
  act(() => trs[1].querySelector('a').click());
  assert.deepEqual(clicked, ['1']);
  // Enter auf der fokussierten Zeile
  act(() => trs[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
  assert.deepEqual(clicked, ['1', '2']);
  // Inline-Aktion: Handler läuft, Zeile nicht
  act(() => trs[0].querySelector('[data-action="edit"]').click());
  assert.deepEqual(acted, ['edit:1']);
  assert.deepEqual(clicked, ['1', '2']);
  // ⋯ öffnet Menü mit allen drei Texten; Auswahl schließt, Zeile bleibt unberührt
  const more = trs[0].querySelector('.oe-dt__more > button');
  assert.equal(more.getAttribute('aria-label'), 'Weitere Aktionen');
  act(() => more.click());
  const menu = trs[0].querySelector('[role="menu"]');
  assert.ok(trs[0].querySelector('.oe-dd').classList.contains('is-open'));
  assert.deepEqual([...menu.querySelectorAll('[role="menuitem"]')].map((e) => e.textContent), ['Bearbeiten', 'Löschen', 'Kopie']);
  act(() => menu.querySelector('[data-action="copy"]').click());
  assert.deepEqual(acted, ['edit:1', 'copy:1']);
  assert.deepEqual(clicked, ['1', '2']);
  assert.ok(!trs[0].querySelector('.oe-dd').classList.contains('is-open'));
  unmount();
});
