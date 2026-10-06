#!/usr/bin/env node
/**
 * Baut das Icon-Set aus Lucide (lucide-static, devDependency).
 *
 *   node scripts/build-icons.mjs           schreibt src/icons/svg/*.svg,
 *                                          src/icons/generated.ts und
 *                                          src/icons/LICENSE-lucide.txt
 *   node scripts/build-icons.mjs --check   prüft nur (CI): alle drei sind
 *                                          aktuell zur Zuordnung und zur
 *                                          installierten Lucide-Version
 *
 * Die Zuordnung OpenEOS-Name → Lucide-Icon steht in src/icons/lucide.json.
 * Die Geometrie wird zur Buildzeit übernommen (vendored): das Paket hat
 * keine Laufzeit-Abhängigkeit auf Lucide. Stil des Sets: Lucide-Geometrie,
 * Strich STROKE_WIDTH, runde Enden, currentColor.
 */
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ICON_DIR = join(ROOT, 'src/icons');
const SVG_DIR = join(ICON_DIR, 'svg');
const OUT = join(ICON_DIR, 'generated.ts');
const LICENSE_OUT = join(ICON_DIR, 'LICENSE-lucide.txt');
const MAP = join(ICON_DIR, 'lucide.json');
const check = process.argv.includes('--check');

/** Strichstärke des Sets — wie bis 0.4 (Lucide selbst zeichnet mit 2). */
const STROKE_WIDTH = '1.8';

const require = createRequire(import.meta.url);
const LUCIDE_DIR = dirname(require.resolve('lucide-static/package.json'));
const LUCIDE_VERSION = JSON.parse(readFileSync(join(LUCIDE_DIR, 'package.json'), 'utf8')).version;
/** Nur kanonische Namen: Aliase (z. B. trash-2, history) fehlen hier. */
const CANONICAL = new Set(Object.keys(JSON.parse(readFileSync(join(LUCIDE_DIR, 'icon-nodes.json'), 'utf8'))));

/** So sieht jede Lucide-Datei aus; Abweichungen fallen auf. */
const LUCIDE_ROOT = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

/** Erlaubte Kindelemente und ihre Attribute. */
const ELEMENTS = {
  path: ['d'],
  circle: ['cx', 'cy', 'r', 'fill'],
  rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
  line: ['x1', 'y1', 'x2', 'y2'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  polyline: ['points'],
  polygon: ['points'],
};

const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

function parseAttrs(source, where) {
  const attrs = {};
  const rest = source.replace(/([a-zA-Z][a-zA-Z0-9:-]*)="([^"]*)"/g, (_m, name, value) => {
    if (name in attrs) fail(where, `Attribut ${name} doppelt`);
    attrs[name] = value;
    return '';
  });
  if (rest.trim() !== '') fail(where, `unlesbare Attribute: ${rest.trim()}`);
  return attrs;
}

function readLucide(name, lucideName) {
  const where = `${name} → lucide:${lucideName}`;
  if (!NAME.test(name)) fail(where, 'Name muss kebab-case sein (a-z, 0-9, -)');
  if (!CANONICAL.has(lucideName)) {
    fail(where, 'kein kanonisches Lucide-Icon (Alias oder unbekannt) — Namen auf lucide.dev prüfen');
    return [];
  }
  const source = readFileSync(join(LUCIDE_DIR, 'icons', `${lucideName}.svg`), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  const match = source.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
  if (!match) {
    fail(where, 'kein einzelnes <svg>…</svg>-Element');
    return [];
  }
  const rootAttrs = parseAttrs(match[1].replace(/\bclass="[^"]*"/, ''), where);
  for (const [attr, value] of Object.entries(LUCIDE_ROOT)) {
    if (rootAttrs[attr] !== value) fail(where, `<svg ${attr}="${value}"> erwartet, gefunden "${rootAttrs[attr] ?? ''}"`);
  }

  const nodes = [];
  const tags = Object.keys(ELEMENTS).join('|');
  const body = match[2].replace(new RegExp(`<(${tags})\\b([^>]*?)\\/>`, 'g'), (_m, tag, attrSource) => {
    const attrs = parseAttrs(attrSource, where);
    for (const attr of Object.keys(attrs)) {
      if (!ELEMENTS[tag].includes(attr)) fail(where, `<${tag}> hat unerwartetes Attribut ${attr}`);
    }
    if (tag === 'circle' && 'fill' in attrs && attrs.fill !== 'currentColor') {
      fail(where, `<circle fill="${attrs.fill}"> — nur currentColor erlaubt`);
    }
    nodes.push([tag, attrs]);
    return '';
  });
  if (body.trim() !== '') fail(where, `unerwarteter Inhalt: ${body.trim().slice(0, 60)}`);
  if (nodes.length === 0) fail(where, 'leer');
  return nodes;
}

const mapping = JSON.parse(readFileSync(MAP, 'utf8'));
const names = Object.keys(mapping).sort();
if (names.join() !== Object.keys(mapping).join()) fail('lucide.json', 'Schlüssel alphabetisch sortieren');
const icons = names.map((name) => [name, mapping[name], readLucide(name, mapping[name])]);

const q = (value) => `'${value}'`;
const key = (value) => (/^[a-z]+$/.test(value) ? value : q(value));
const usedTags = [...new Set(icons.flatMap(([, , nodes]) => nodes.map(([tag]) => tag)))].sort();

const svgFiles = new Map(
  icons.map(([name, lucideName, nodes]) => {
    const children = nodes
      .map(([tag, attrs]) => `  <${tag}${Object.entries(attrs).map(([k, v]) => ` ${k}="${v}"`).join('')} />`)
      .join('\n');
    const text =
      `<!-- Lucide "${lucideName}" (lucide-static ${LUCIDE_VERSION}, ISC, siehe LICENSE-lucide.txt). ` +
      `Erzeugt von scripts/build-icons.mjs, nicht von Hand ändern. -->\n` +
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
      `stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round">\n${children}\n</svg>\n`;
    return [`${name}.svg`, text];
  }),
);

const lines = [
  '/* Automatisch erzeugt von scripts/build-icons.mjs — nicht von Hand ändern.',
  '   Quelle: Lucide (lucide-static, ISC) über src/icons/lucide.json. Neu bauen mit `pnpm icons`. */',
  '',
  `export type IconNodeTag = ${usedTags.map(q).join(' | ')};`,
  'export type IconNode = readonly [tag: IconNodeTag, attrs: Readonly<Record<string, string>>];',
  '',
  '/** Lucide-Version, aus der die Geometrie stammt. */',
  `export const LUCIDE_VERSION = ${q(LUCIDE_VERSION)};`,
  '',
  '/** Strichstärke des Sets (Lucide zeichnet mit 2, OpenEOS etwas feiner). */',
  `export const ICON_STROKE_WIDTH = ${STROKE_WIDTH};`,
  '',
  'export type IconName =',
  ...icons.map(([name], index) => `  | ${q(name)}${index === icons.length - 1 ? ';' : ''}`),
  '',
  '/** Alle Icon-Namen, alphabetisch. */',
  'export const ICON_NAMES: readonly IconName[] = [',
  ...icons.map(([name]) => `  ${q(name)},`),
  '];',
  '',
  '/** Lucide-Icon hinter jedem Namen (https://lucide.dev/icons/<name>). */',
  'export const ICON_SOURCES: Readonly<Record<IconName, string>> = {',
  ...icons.map(([name, lucideName]) => `  ${key(name)}: ${q(lucideName)},`),
  '};',
  '',
  '/** Kindelemente je Icon; das umgebende <svg> setzt Icon bzw. iconSvg. */',
  'export const ICON_NODES: Readonly<Record<IconName, readonly IconNode[]>> = {',
  ...icons.map(([name, , nodes]) => {
    const body = nodes
      .map(([tag, attrs]) => {
        const pairs = Object.entries(attrs).map(([k, v]) => `${key(k)}: ${q(v)}`);
        return `[${q(tag)}, { ${pairs.join(', ')} }]`;
      })
      .join(', ');
    return `  ${key(name)}: [${body}],`;
  }),
  '};',
  '',
];
const output = lines.join('\n');
const license = readFileSync(join(LUCIDE_DIR, 'LICENSE'), 'utf8');

if (errors.length > 0) {
  console.error(`Icon-Prüfung fehlgeschlagen (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

const existing = readdirSync(SVG_DIR).filter((file) => file.endsWith('.svg'));
const stale = existing.filter((file) => !svgFiles.has(file));

if (check) {
  const problems = [];
  const read = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : '');
  if (read(OUT) !== output) problems.push('src/icons/generated.ts');
  if (read(LICENSE_OUT) !== license) problems.push('src/icons/LICENSE-lucide.txt');
  for (const [file, text] of svgFiles) if (read(join(SVG_DIR, file)) !== text) problems.push(`src/icons/svg/${file}`);
  for (const file of stale) problems.push(`src/icons/svg/${file} (gehört zu keinem Icon)`);
  if (problems.length > 0) {
    console.error(`Nicht aktuell — \`pnpm icons\` ausführen und committen:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`Icons ok: ${icons.length} Icons aus Lucide ${LUCIDE_VERSION}, Dateien aktuell.`);
} else {
  for (const file of stale) unlinkSync(join(SVG_DIR, file));
  for (const [file, text] of svgFiles) writeFileSync(join(SVG_DIR, file), text);
  writeFileSync(OUT, output);
  writeFileSync(LICENSE_OUT, license);
  console.log(`${icons.length} Icons aus Lucide ${LUCIDE_VERSION} geschrieben (svg/, generated.ts, LICENSE-lucide.txt).`);
}
