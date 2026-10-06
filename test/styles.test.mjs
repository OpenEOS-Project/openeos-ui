// dist/styles.css enthält alle Klassen und Tokens, die 0.4.0 zusagt.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const css = readFileSync(new URL('../dist/styles.css', import.meta.url), 'utf8');

const CLASSES = `
  oe-icon oe-icon--filled
  oe-icobox oe-icobox--accent oe-icobox--ink oe-icobox--sm oe-icobox--lg oe-icobox__badge
  oe-tile--product oe-tile__top oe-tile__txt oe-tile__ico oe-tile__qty oe-tile__ft oe-tile__hint oe-tile__flag
  oe-tablechip oe-tablechip--lg oe-tables
  oe-legend oe-legend__sw--free oe-legend__sw--busy oe-legend__sw--wait
  oe-keypad--lg
  oe-segment--lg
  oe-stepper oe-stepper--lg oe-stepper__val
  oe-choices oe-choices--row oe-choice
  oe-sheet oe-sheet__hd oe-sheet__body oe-sheet__toolbar oe-sheet__pinned oe-sheet__ft oe-sheet__handle
  oe-sheet--wide oe-sheet--pay oe-sheet--done oe-sheet-layer
  oe-cartline oe-cartline__main oe-cartline__meta oe-cartline__sent oe-cartline__sum
  oe-cartbar oe-cartbar__ico oe-cartbar__n oe-cartbar__sum oe-cartbar__go oe-bump
  oe-catnav oe-catnav--responsive oe-cat oe-cat__ico oe-cat__lbl oe-cat__n
  oe-due oe-due__amount oe-given oe-change oe-change--neg
  oe-prompt oe-prompt__ico oe-prompt__title oe-prompt__text
  oe-userchip oe-userchip--compact
  oe-statuspill oe-statuspill--warn oe-statuspill--danger
  oe-floor-wrap oe-floor oe-floor--edit oe-floor--grid oe-floor__table oe-floor__table--round
  oe-floor__table--busy oe-floor__table--wait oe-floor__label oe-floor__hint oe-floor__seats
  oe-floor__decor oe-floor__decor--bar oe-floor__decor--wall oe-floor__decor--stage oe-floor__decor--label
  oe-floor__handle
  oe-receipt
`.trim().split(/\s+/);

const STATES = ['.oe-tile--product.is-in', '.oe-tablechip.is-current', '.oe-tablechip:disabled', '.oe-keypad button:disabled',
  '.oe-keypad button.is-accent:not(:disabled)', '.oe-choice.is-active', '.oe-cartline.is-sent', '.oe-cat.is-active',
  '.oe-floor__table.is-current', '.oe-floor__table.is-selected', '.oe-tile--product:disabled'];

const TOKENS = ['--oe-ico', '--oe-receipt-bg', '--oe-receipt-ink', '--oe-receipt-line', '--oe-receipt-mute',
  '--oe-floor-bg', '--oe-floor-grid-line', '--oe-floor-decor', '--oe-floor-wall', '--oe-warn-ink', '--oe-danger-ink'];

test('alle Klassen aus 6.2 sind im Bundle', () => {
  const missing = CLASSES.filter((name) => !new RegExp(`\\.${name}(?![\\w-])`).test(css));
  assert.deepEqual(missing, []);
  for (const state of STATES) assert.ok(css.includes(state), state);
});

test('neue Tokens hell und dunkel', () => {
  const [light, dark] = css.split(/\.dark-mode,\s*\.dark,/);
  for (const token of TOKENS) assert.match(light, new RegExp(`${token}:`), `hell: ${token}`);
  for (const token of TOKENS.filter((t) => t.startsWith('--oe-floor') || t === '--oe-warn-ink' || t === '--oe-danger-ink')) {
    assert.match(dark, new RegExp(`${token}:`), `dunkel: ${token}`);
  }
});

test('keine Hex-Farben in den neuen Klassen (außer Kassenbon-Tokens)', () => {
  for (const file of ['icons.css', 'sheet.css', 'floor.css']) {
    const source = readFileSync(new URL(`../src/styles/${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i, file);
  }
});

test('0.4.1: Silbentrennung statt Umbruch mitten im Wort', () => {
  assert.doesNotMatch(css, /overflow-wrap:\s*anywhere/);
  for (const sel of ['.oe-tile--product .oe-tile__txt b{', '.oe-cartline__name{']) {
    const rule = css.slice(css.indexOf(sel), css.indexOf('}', css.indexOf(sel)));
    assert.match(rule, /hyphens:\s*auto/, sel);
    assert.match(rule, /overflow-wrap:\s*break-word/, sel);
  }
});

test('0.4.1: .pos-root-Reset hat Spezifität 0 (überschreibt .oe-btn nicht)', () => {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors = [...bare.matchAll(/(^|})\s*([^{}]*\.pos-root[^{}]*)\{/g)].map((m) => m[2].trim());
  assert.ok(selectors.length > 0);
  for (const sel of selectors) {
    for (const part of sel.split(/,(?![^(]*\))/)) assert.match(part.trim(), /^:where\(/, part);
  }
});
