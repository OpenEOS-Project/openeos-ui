#!/usr/bin/env node
/**
 * Baut src/icons/generated.ts aus src/icons/svg/*.svg.
 *
 *   node scripts/build-icons.mjs           schreibt generated.ts
 *   node scripts/build-icons.mjs --check   prüft nur (CI): Stil jeder Datei
 *                                          und ob generated.ts aktuell ist
 *
 * Bewusst ohne Abhängigkeiten: die SVGs sind klein und streng geformt,
 * ein Regex-Leser reicht und hält die Regeln an einer Stelle.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(ROOT, 'src/icons/svg');
const OUT = join(ROOT, 'src/icons/generated.ts');
const check = process.argv.includes('--check');

/** Pflichtattribute am <svg>-Element — der Stil des Sets. */
const ROOT_ATTRS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.8',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};
const OPTIONAL_ROOT_ATTRS = new Set(['xmlns']);

/** Erlaubte Kindelemente und ihre Attribute. */
const ELEMENTS = {
  path: { required: ['d'], optional: [] },
  circle: { required: ['cx', 'cy', 'r'], optional: ['fill', 'stroke'] },
  rect: { required: ['x', 'y', 'width', 'height'], optional: ['rx'] },
};

const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const NUMBER = /^-?(?:\d+\.?\d*|\.\d+)$/;

const errors = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);

function parseAttrs(source, file) {
  const attrs = {};
  const rest = source.replace(/([a-zA-Z:-]+)="([^"]*)"/g, (_m, key, value) => {
    if (key in attrs) fail(file, `Attribut ${key} doppelt`);
    attrs[key] = value;
    return '';
  });
  if (rest.trim() !== '') fail(file, `unlesbare Attribute: ${rest.trim()}`);
  return attrs;
}

function readIcon(file) {
  const name = file.slice(0, -4);
  if (!NAME.test(name)) fail(file, 'Dateiname muss kebab-case sein (a-z, 0-9, -)');

  const source = readFileSync(join(SVG_DIR, file), 'utf8').trim();
  const match = source.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
  if (!match) {
    fail(file, 'kein einzelnes <svg>…</svg>-Element');
    return [name, []];
  }

  const rootAttrs = parseAttrs(match[1], file);
  for (const [key, value] of Object.entries(ROOT_ATTRS)) {
    if (rootAttrs[key] !== value) fail(file, `<svg ${key}="${value}"> erwartet, gefunden "${rootAttrs[key] ?? ''}"`);
  }
  for (const key of Object.keys(rootAttrs)) {
    if (!(key in ROOT_ATTRS) && !OPTIONAL_ROOT_ATTRS.has(key)) fail(file, `<svg> hat unerlaubtes Attribut ${key}`);
  }

  const nodes = [];
  const body = match[2].replace(/<(path|circle|rect)\b([^>]*?)\/>/g, (_m, tag, attrSource) => {
    const spec = ELEMENTS[tag];
    const attrs = parseAttrs(attrSource, file);
    for (const key of spec.required) {
      if (!(key in attrs)) fail(file, `<${tag}> ohne ${key}`);
    }
    for (const key of Object.keys(attrs)) {
      if (!spec.required.includes(key) && !spec.optional.includes(key)) fail(file, `<${tag}> hat unerlaubtes Attribut ${key}`);
      if (key !== 'd' && key !== 'fill' && key !== 'stroke' && !NUMBER.test(attrs[key])) {
        fail(file, `<${tag} ${key}="${attrs[key]}"> ist keine Zahl`);
      }
    }
    // Punkte (z. B. bei "more", "list", "info") sind gefüllte Kreise ohne
    // Strich — die einzige erlaubte Abweichung vom Linienstil.
    if (tag === 'circle' && ('fill' in attrs || 'stroke' in attrs)) {
      if (attrs.fill !== 'currentColor' || attrs.stroke !== 'none' || attrs.r !== '1.1') {
        fail(file, 'gefüllter Punkt muss <circle r="1.1" fill="currentColor" stroke="none"> sein');
      }
    }
    if (tag === 'rect' && attrs.rx === '0') fail(file, '<rect rx="0"> weglassen');
    nodes.push([tag, attrs]);
    return '';
  });
  if (body.trim() !== '') fail(file, `unerlaubter Inhalt: ${body.trim().slice(0, 60)}`);
  if (nodes.length === 0) fail(file, 'leer');
  return [name, nodes];
}

const files = readdirSync(SVG_DIR)
  .filter((file) => file.endsWith('.svg'))
  .map((file) => file.slice(0, -4))
  .sort()
  .map((name) => `${name}.svg`);
const icons = files.map(readIcon);

const q = (value) => `'${value}'`;
const lines = [
  '/* Automatisch erzeugt von scripts/build-icons.mjs — nicht von Hand ändern.',
  '   Quelle: src/icons/svg/*.svg. Neu bauen mit `pnpm icons`. */',
  '',
  "export type IconNodeTag = 'path' | 'circle' | 'rect';",
  'export type IconNode = readonly [tag: IconNodeTag, attrs: Readonly<Record<string, string>>];',
  '',
  'export type IconName =',
  ...icons.map(([name], index) => `  | ${q(name)}${index === icons.length - 1 ? ';' : ''}`),
  '',
  '/** Alle Icon-Namen, alphabetisch. */',
  'export const ICON_NAMES: readonly IconName[] = [',
  ...icons.map(([name]) => `  ${q(name)},`),
  '];',
  '',
  '/** Kindelemente je Icon; das umgebende <svg> setzt Icon bzw. iconSvg. */',
  'export const ICON_NODES: Readonly<Record<IconName, readonly IconNode[]>> = {',
  ...icons.map(([name, nodes]) => {
    const body = nodes
      .map(([tag, attrs]) => {
        const pairs = Object.entries(attrs).map(([key, value]) => `${/^[a-z]+$/.test(key) ? key : q(key)}: ${q(value)}`);
        return `[${q(tag)}, { ${pairs.join(', ')} }]`;
      })
      .join(', ');
    return `  ${/^[a-z]+$/.test(name) ? name : q(name)}: [${body}],`;
  }),
  '};',
  '',
];
const output = lines.join('\n');

if (errors.length > 0) {
  console.error(`Icon-Prüfung fehlgeschlagen (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

if (check) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== output) {
    console.error('src/icons/generated.ts ist nicht aktuell — `pnpm icons` ausführen und committen.');
    process.exit(1);
  }
  console.log(`Icons ok: ${icons.length} Dateien, Stil geprüft, generated.ts aktuell.`);
} else {
  writeFileSync(OUT, output);
  console.log(`src/icons/generated.ts geschrieben (${icons.length} Icons).`);
}
