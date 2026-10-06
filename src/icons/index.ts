/**
 * OpenEOS-Icons: Linien-Icons aus Lucide (https://lucide.dev, ISC) unter
 * stabilen OpenEOS-Namen — 24er Raster, Strich 1,8, runde Enden,
 * Farbe = currentColor.
 *
 *   import { Icon, iconSvg, type IconName } from '@openeos/ui/icons';
 *
 *   <Icon name="beer" />                 // React, dekorativ (aria-hidden)
 *   <Icon name="lock" label="Sperren" /> // React, mit Bedeutung (role="img")
 *   iconSvg('beer', 20)                  // SVG-String für Nicht-React-Kontexte
 *
 * Die Zuordnung Name → Lucide-Icon steht in `lucide.json`; `pnpm icons`
 * übernimmt daraus die Geometrie (`svg/`, `generated.ts`). Zur Laufzeit
 * hängt das Paket nicht von Lucide ab.
 */
import { ICON_NAMES, ICON_NODES, ICON_SOURCES, ICON_STROKE_WIDTH, type IconName } from './generated';

export {
  ICON_NODES,
  ICON_STROKE_WIDTH,
  LUCIDE_VERSION,
  type IconName,
  type IconNode,
  type IconNodeTag,
} from './generated';
export { iconKeywords } from './keywords';
export { legacyIconMap, legacyIcon, LEGACY_FALLBACK_ICON } from './legacy';
export { Icon, type IconProps } from '../react/icon';

/** Alle Icon-Namen, alphabetisch. */
export const iconNames: readonly IconName[] = ICON_NAMES;

/** Lucide-Icon hinter jedem Namen, z. B. `cart` → `shopping-cart`. */
export const iconSources: Readonly<Record<IconName, string>> = ICON_SOURCES;

export type IconGroup = 'food' | 'actions' | 'payment' | 'operations' | 'status';

/** Gruppen für Icon-Picker und Doku; jedes Icon steht in genau einer Gruppe. */
export const iconGroups: Readonly<Record<IconGroup, readonly IconName[]>> = {
  food: [
    'beer', 'wine', 'shot', 'soda', 'water', 'bottle', 'coffee', 'cake', 'sausage',
    'bread', 'fries', 'icecream', 'utensils', 'flame', 'leaf', 'chef', 'deposit',
  ],
  actions: [
    'cart', 'cart-plus', 'plus', 'minus', 'x', 'check', 'chevron-down', 'chevron-up',
    'chevron-right', 'chevron-left', 'arrow-right', 'search', 'filter', 'edit', 'trash',
    'more', 'send', 'print', 'download', 'refresh', 'split', 'percent', 'backspace',
    'lock', 'eye', 'logout', 'star', 'history', 'undo', 'copy', 'rotate', 'zoom-in',
    'zoom-out',
  ],
  payment: ['card', 'cash', 'contactless', 'ticket', 'receipt', 'qr', 'tag', 'drawer'],
  operations: [
    'table', 'table-round', 'users', 'user', 'clock', 'calendar', 'dashboard', 'orders',
    'box', 'device', 'printer', 'pin', 'chart', 'sliders', 'home', 'grid', 'list', 'note',
    'bell', 'mail', 'map', 'stage', 'wall', 'text', 'sun', 'moon', 'monitor',
  ],
  status: ['check-circle', 'x-circle', 'alert', 'info', 'wifi', 'wifi-off', 'shield'],
};

const NAME_SET: ReadonlySet<string> = new Set(ICON_NAMES);

export function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && NAME_SET.has(value);
}

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * SVG-Markup als String — für Doku, Landing, E-Mail-Vorschauen oder
 * statische Seiten. Dekorativ (`aria-hidden`); wer eine Beschriftung
 * braucht, setzt sie am umgebenden Element.
 */
export function iconSvg(name: IconName, size?: number): string {
  const nodes = ICON_NODES[name];
  const body = nodes
    .map(([tag, attrs]) => {
      const pairs = Object.entries(attrs).map(([key, value]) => ` ${key}="${escapeAttr(value)}"`);
      return `<${tag}${pairs.join('')}/>`;
    })
    .join('');
  const sizeAttrs = size ? ` width="${size}" height="${size}" style="--oe-ico:${size}px"` : '';
  return (
    `<svg class="oe-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"${sizeAttrs} fill="none" ` +
    `stroke="currentColor" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" ` +
    `aria-hidden="true" focusable="false">${body}</svg>`
  );
}
