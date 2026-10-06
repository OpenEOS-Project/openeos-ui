/* Automatisch erzeugt von scripts/build-icons.mjs — nicht von Hand ändern.
   Quelle: src/icons/svg/*.svg. Neu bauen mit `pnpm icons`. */

export type IconNodeTag = 'path' | 'circle' | 'rect';
export type IconNode = readonly [tag: IconNodeTag, attrs: Readonly<Record<string, string>>];

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

/** Kindelemente je Icon; das umgebende <svg> setzt Icon bzw. iconSvg. */
export const ICON_NODES: Readonly<Record<IconName, readonly IconNode[]>> = {
  alert: [['path', { d: 'M12 3.5 2.5 20h19z' }], ['path', { d: 'M12 10v4.5' }], ['circle', { cx: '12', cy: '17.3', r: '1.1', fill: 'currentColor', stroke: 'none' }]],
  'arrow-right': [['path', { d: 'M5 12h14M13 6l6 6-6 6' }]],
  backspace: [['path', { d: 'M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z' }], ['path', { d: 'M12 9l6 6M18 9l-6 6' }]],
  beer: [['path', { d: 'M5 8h10v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z' }], ['path', { d: 'M15 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2' }], ['path', { d: 'M5 8a2.5 2.5 0 0 1 2.5-3 3 3 0 0 1 5 0A2.5 2.5 0 0 1 15 8' }], ['path', { d: 'M8.5 12v5M11.5 12v5' }]],
  bell: [['path', { d: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z' }], ['path', { d: 'M10 20a2 2 0 0 0 4 0' }]],
  bottle: [['path', { d: 'M10 3h4v3l1.5 2.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V8.5L10 6z' }], ['path', { d: 'M8.5 12h7M8.5 16h7' }]],
  box: [['path', { d: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z' }], ['path', { d: 'M4 7.5l8 4.5 8-4.5M12 12v9' }]],
  bread: [['path', { d: 'M5 11a4 4 0 0 1 2-7.5h10A4 4 0 0 1 19 11v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z' }], ['path', { d: 'M9.5 11v5M14.5 11v5' }]],
  cake: [['path', { d: 'M4 20h16' }], ['path', { d: 'M5 20v-7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7' }], ['path', { d: 'M5 15.5c1.2 0 1.8-1 3.5-1s2.3 1 3.5 1 1.8-1 3.5-1 2.3 1 3.5 1' }], ['path', { d: 'M12 12V8.5' }], ['path', { d: 'M12 4c.9.9.9 2 0 2.7-.9-.7-.9-1.8 0-2.7z' }]],
  calendar: [['rect', { x: '3', y: '5', width: '18', height: '16', rx: '2' }], ['path', { d: 'M8 3v4M16 3v4M3 10h18' }]],
  card: [['rect', { x: '3', y: '5', width: '18', height: '14', rx: '2' }], ['path', { d: 'M3 10h18M7 15h3' }]],
  cart: [['path', { d: 'M3 4h2.2l2.1 11.1a1 1 0 0 0 1 .9h9.4a1 1 0 0 0 1-.8L20.5 8H6' }], ['circle', { cx: '9.5', cy: '20', r: '1.4' }], ['circle', { cx: '17', cy: '20', r: '1.4' }]],
  'cart-plus': [['path', { d: 'M3 4h2.2l2.1 11.1a1 1 0 0 0 1 .9h9.4a1 1 0 0 0 1-.8L20.5 8H6' }], ['circle', { cx: '9.5', cy: '20', r: '1.4' }], ['circle', { cx: '17', cy: '20', r: '1.4' }], ['path', { d: 'M13 9.5v4M11 11.5h4' }]],
  cash: [['rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }], ['circle', { cx: '12', cy: '12', r: '2.5' }], ['path', { d: 'M6 10v4M18 10v4' }]],
  chart: [['path', { d: 'M4 20V4M4 20h16' }], ['path', { d: 'M8 16l4-5 3 3 5-7' }]],
  check: [['path', { d: 'M4.5 12.5l5 5L19.5 7' }]],
  'check-circle': [['circle', { cx: '12', cy: '12', r: '9' }], ['path', { d: 'M8 12.5l2.5 2.5 5-5' }]],
  chef: [['path', { d: 'M7 14a4 4 0 0 1-.5-8A5 5 0 0 1 12 3a5 5 0 0 1 5.5 3 4 4 0 0 1-.5 8v6H7z' }], ['path', { d: 'M7 17h10' }]],
  'chevron-down': [['path', { d: 'M6 9l6 6 6-6' }]],
  'chevron-left': [['path', { d: 'M15 6l-6 6 6 6' }]],
  'chevron-right': [['path', { d: 'M9 6l6 6-6 6' }]],
  'chevron-up': [['path', { d: 'M6 15l6-6 6 6' }]],
  clock: [['circle', { cx: '12', cy: '12', r: '9' }], ['path', { d: 'M12 7v5l3 2' }]],
  coffee: [['path', { d: 'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z' }], ['path', { d: 'M16 10h1.5a2.5 2.5 0 0 1 0 5H16' }], ['path', { d: 'M8.5 3.5c0 1 1 1.5 1 2.5M12.5 3.5c0 1 1 1.5 1 2.5' }], ['path', { d: 'M4 21h14' }]],
  contactless: [['path', { d: 'M8 8.5a5 5 0 0 1 0 7' }], ['path', { d: 'M11.5 6a9 9 0 0 1 0 12' }], ['path', { d: 'M15 3.5a13 13 0 0 1 0 17' }]],
  copy: [['rect', { x: '9', y: '9', width: '11', height: '11', rx: '2' }], ['path', { d: 'M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3' }]],
  dashboard: [['rect', { x: '3', y: '3', width: '7', height: '9', rx: '1' }], ['rect', { x: '14', y: '3', width: '7', height: '5', rx: '1' }], ['rect', { x: '14', y: '12', width: '7', height: '9', rx: '1' }], ['rect', { x: '3', y: '16', width: '7', height: '5', rx: '1' }]],
  deposit: [['path', { d: 'M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3' }], ['path', { d: 'M18 3v4h-4M6 21v-4h4' }]],
  device: [['rect', { x: '5', y: '2', width: '14', height: '20', rx: '2' }], ['path', { d: 'M11 18h2' }]],
  download: [['path', { d: 'M12 4v11M7 10l5 5 5-5M4 20h16' }]],
  drawer: [['path', { d: 'M5 13 6.5 5h11l1.5 8' }], ['path', { d: 'M3 13h18v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z' }], ['path', { d: 'M10 16.5h4' }], ['path', { d: 'M9.5 8.5h5' }]],
  edit: [['path', { d: 'M4 20h4L19 9l-4-4L4 16z' }], ['path', { d: 'M13.5 6.5l4 4' }]],
  eye: [['path', { d: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z' }], ['circle', { cx: '12', cy: '12', r: '3' }]],
  filter: [['path', { d: 'M4 5h16l-6 8v6l-4-2v-4z' }]],
  flame: [['path', { d: 'M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .3 2 1.2 3 2.5 3 0-3-1-5 0-8z' }]],
  fries: [['path', { d: 'M6 10h12l-1.5 10.1a1 1 0 0 1-1 .9h-7a1 1 0 0 1-1-.9z' }], ['path', { d: 'M8 10l-.6-6M11 10V3M14 10l.6-6M16.6 10l1-5' }]],
  grid: [['rect', { x: '4', y: '4', width: '7', height: '7', rx: '1' }], ['rect', { x: '13', y: '4', width: '7', height: '7', rx: '1' }], ['rect', { x: '4', y: '13', width: '7', height: '7', rx: '1' }], ['rect', { x: '13', y: '13', width: '7', height: '7', rx: '1' }]],
  history: [['path', { d: 'M3 12a9 9 0 1 0 2.64-6.36L3 8' }], ['path', { d: 'M3 3.5V8h4.5' }], ['path', { d: 'M12 7.5V12l3 2' }]],
  home: [['path', { d: 'M3 11l9-7 9 7' }], ['path', { d: 'M5 9.5V20h14V9.5' }]],
  icecream: [['path', { d: 'M8 11l4 10 4-10' }], ['path', { d: 'M7 11a5 5 0 1 1 10 0z' }]],
  info: [['circle', { cx: '12', cy: '12', r: '9' }], ['path', { d: 'M12 11v5' }], ['circle', { cx: '12', cy: '8', r: '1.1', fill: 'currentColor', stroke: 'none' }]],
  leaf: [['path', { d: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15' }], ['path', { d: 'M5 19l7-7' }]],
  list: [['path', { d: 'M9 6h12M9 12h12M9 18h12' }], ['circle', { cx: '4.5', cy: '6', r: '1.1', fill: 'currentColor', stroke: 'none' }], ['circle', { cx: '4.5', cy: '12', r: '1.1', fill: 'currentColor', stroke: 'none' }], ['circle', { cx: '4.5', cy: '18', r: '1.1', fill: 'currentColor', stroke: 'none' }]],
  lock: [['rect', { x: '5', y: '11', width: '14', height: '10', rx: '2' }], ['path', { d: 'M8 11V8a4 4 0 0 1 8 0v3' }]],
  logout: [['path', { d: 'M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4' }], ['path', { d: 'M15 16l4-4-4-4M19 12H9' }]],
  mail: [['rect', { x: '3', y: '5', width: '18', height: '14', rx: '2' }], ['path', { d: 'M3 7l9 6 9-6' }]],
  map: [['path', { d: 'M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z' }], ['path', { d: 'M9 4v13.5M15 6.5V20' }]],
  minus: [['path', { d: 'M5 12h14' }]],
  more: [['circle', { cx: '5', cy: '12', r: '1.1', fill: 'currentColor', stroke: 'none' }], ['circle', { cx: '12', cy: '12', r: '1.1', fill: 'currentColor', stroke: 'none' }], ['circle', { cx: '19', cy: '12', r: '1.1', fill: 'currentColor', stroke: 'none' }]],
  note: [['path', { d: 'M5 3h10l4 4v14H5z' }], ['path', { d: 'M15 3v4h4M8 12h8M8 16h5' }]],
  orders: [['rect', { x: '4', y: '4', width: '16', height: '16', rx: '2' }], ['path', { d: 'M8 9h8M8 13h5' }]],
  percent: [['path', { d: 'M19 5 5 19' }], ['circle', { cx: '7', cy: '7', r: '2.5' }], ['circle', { cx: '17', cy: '17', r: '2.5' }]],
  pin: [['path', { d: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z' }], ['circle', { cx: '12', cy: '10', r: '2.5' }]],
  plus: [['path', { d: 'M12 5v14M5 12h14' }]],
  print: [['path', { d: 'M7 9V3h10v6' }], ['path', { d: 'M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2' }], ['rect', { x: '7', y: '14', width: '10', height: '7' }]],
  printer: [['path', { d: 'M7 9V3h10v6' }], ['rect', { x: '4', y: '9', width: '16', height: '8', rx: '1' }], ['path', { d: 'M7 14h10v7H7z' }]],
  qr: [['rect', { x: '3', y: '3', width: '7', height: '7', rx: '1' }], ['rect', { x: '14', y: '3', width: '7', height: '7', rx: '1' }], ['rect', { x: '3', y: '14', width: '7', height: '7', rx: '1' }], ['path', { d: 'M14 14h3v3h-3zM20 14v.01M14 20v.01M17 20h4v-3' }]],
  receipt: [['path', { d: 'M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z' }], ['path', { d: 'M9 8h6M9 12h6M9 16h3' }]],
  refresh: [['path', { d: 'M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4' }], ['path', { d: 'M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4' }]],
  rotate: [['path', { d: 'M20 12a8 8 0 1 1-2.34-5.66L20 8.5' }], ['path', { d: 'M20 4v4.5h-4.5' }]],
  sausage: [['path', { d: 'M5 15 15 5a2.83 2.83 0 0 1 4 4L9 19a2.83 2.83 0 0 1-4-4z' }], ['path', { d: 'M9.5 12.5l2 2M12.5 9.5l2 2' }]],
  search: [['circle', { cx: '11', cy: '11', r: '7' }], ['path', { d: 'M20 20l-3.5-3.5' }]],
  send: [['path', { d: 'M21 3 10 14' }], ['path', { d: 'M21 3l-7 18-4-7-7-4z' }]],
  shield: [['path', { d: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z' }], ['path', { d: 'M8.5 12l2.5 2.5 4.5-4.5' }]],
  shot: [['path', { d: 'M6 5h12l-1.5 14a1.5 1.5 0 0 1-1.5 1.3H9a1.5 1.5 0 0 1-1.5-1.3z' }], ['path', { d: 'M6.8 11h10.4' }]],
  sliders: [['path', { d: 'M4 7h10M18 7h2M4 17h4M12 17h8' }], ['circle', { cx: '16', cy: '7', r: '2' }], ['circle', { cx: '10', cy: '17', r: '2' }]],
  soda: [['path', { d: 'M6 8h12l-1.4 12.1a1 1 0 0 1-1 .9H8.4a1 1 0 0 1-1-.9z' }], ['path', { d: 'M5 8h14' }], ['path', { d: 'M12 8l1.5-5h3' }]],
  split: [['path', { d: 'M12 3v18' }], ['path', { d: 'M8 7 4 11l4 4M16 7l4 4-4 4' }]],
  stage: [['path', { d: 'M3 20h18' }], ['path', { d: 'M4 20v-5h16v5' }], ['path', { d: 'M3 4h18' }], ['path', { d: 'M5 4c0 3.5 1.5 6 4 6M19 4c0 3.5-1.5 6-4 6' }]],
  star: [['path', { d: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z' }]],
  table: [['rect', { x: '3', y: '8', width: '18', height: '3', rx: '1' }], ['path', { d: 'M6 11v8M18 11v8M4 15h16' }]],
  'table-round': [['circle', { cx: '12', cy: '12', r: '5' }], ['path', { d: 'M9 3.5h6M9 20.5h6M3.5 9v6M20.5 9v6' }]],
  tag: [['path', { d: 'M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z' }], ['circle', { cx: '7.5', cy: '7.5', r: '1.5' }]],
  text: [['path', { d: 'M5 7.5V5h14v2.5' }], ['path', { d: 'M12 5v14' }], ['path', { d: 'M9.5 19h5' }]],
  ticket: [['path', { d: 'M4 7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4z' }], ['path', { d: 'M14 8v1M14 11.5v1M14 15v1' }]],
  trash: [['path', { d: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6' }]],
  undo: [['path', { d: 'M8 5 4 9l4 4' }], ['path', { d: 'M4 9h11a5 5 0 0 1 0 10h-3' }]],
  user: [['circle', { cx: '12', cy: '8', r: '4' }], ['path', { d: 'M4 21a8 8 0 0 1 16 0' }]],
  users: [['circle', { cx: '9', cy: '8', r: '3.5' }], ['path', { d: 'M2.5 20a6.5 6.5 0 0 1 13 0' }], ['path', { d: 'M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6' }]],
  utensils: [['path', { d: 'M6 3v6a3 3 0 0 0 6 0V3M9 3v18' }], ['path', { d: 'M17 3c-1.7 1-2.5 3.5-2.5 6.5V14H17v7' }]],
  wall: [['rect', { x: '3', y: '5', width: '18', height: '14', rx: '1' }], ['path', { d: 'M3 9.7h18M3 14.3h18' }], ['path', { d: 'M9 5v4.7M15 5v4.7M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19' }]],
  water: [['path', { d: 'M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z' }], ['path', { d: 'M9 14.5a3 3 0 0 0 3 3' }]],
  wifi: [['path', { d: 'M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0' }], ['circle', { cx: '12', cy: '19.5', r: '1.1', fill: 'currentColor', stroke: 'none' }]],
  'wifi-off': [['path', { d: 'M2 9a15 15 0 0 1 5-3.3M22 9a15 15 0 0 0-9.5-4M5.5 12.5a10 10 0 0 1 4-2.2M18.5 12.5a10 10 0 0 0-2-1.5M9 16a5 5 0 0 1 6 0' }], ['circle', { cx: '12', cy: '19.5', r: '1.1', fill: 'currentColor', stroke: 'none' }], ['path', { d: 'M3 3l18 18' }]],
  wine: [['path', { d: 'M8 3h8l-.4 5a3.6 3.6 0 0 1-7.2 0z' }], ['path', { d: 'M12 11.6V20M8.5 20h7' }], ['path', { d: 'M8.3 6h7.4' }]],
  x: [['path', { d: 'M6 6l12 12M18 6 6 18' }]],
  'x-circle': [['circle', { cx: '12', cy: '12', r: '9' }], ['path', { d: 'M9 9l6 6M15 9l-6 6' }]],
  'zoom-in': [['circle', { cx: '11', cy: '11', r: '7' }], ['path', { d: 'M20 20l-3.5-3.5' }], ['path', { d: 'M11 8v6M8 11h6' }]],
  'zoom-out': [['circle', { cx: '11', cy: '11', r: '7' }], ['path', { d: 'M20 20l-3.5-3.5' }], ['path', { d: 'M8 11h6' }]],
};
