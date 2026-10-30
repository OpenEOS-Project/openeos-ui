// DataTable, IconButton, DataPager, FilterBar: Server-Markup gegen dist —
// Klassen für Prioritäten und Telefon-Rollen, Aktionen inline/Dropdown,
// ARIA-Rollen und -Namen.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DataPager, DataTable, FilterBar, IconButton, Tooltip, pageItems } from '../dist/index.js';

const render = (element) => renderToStaticMarkup(element);
const SYMBOLS = /[←-⇿⌀-⏿✀-➿…×−✕✓⌫▾·\u{1F300}-\u{1FAFF}]/u;

const rows = [
  { id: 'a1', name: 'Sommerfest', status: 'live', sales: '1.284,50 €', start: '12.06.', note: '' },
  { id: 'b2', name: 'Weihnachtsmarkt', status: 'draft', sales: '0,00 €', start: '01.12.', note: 'Entwurf' },
];
const columns = [
  { id: 'name', header: 'Name', cell: (r) => h('span', { title: r.name }, r.name) },
  { id: 'status', header: 'Status', cell: (r) => r.status, mobile: 'trailing' },
  { id: 'start', header: 'Beginn', cell: (r) => r.start, priority: 2, mobile: 'meta' },
  { id: 'note', header: 'Notiz', cell: (r) => r.note, priority: 3, mobile: 'subtitle' },
  { id: 'sales', header: 'Umsatz', cell: (r) => r.sales, num: true, priority: 2 },
];
const actions = () => [
  { id: 'edit', label: 'Bearbeiten', icon: 'edit', onClick() {} },
  { id: 'open', label: 'Öffnen', icon: 'eye', href: '/x' },
  { id: 'copy', label: 'Duplizieren', icon: 'copy', onClick() {} },
  { id: 'del', label: 'Löschen', icon: 'trash', danger: true, onClick() {} },
  { id: 'hidden', label: 'Nie', icon: 'x', hidden: true },
];

test('DataTable: Tabelle mit Rollen, Caption, Prioritäts- und Telefon-Klassen', () => {
  const html = render(h(DataTable, { rows, rowKey: 'id', columns, caption: 'Events', stickyHeader: true, dense: true }));
  assert.match(html, /^<div class="oe-dt oe-dt--dense oe-dt--sticky">/);
  assert.match(html, /<table class="oe-dt__table" role="table"><caption class="oe-sr-only">Events<\/caption>/);
  assert.match(html, /<thead role="rowgroup"><tr role="row"><th role="columnheader" scope="col" class="oe-dt__th oe-dt__m-title">Name<\/th>/);
  // Prioritäten als Klassen auf th und td
  assert.match(html, /<th[^>]*class="oe-dt__th oe-dt__p2 oe-dt__m-l2 oe-dt__m-meta">Beginn<\/th>/);
  assert.match(html, /<th[^>]*class="oe-dt__th oe-dt__p3 oe-dt__m-l2 oe-dt__m-sub">Notiz<\/th>/);
  assert.match(html, /<th[^>]*class="oe-dt__th oe-dt__th--num oe-dt__p2 oe-dt__m-hidden">Umsatz<\/th>/);
  // Telefon-Rollen: erste Spalte wird title, trailing, l2
  assert.match(html, /<td role="cell" class="oe-dt__td oe-dt__td--title oe-dt__m-title"><span title="Sommerfest">Sommerfest<\/span><\/td>/);
  assert.match(html, /<td role="cell" class="oe-dt__td oe-dt__m-trailing">live<\/td>/);
  assert.match(html, /<td role="cell" class="oe-dt__td oe-dt__p3 oe-dt__m-l2 oe-dt__m-sub is-empty"><\/td>/);
  assert.match(html, /<td role="cell" class="oe-dt__td oe-dt__td--num oe-dt__p2 oe-dt__m-hidden">1\.284,50 €<\/td>/);
  assert.equal((html.match(/<tr role="row"/g) ?? []).length, 3);
  assert.doesNotMatch(html, /oe-dt__td--actions/);
  assert.doesNotMatch(html, SYMBOLS);
});

test('DataTable: explizite title-Spalte, sonst erste Spalte', () => {
  const cols = [columns[1], { ...columns[0], mobile: 'title' }];
  const html = render(h(DataTable, { rows, rowKey: (r) => r.id, columns: cols, caption: 'x' }));
  assert.match(html, /<th[^>]*class="oe-dt__th oe-dt__m-trailing">Status<\/th><th[^>]*class="oe-dt__th oe-dt__m-title">Name<\/th>/);
});

test('DataTable: Aktionen — zwei inline als IconButton, Rest im Dropdown, alle im Dropdown für das Telefon', () => {
  const html = render(h(DataTable, { rows: rows.slice(0, 1), rowKey: 'id', columns, caption: 'x', actions, onRowClick() {} }));
  assert.match(html, /oe-dt oe-dt--clickable/);
  assert.match(html, /<tr role="row" class="oe-dt__tr" tabindex="0">/);
  assert.match(html, /<th role="columnheader" scope="col" class="oe-dt__th oe-dt__th--actions"><span class="oe-sr-only">Aktionen<\/span><\/th>/);
  // Inline: Button für edit, Link für open (href)
  assert.match(html, /<button data-action="edit" aria-label="Bearbeiten" type="button" class="oe-btn oe-btn--quiet oe-btn--xs oe-btn--icon oe-dt__inline">/);
  assert.match(html, /<a data-action="open" href="\/x" aria-label="Öffnen" class="oe-btn oe-btn--quiet oe-btn--xs oe-btn--icon oe-dt__inline">/);
  assert.doesNotMatch(html, /class="[^"]*oe-dt__inline"[^>]*aria-label="Duplizieren"/);
  // Dropdown: ⋯ mit Name, nicht nur mobil (zwei bleiben übrig)
  assert.match(html, /<div class="oe-dd oe-dt__more"><button aria-label="Weitere Aktionen" type="button" class="oe-dd__trigger oe-dd__trigger--icon oe-dd__trigger--xs" aria-haspopup="menu"/);
  // Alle vier Einträge mit Text, die ersten zwei als inline markiert
  assert.match(html, /<button[^>]*role="menuitem" class="oe-dd__opt oe-dt__opt--inline"[^>]*><svg.*?<\/svg>Bearbeiten<\/button>/s);
  assert.match(html, /<a[^>]*href="\/x" role="menuitem" class="oe-dd__opt oe-dt__opt--inline">/);
  assert.match(html, /role="menuitem" class="oe-dd__opt">(<svg.*?<\/svg>)Duplizieren<\/button>/s);
  assert.match(html, /role="menuitem" class="oe-dd__opt oe-dd__opt--danger">(<svg.*?<\/svg>)Löschen<\/button>/s);
  assert.doesNotMatch(html, /Nie/);
  assert.doesNotMatch(html, SYMBOLS);
});

test('DataTable: alle Aktionen inline → Dropdown nur mobil; inlineActions=0 → alles im Dropdown', () => {
  const one = () => [{ id: 'e', label: 'Bearbeiten', icon: 'edit' }];
  assert.match(render(h(DataTable, { rows, rowKey: 'id', columns, caption: 'x', actions: one })), /class="oe-dd oe-dt__more oe-dt__more--m"/);
  const html = render(h(DataTable, { rows, rowKey: 'id', columns, caption: 'x', actions, inlineActions: 0 }));
  assert.doesNotMatch(html, /oe-dt__inline/);
  assert.doesNotMatch(html, /oe-dt__opt--inline/);
});

test('DataTable: leer und ladend', () => {
  const html = render(h(DataTable, { rows: [], rowKey: 'id', columns, caption: 'x', actions, empty: 'Nichts da' }));
  assert.match(html, /<td role="cell" class="oe-dt__td oe-dt__empty" colSpan="6">Nichts da<\/td>/);
  const loading = render(h(DataTable, { rows, rowKey: 'id', columns, caption: 'x', loading: true, footer: 'Fuß' }));
  assert.match(loading, /^<div class="oe-dt oe-dt--loading" aria-busy="true">/);
  assert.match(loading, /<div class="oe-dt__loading"><span class="oe-spinner" role="status" aria-label="Lädt"><\/span>/);
  assert.match(loading, /<div class="oe-dt__foot">Fuß<\/div>/);
});

test('IconButton: aria-label, Größe, Badge, Link', () => {
  assert.equal(
    render(h(IconButton, { icon: 'edit', label: 'Bearbeiten', size: 'sm', variant: 'ghost' })),
    '<button aria-label="Bearbeiten" type="button" class="oe-btn oe-btn--ghost oe-btn--sm oe-btn--icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="oe-icon" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg></button>',
  );
  const badge = render(h(IconButton, { icon: 'filter', label: 'Filter', badge: 3 }));
  assert.match(badge, /class="oe-btn oe-btn--secondary oe-btn--icon has-badge"/);
  assert.match(badge, /<span class="oe-btn__badge" aria-hidden="true">3<\/span>/);
  const link = render(h(IconButton, { icon: 'eye', label: 'Öffnen', href: '/a', disabled: true }));
  assert.match(link, /^<a href="\/a" aria-label="Öffnen" aria-disabled="true" class="oe-btn oe-btn--secondary oe-btn--icon">/);
});

test('Tooltip: ohne Interaktion nur das Kind; always = statische Blase wie bis 0.6', () => {
  assert.equal(render(h(Tooltip, { label: 'Hilfe' }, h('button', null, 'x'))), '<button>x</button>');
  assert.equal(
    render(h(Tooltip, { label: 'Hilfe', always: true }, h('b', null, 'x'))),
    '<span class="oe-tip"><b>x</b><span class="oe-tip__bubble" role="tooltip">Hilfe</span></span>',
  );
});

test('DataPager: Info, Seiten mit Lücken, aktive Seite, Knöpfe', () => {
  assert.deepEqual(pageItems(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(pageItems(1, 20), [1, 2, 3, 4, 5, null, 20]);
  assert.deepEqual(pageItems(10, 20), [1, null, 9, 10, 11, null, 20]);
  assert.deepEqual(pageItems(20, 20), [1, null, 16, 17, 18, 19, 20]);
  const html = render(h(DataPager, { page: 3, pageSize: 25, total: 240, onChange() {}, pageSizes: [25, 50] }));
  assert.match(html, /^<nav class="oe-pager" aria-label="Seiten"><span class="oe-pager__info">51–75 von 240<\/span>/);
  assert.match(html, /<select aria-label="pro Seite">/);
  assert.match(html, /<button aria-label="Zurück" type="button" class="oe-btn oe-btn--ghost oe-btn--sm oe-btn--icon">/);
  assert.match(html, /<span class="oe-pager__cur" aria-current="page">Seite 3 von 10<\/span>/);
  assert.match(html, /<button type="button" class="is-active" aria-current="page" aria-label="Seite 3 von 10">3<\/button>/);
  assert.match(html, /<span class="oe-pager__gap" aria-hidden="true"><\/span>/);
  assert.doesNotMatch(html, SYMBOLS);
  const last = render(h(DataPager, { page: 10, pageSize: 25, total: 240, onChange() {} }));
  assert.match(last, /aria-label="Weiter" type="button" disabled=""/);
  assert.doesNotMatch(html, /class=""/);
  assert.match(render(h(DataPager, { page: 1, pageSize: 25, total: 0, onChange() {} })), /0 Einträge/);
});

test('FilterBar: Kinder inline, Filter-Knopf mit Zähler, Sheet erst im Browser', () => {
  const html = render(h(FilterBar, { activeCount: 2, leading: h('input', { type: 'search' }) }, h('select', null)));
  assert.match(html, /^<div class="oe-filterbar has-active"><div class="oe-filterbar__lead"><input type="search"\/><\/div><div class="oe-filterbar__fields"><select><\/select><\/div>/);
  assert.match(html, /<div class="oe-filterbar__toggle"><button aria-haspopup="dialog" aria-expanded="false" aria-label="Filter" type="button" class="oe-btn oe-btn--accent oe-btn--icon has-badge">/);
  assert.match(html, /<span class="oe-btn__badge" aria-hidden="true">2<\/span>/);
  assert.doesNotMatch(html, /oe-sheet/);
});
