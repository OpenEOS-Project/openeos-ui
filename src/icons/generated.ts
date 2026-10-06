/* Automatisch erzeugt von scripts/build-icons.mjs — nicht von Hand ändern.
   Quelle: Lucide (lucide-static, ISC) über src/icons/lucide.json. Neu bauen mit `pnpm icons`. */

export type IconNodeTag = 'circle' | 'line' | 'path' | 'rect';
export type IconNode = readonly [tag: IconNodeTag, attrs: Readonly<Record<string, string>>];

/** Lucide-Version, aus der die Geometrie stammt. */
export const LUCIDE_VERSION = '1.52.0';

/** Strichstärke des Sets (Lucide zeichnet mit 2, OpenEOS etwas feiner). */
export const ICON_STROKE_WIDTH = 1.8;

export type IconName =
  | 'alert'
  | 'arrow-right'
  | 'backspace'
  | 'beer'
  | 'bell'
  | 'bottle'
  | 'box'
  | 'bread'
  | 'cake'
  | 'calendar'
  | 'card'
  | 'cart'
  | 'cart-plus'
  | 'cash'
  | 'chart'
  | 'check'
  | 'check-circle'
  | 'chef'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'clock'
  | 'coffee'
  | 'contactless'
  | 'copy'
  | 'dashboard'
  | 'deposit'
  | 'device'
  | 'download'
  | 'drawer'
  | 'edit'
  | 'eye'
  | 'filter'
  | 'flame'
  | 'fries'
  | 'grid'
  | 'history'
  | 'home'
  | 'icecream'
  | 'info'
  | 'leaf'
  | 'list'
  | 'lock'
  | 'logout'
  | 'mail'
  | 'map'
  | 'minus'
  | 'more'
  | 'note'
  | 'orders'
  | 'percent'
  | 'pin'
  | 'plus'
  | 'print'
  | 'printer'
  | 'qr'
  | 'receipt'
  | 'refresh'
  | 'rotate'
  | 'sausage'
  | 'search'
  | 'send'
  | 'shield'
  | 'shot'
  | 'sliders'
  | 'soda'
  | 'split'
  | 'stage'
  | 'star'
  | 'table'
  | 'table-round'
  | 'tag'
  | 'text'
  | 'ticket'
  | 'trash'
  | 'undo'
  | 'user'
  | 'users'
  | 'utensils'
  | 'wall'
  | 'water'
  | 'wifi'
  | 'wifi-off'
  | 'wine'
  | 'x'
  | 'x-circle'
  | 'zoom-in'
  | 'zoom-out';

/** Alle Icon-Namen, alphabetisch. */
export const ICON_NAMES: readonly IconName[] = [
  'alert',
  'arrow-right',
  'backspace',
  'beer',
  'bell',
  'bottle',
  'box',
  'bread',
  'cake',
  'calendar',
  'card',
  'cart',
  'cart-plus',
  'cash',
  'chart',
  'check',
  'check-circle',
  'chef',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'clock',
  'coffee',
  'contactless',
  'copy',
  'dashboard',
  'deposit',
  'device',
  'download',
  'drawer',
  'edit',
  'eye',
  'filter',
  'flame',
  'fries',
  'grid',
  'history',
  'home',
  'icecream',
  'info',
  'leaf',
  'list',
  'lock',
  'logout',
  'mail',
  'map',
  'minus',
  'more',
  'note',
  'orders',
  'percent',
  'pin',
  'plus',
  'print',
  'printer',
  'qr',
  'receipt',
  'refresh',
  'rotate',
  'sausage',
  'search',
  'send',
  'shield',
  'shot',
  'sliders',
  'soda',
  'split',
  'stage',
  'star',
  'table',
  'table-round',
  'tag',
  'text',
  'ticket',
  'trash',
  'undo',
  'user',
  'users',
  'utensils',
  'wall',
  'water',
  'wifi',
  'wifi-off',
  'wine',
  'x',
  'x-circle',
  'zoom-in',
  'zoom-out',
];

/** Lucide-Icon hinter jedem Namen (https://lucide.dev/icons/<name>). */
export const ICON_SOURCES: Readonly<Record<IconName, string>> = {
  alert: 'triangle-alert',
  'arrow-right': 'arrow-right',
  backspace: 'delete',
  beer: 'beer',
  bell: 'bell',
  bottle: 'bottle-wine',
  box: 'box',
  bread: 'croissant',
  cake: 'cake-slice',
  calendar: 'calendar',
  card: 'credit-card',
  cart: 'shopping-cart',
  'cart-plus': 'shopping-cart-plus',
  cash: 'banknote',
  chart: 'chart-column',
  check: 'check',
  'check-circle': 'circle-check',
  chef: 'chef-hat',
  'chevron-down': 'chevron-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'chevron-up': 'chevron-up',
  clock: 'clock',
  coffee: 'coffee',
  contactless: 'nfc',
  copy: 'copy',
  dashboard: 'layout-dashboard',
  deposit: 'recycle',
  device: 'tablet-smartphone',
  download: 'download',
  drawer: 'archive',
  edit: 'pencil',
  eye: 'eye',
  filter: 'funnel',
  flame: 'flame',
  fries: 'popcorn',
  grid: 'layout-grid',
  history: 'rotate-ccw-clock',
  home: 'house',
  icecream: 'ice-cream-cone',
  info: 'info',
  leaf: 'leaf',
  list: 'list',
  lock: 'lock',
  logout: 'log-out',
  mail: 'mail',
  map: 'map',
  minus: 'minus',
  more: 'ellipsis',
  note: 'sticky-note',
  orders: 'clipboard-list',
  percent: 'percent',
  pin: 'map-pin',
  plus: 'plus',
  print: 'printer',
  printer: 'printer',
  qr: 'qr-code',
  receipt: 'receipt-text',
  refresh: 'refresh-cw',
  rotate: 'rotate-cw',
  sausage: 'beef',
  search: 'search',
  send: 'send',
  shield: 'shield',
  shot: 'martini',
  sliders: 'sliders-horizontal',
  soda: 'cup-soda',
  split: 'split',
  stage: 'theater',
  star: 'star',
  table: 'rectangle-horizontal',
  'table-round': 'circle',
  tag: 'tag',
  text: 'type',
  ticket: 'ticket',
  trash: 'trash',
  undo: 'undo-2',
  user: 'user',
  users: 'users',
  utensils: 'utensils',
  wall: 'brick-wall',
  water: 'glass-water',
  wifi: 'wifi',
  'wifi-off': 'wifi-off',
  wine: 'wine',
  x: 'x',
  'x-circle': 'circle-x',
  'zoom-in': 'zoom-in',
  'zoom-out': 'zoom-out',
};

/** Kindelemente je Icon; das umgebende <svg> setzt Icon bzw. iconSvg. */
export const ICON_NODES: Readonly<Record<IconName, readonly IconNode[]>> = {
  alert: [['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' }], ['path', { d: 'M12 9v4' }], ['path', { d: 'M12 17h.01' }]],
  'arrow-right': [['path', { d: 'M5 12h14' }], ['path', { d: 'm12 5 7 7-7 7' }]],
  backspace: [['path', { d: 'M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z' }], ['path', { d: 'm12 9 6 6' }], ['path', { d: 'm18 9-6 6' }]],
  beer: [['path', { d: 'M17 11h1a3 3 0 0 1 0 6h-1' }], ['path', { d: 'M9 12v6' }], ['path', { d: 'M13 12v6' }], ['path', { d: 'M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z' }], ['path', { d: 'M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8' }]],
  bell: [['path', { d: 'M10.268 21a2 2 0 0 0 3.464 0' }], ['path', { d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326' }]],
  bottle: [['path', { d: 'M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a6 6 0 0 0 1.2 3.6l.6.8A6 6 0 0 1 17 13v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a6 6 0 0 1 1.2-3.6l.6-.8A6 6 0 0 0 10 5z' }], ['path', { d: 'M17 13h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4' }]],
  box: [['path', { d: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' }], ['path', { d: 'm3.3 7 8.7 5 8.7-5' }], ['path', { d: 'M12 22V12' }]],
  bread: [['path', { d: 'M10.2 18H4.774a1.5 1.5 0 0 1-1.352-.97 11 11 0 0 1 .132-6.487' }], ['path', { d: 'M18 10.2V4.774a1.5 1.5 0 0 0-.97-1.352 11 11 0 0 0-6.486.132' }], ['path', { d: 'M18 5a4 3 0 0 1 4 3 2 2 0 0 1-2 2 10 10 0 0 0-5.139 1.42' }], ['path', { d: 'M5 18a3 4 0 0 0 3 4 2 2 0 0 0 2-2 10 10 0 0 1 1.42-5.14' }], ['path', { d: 'M8.709 2.554a10 10 0 0 0-6.155 6.155 1.5 1.5 0 0 0 .676 1.626l9.807 5.42a2 2 0 0 0 2.718-2.718l-5.42-9.807a1.5 1.5 0 0 0-1.626-.676' }]],
  cake: [['path', { d: 'M16 13H3' }], ['path', { d: 'M16 17H3' }], ['path', { d: 'm7.2 7.9-3.388 2.5A2 2 0 0 0 3 12.01V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8.654c0-2-2.44-6.026-6.44-8.026a1 1 0 0 0-1.082.057L10.4 5.6' }], ['circle', { cx: '9', cy: '7', r: '2' }]],
  calendar: [['path', { d: 'M8 2v3' }], ['path', { d: 'M16 2v3' }], ['rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }], ['path', { d: 'M3 9h18' }]],
  card: [['rect', { width: '20', height: '14', x: '2', y: '5', rx: '2' }], ['line', { 'x1': '2', 'x2': '22', 'y1': '10', 'y2': '10' }], ['path', { d: 'M6 14h2' }]],
  cart: [['path', { d: 'm2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18' }], ['path', { d: 'M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25' }], ['circle', { cx: '18', cy: '20', r: '2' }], ['circle', { cx: '8', cy: '20', r: '2' }]],
  'cart-plus': [['path', { d: 'M16 5h6' }], ['path', { d: 'M19 2v6' }], ['path', { d: 'm2.05 2.05 1.099-.028a1 1 0 011.008.815l2.69 14.347A1 1 0 007.83 18H18' }], ['path', { d: 'M4.564 5H12' }], ['path', { d: 'M6.25 14h12.712a2 2 0 001.991-1.57l.172-1.041' }], ['circle', { cx: '18', cy: '20', r: '2' }], ['circle', { cx: '8', cy: '20', r: '2' }]],
  cash: [['rect', { width: '20', height: '12', x: '2', y: '6', rx: '2' }], ['circle', { cx: '12', cy: '12', r: '2' }], ['path', { d: 'M6 12h.01M18 12h.01' }]],
  chart: [['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16' }], ['path', { d: 'M18 17V9' }], ['path', { d: 'M13 17V5' }], ['path', { d: 'M8 17v-3' }]],
  check: [['path', { d: 'M20 6 9 17l-5-5' }]],
  'check-circle': [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'm16 9-5.5 5.5L8 12' }]],
  chef: [['path', { d: 'M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z' }], ['path', { d: 'M6 17h12' }]],
  'chevron-down': [['path', { d: 'm6 9 6 6 6-6' }]],
  'chevron-left': [['path', { d: 'm15 18-6-6 6-6' }]],
  'chevron-right': [['path', { d: 'm9 18 6-6-6-6' }]],
  'chevron-up': [['path', { d: 'm18 15-6-6-6 6' }]],
  clock: [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'M12 6v6l4 2' }]],
  coffee: [['path', { d: 'M10 2v2' }], ['path', { d: 'M14 2v2' }], ['path', { d: 'M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1' }], ['path', { d: 'M6 2v2' }]],
  contactless: [['path', { d: 'M6 8.32a7.43 7.43 0 0 1 0 7.36' }], ['path', { d: 'M9.46 6.21a11.76 11.76 0 0 1 0 11.58' }], ['path', { d: 'M12.91 4.1a15.91 15.91 0 0 1 .01 15.8' }], ['path', { d: 'M16.37 2a20.16 20.16 0 0 1 0 20' }]],
  copy: [['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }], ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }]],
  dashboard: [['rect', { width: '7', height: '9', x: '3', y: '3', rx: '1' }], ['rect', { width: '7', height: '5', x: '14', y: '3', rx: '1' }], ['rect', { width: '7', height: '9', x: '14', y: '12', rx: '1' }], ['rect', { width: '7', height: '5', x: '3', y: '16', rx: '1' }]],
  deposit: [['path', { d: 'M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5' }], ['path', { d: 'M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12' }], ['path', { d: 'm14 16-3 3 3 3' }], ['path', { d: 'M8.293 13.596 7.196 9.5 3.1 10.598' }], ['path', { d: 'm9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843' }], ['path', { d: 'm13.378 9.633 4.096 1.098 1.097-4.096' }]],
  device: [['rect', { width: '10', height: '14', x: '3', y: '8', rx: '2' }], ['path', { d: 'M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4' }], ['path', { d: 'M8 18h.01' }]],
  download: [['path', { d: 'M12 15V3' }], ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }], ['path', { d: 'm7 10 5 5 5-5' }]],
  drawer: [['rect', { width: '20', height: '5', x: '2', y: '3', rx: '1' }], ['path', { d: 'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8' }], ['path', { d: 'M10 12h4' }]],
  edit: [['path', { d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' }], ['path', { d: 'm15 5 4 4' }]],
  eye: [['path', { d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' }], ['circle', { cx: '12', cy: '12', r: '3' }]],
  filter: [['path', { d: 'M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z' }]],
  flame: [['path', { d: 'M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4' }]],
  fries: [['path', { d: 'M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4' }], ['path', { d: 'M10 22 9 8' }], ['path', { d: 'm14 22 1-14' }], ['path', { d: 'M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z' }]],
  grid: [['rect', { width: '7', height: '7', x: '3', y: '3', rx: '1' }], ['rect', { width: '7', height: '7', x: '14', y: '3', rx: '1' }], ['rect', { width: '7', height: '7', x: '14', y: '14', rx: '1' }], ['rect', { width: '7', height: '7', x: '3', y: '14', rx: '1' }]],
  history: [['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }], ['path', { d: 'M3 3v5h5' }], ['path', { d: 'M12 7v5l4 2' }]],
  home: [['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' }], ['path', { d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }]],
  icecream: [['path', { d: 'm7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11' }], ['path', { d: 'M17 7A5 5 0 0 0 7 7' }], ['path', { d: 'M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4' }]],
  info: [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'M12 16v-4' }], ['path', { d: 'M12 8h.01' }]],
  leaf: [['path', { d: 'M11 20a10 10 0 0010-10 25.9 25.9 0 00-1.04-7.281 1 1 0 00-1.755-.325C15.833 5.5 13 5.5 9.8 6.1A7 7 0 0011 20' }], ['path', { d: 'M2 21a5 5 0 012.911-4.544C7.613 15.212 8.351 15.24 11 13' }]],
  list: [['path', { d: 'M3 5h.01' }], ['path', { d: 'M3 12h.01' }], ['path', { d: 'M3 19h.01' }], ['path', { d: 'M8 5h13' }], ['path', { d: 'M8 12h13' }], ['path', { d: 'M8 19h13' }]],
  lock: [['rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }], ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' }]],
  logout: [['path', { d: 'm16 17 5-5-5-5' }], ['path', { d: 'M21 12H9' }], ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }]],
  mail: [['path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' }], ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }]],
  map: [['path', { d: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z' }], ['path', { d: 'M15 5.764v15' }], ['path', { d: 'M9 3.236v15' }]],
  minus: [['path', { d: 'M5 12h14' }]],
  more: [['circle', { cx: '12', cy: '12', r: '1' }], ['circle', { cx: '19', cy: '12', r: '1' }], ['circle', { cx: '5', cy: '12', r: '1' }]],
  note: [['path', { d: 'M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z' }], ['path', { d: 'M15 3v5a1 1 0 0 0 1 1h5' }]],
  orders: [['rect', { width: '8', height: '4', x: '8', y: '2', rx: '1', ry: '1' }], ['path', { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' }], ['path', { d: 'M12 11h4' }], ['path', { d: 'M12 16h4' }], ['path', { d: 'M8 11h.01' }], ['path', { d: 'M8 16h.01' }]],
  percent: [['line', { 'x1': '19', 'x2': '5', 'y1': '5', 'y2': '19' }], ['circle', { cx: '6.5', cy: '6.5', r: '2.5' }], ['circle', { cx: '17.5', cy: '17.5', r: '2.5' }]],
  pin: [['path', { d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' }], ['circle', { cx: '12', cy: '10', r: '3' }]],
  plus: [['path', { d: 'M5 12h14' }], ['path', { d: 'M12 5v14' }]],
  print: [['path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }], ['path', { d: 'M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6' }], ['rect', { x: '6', y: '14', width: '12', height: '8', rx: '1' }]],
  printer: [['path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }], ['path', { d: 'M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6' }], ['rect', { x: '6', y: '14', width: '12', height: '8', rx: '1' }]],
  qr: [['rect', { width: '5', height: '5', x: '3', y: '3', rx: '1' }], ['rect', { width: '5', height: '5', x: '16', y: '3', rx: '1' }], ['rect', { width: '5', height: '5', x: '3', y: '16', rx: '1' }], ['path', { d: 'M21 16h-3a2 2 0 0 0-2 2v3' }], ['path', { d: 'M21 21v.01' }], ['path', { d: 'M12 7v3a2 2 0 0 1-2 2H7' }], ['path', { d: 'M3 12h.01' }], ['path', { d: 'M12 3h.01' }], ['path', { d: 'M12 16v.01' }], ['path', { d: 'M16 12h1' }], ['path', { d: 'M21 12v.01' }], ['path', { d: 'M12 21v-1' }]],
  receipt: [['path', { d: 'M13 16H8' }], ['path', { d: 'M14 8H8' }], ['path', { d: 'M16 12H8' }], ['path', { d: 'M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z' }]],
  refresh: [['path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }], ['path', { d: 'M21 3v5h-5' }], ['path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }], ['path', { d: 'M8 16H3v5' }]],
  rotate: [['path', { d: 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' }], ['path', { d: 'M21 3v5h-5' }]],
  sausage: [['path', { d: 'M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3' }], ['path', { d: 'm18.5 6 1.754 3.5a6.48 6.48 0 0 1-1.854 8.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5' }], ['circle', { cx: '12.5', cy: '8.5', r: '2.5' }]],
  search: [['path', { d: 'm21 21-4.34-4.34' }], ['circle', { cx: '11', cy: '11', r: '8' }]],
  send: [['path', { d: 'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z' }], ['path', { d: 'm21.854 2.147-10.94 10.939' }]],
  shield: [['path', { d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' }]],
  shot: [['path', { d: 'M12 12 4.207 4.207A.707.707 0 0 1 4.707 3h14.586a.707.707 0 0 1 .5 1.207z' }], ['path', { d: 'M12 12v10' }], ['path', { d: 'M7 22h10' }]],
  sliders: [['path', { d: 'M10 5H3' }], ['path', { d: 'M12 19H3' }], ['path', { d: 'M14 3v4' }], ['path', { d: 'M16 17v4' }], ['path', { d: 'M21 12h-9' }], ['path', { d: 'M21 19h-5' }], ['path', { d: 'M21 5h-7' }], ['path', { d: 'M8 10v4' }], ['path', { d: 'M8 12H3' }]],
  soda: [['path', { d: 'm6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8' }], ['path', { d: 'M5 8h14' }], ['path', { d: 'M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0' }], ['path', { d: 'm12 8 1-6h2' }]],
  split: [['path', { d: 'M16 3h5v5' }], ['path', { d: 'M8 3H3v5' }], ['path', { d: 'M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3' }], ['path', { d: 'm15 9 6-6' }]],
  stage: [['path', { d: 'M2 10s3-3 3-8' }], ['path', { d: 'M22 10s-3-3-3-8' }], ['path', { d: 'M10 2c0 4.4-3.6 8-8 8' }], ['path', { d: 'M14 2c0 4.4 3.6 8 8 8' }], ['path', { d: 'M2 10s2 2 2 5' }], ['path', { d: 'M22 10s-2 2-2 5' }], ['path', { d: 'M8 15h8' }], ['path', { d: 'M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1' }], ['path', { d: 'M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1' }]],
  star: [['path', { d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z' }]],
  table: [['rect', { width: '20', height: '12', x: '2', y: '6', rx: '2' }]],
  'table-round': [['circle', { cx: '12', cy: '12', r: '10' }]],
  tag: [['path', { d: 'M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z' }], ['circle', { cx: '7.5', cy: '7.5', r: '.5', fill: 'currentColor' }]],
  text: [['path', { d: 'M12 4v16' }], ['path', { d: 'M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2' }], ['path', { d: 'M9 20h6' }]],
  ticket: [['path', { d: 'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z' }], ['path', { d: 'M13 5v2' }], ['path', { d: 'M13 17v2' }], ['path', { d: 'M13 11v2' }]],
  trash: [['path', { d: 'M10 11v6' }], ['path', { d: 'M14 11v6' }], ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }], ['path', { d: 'M3 6h18' }], ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }]],
  undo: [['path', { d: 'M9 14 4 9l5-5' }], ['path', { d: 'M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11' }]],
  user: [['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }], ['circle', { cx: '12', cy: '7', r: '4' }]],
  users: [['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }], ['path', { d: 'M16 3.128a4 4 0 0 1 0 7.744' }], ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }], ['circle', { cx: '9', cy: '7', r: '4' }]],
  utensils: [['path', { d: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2' }], ['path', { d: 'M7 2v20' }], ['path', { d: 'M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7' }]],
  wall: [['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }], ['path', { d: 'M12 9v6' }], ['path', { d: 'M16 15v6' }], ['path', { d: 'M16 3v6' }], ['path', { d: 'M3 15h18' }], ['path', { d: 'M3 9h18' }], ['path', { d: 'M8 15v6' }], ['path', { d: 'M8 3v6' }]],
  water: [['path', { d: 'M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z' }], ['path', { d: 'M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0' }]],
  wifi: [['path', { d: 'M12 20h.01' }], ['path', { d: 'M2 8.82a15 15 0 0 1 20 0' }], ['path', { d: 'M5 12.859a10 10 0 0 1 14 0' }], ['path', { d: 'M8.5 16.429a5 5 0 0 1 7 0' }]],
  'wifi-off': [['path', { d: 'M12 20h.01' }], ['path', { d: 'M8.5 16.429a5 5 0 0 1 7 0' }], ['path', { d: 'M5 12.859a10 10 0 0 1 5.17-2.69' }], ['path', { d: 'M19 12.859a10 10 0 0 0-2.007-1.523' }], ['path', { d: 'M2 8.82a15 15 0 0 1 4.177-2.643' }], ['path', { d: 'M22 8.82a15 15 0 0 0-11.288-3.764' }], ['path', { d: 'm2 2 20 20' }]],
  wine: [['path', { d: 'M8 22h8' }], ['path', { d: 'M7 10h10' }], ['path', { d: 'M12 15v7' }], ['path', { d: 'M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z' }]],
  x: [['path', { d: 'M18 6 6 18' }], ['path', { d: 'm6 6 12 12' }]],
  'x-circle': [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'm15 9-6 6' }], ['path', { d: 'm9 9 6 6' }]],
  'zoom-in': [['circle', { cx: '11', cy: '11', r: '8' }], ['line', { 'x1': '21', 'x2': '16.65', 'y1': '21', 'y2': '16.65' }], ['line', { 'x1': '11', 'x2': '11', 'y1': '8', 'y2': '14' }], ['line', { 'x1': '8', 'x2': '14', 'y1': '11', 'y2': '11' }]],
  'zoom-out': [['circle', { cx: '11', cy: '11', r: '8' }], ['line', { 'x1': '21', 'x2': '16.65', 'y1': '21', 'y2': '16.65' }], ['line', { 'x1': '8', 'x2': '14', 'y1': '11', 'y2': '11' }]],
};
