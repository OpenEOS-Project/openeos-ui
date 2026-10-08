import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './icon';
import type { IconName } from '../icons/generated';
import {
  FLOOR_MAX_POINTS,
  FLOOR_MIN_LINE_POINTS,
  FLOOR_MIN_POLYGON_POINTS,
  clampPoint,
  edgeMidpoints,
  insertPoint,
  movePoints,
  moveRect,
  pointsAttr,
  polygonCentroid,
  pxToUnits,
  rectOutline,
  removePoint,
  replacePoint,
  resizeRect,
  samePoint,
  snapPoint,
  tableIssue,
  toPercent,
  type FloorPoint,
  type FloorRect,
  type FloorTableIssue,
} from './floor-plan-math';
import { bem, cx } from './utils';

/* ---------- Typen ---------- */

export interface FloorTable {
  id: string;
  label: string;
  shape: 'rect' | 'round';
  /** Position und Größe in Einheiten des Bereichs, Drehung in Grad. */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  seats?: number | null;
  /** Farbe wie TableChip: frei, offen, wartet auf Bedienung. */
  state?: 'free' | 'busy' | 'wait';
  /** Kleine Zeile unter der Bezeichnung (Ansicht), z. B. offener Betrag. */
  hint?: ReactNode;
  disabled?: boolean;
}

/** Rechteckiges Deko-Element (Theke, Wand als Rechteck, Bühne, Beschriftung). */
export interface FloorDecor {
  id: string;
  type: 'bar' | 'wall' | 'stage' | 'label';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label?: string;
}

/** Wand als Linienzug (seit 0.6.0). Punkte und Stärke in Einheiten. */
export interface FloorWall {
  id: string;
  points: ReadonlyArray<FloorPoint>;
  /** Default `FLOOR_WALL_THICKNESS` (10). */
  thickness?: number;
}

export type FloorZoneType = 'kitchen' | 'blocked' | 'bar' | 'other';

/**
 * Zone als Polygon (seit 0.6.0): reine Darstellung, keine Tische.
 * Farbe kommt aus dem Typ, `blocked` ist schraffiert.
 */
export interface FloorZone {
  id: string;
  zoneType: FloorZoneType;
  points: ReadonlyArray<FloorPoint>;
  label?: string;
}

/** Werkzeug im Bearbeitungsmodus. */
export type FloorTool = 'select' | 'wall' | 'zone' | 'outline';

/** Was sich auswählen lässt. */
export type FloorItemKind = 'table' | 'decor' | 'wall' | 'zone';
/** Rechteckige Elemente (Ziehen, Eckgriff, Drehung). */
export type FloorRectKind = 'table' | 'decor';
/** Elemente aus Punkten. */
export type FloorShapeKind = 'wall' | 'zone';

export interface FloorChange {
  id: string;
  kind: FloorRectKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface FloorShapeChange {
  id: string;
  kind: FloorShapeKind;
  points: FloorPoint[];
}

export interface FloorShapeDraft {
  kind: FloorShapeKind;
  points: FloorPoint[];
}

/** Texte des Plans; alle mit deutschem Default. `{n}` wird ersetzt. */
export interface FloorPlanLabels {
  zoneTypes: Record<FloorZoneType, string>;
  wall: string;
  outline: string;
  /** aria-label eines Punktgriffs, z. B. „Punkt {n}“. */
  point: string;
  addPoint: string;
  drawWall: string;
  drawZone: string;
  editOutline: string;
  done: string;
  cancel: string;
  undoPoint: string;
  outside: string;
  blocked: string;
}

export const FLOOR_LABELS_DE: FloorPlanLabels = {
  zoneTypes: { kitchen: 'Küche', blocked: 'Gesperrt', bar: 'Bar/Theke', other: 'Sonstiges' },
  wall: 'Wand',
  outline: 'Raumform',
  point: 'Punkt {n}',
  addPoint: 'Punkt einfügen',
  drawWall: 'Wand zeichnen: Punkte setzen, Doppelklick oder „Fertig“ beendet.',
  drawZone: 'Zone zeichnen: mindestens drei Punkte setzen, Doppelklick oder „Fertig“ beendet.',
  editOutline: 'Raumform: Ecken ziehen, an den Kantenmitten Punkte einfügen, Entf löscht den gewählten Punkt.',
  done: 'Fertig',
  cancel: 'Abbrechen',
  undoPoint: 'Letzten Punkt entfernen',
  outside: 'außerhalb des Raums',
  blocked: 'im gesperrten Bereich',
};

/** Wandstärke ohne eigene Angabe, in Einheiten. */
export const FLOOR_WALL_THICKNESS = 10;

export interface FloorPlanProps {
  /** Bereichsgröße in Einheiten. */
  width: number;
  height: number;
  /** Rasterschritt in Einheiten (Default 20). */
  gridSize?: number;
  tables: ReadonlyArray<FloorTable>;
  /** Rechteckige Deko. */
  decor?: ReadonlyArray<FloorDecor>;
  /** Wände als Linienzug. */
  walls?: ReadonlyArray<FloorWall>;
  /** Zonen (Küche, gesperrt, Bar, Sonstiges). */
  zones?: ReadonlyArray<FloorZone>;
  /** Umriss des Raums; ohne (oder < 3 Punkte) gilt die ganze Fläche. */
  outline?: ReadonlyArray<FloorPoint> | null;
  /** `view` (Kasse, Default) oder `edit` (Verwaltung). */
  mode?: 'view' | 'edit';
  /** edit: Werkzeug (Default `select`). */
  tool?: FloorTool;
  /** view: markierter Tisch (der aktuell geöffnete). */
  currentId?: string | null;
  /** view: Tipp auf einen Tisch. */
  onTableClick?: (id: string) => void;
  /** edit: gewähltes Element. */
  selectedId?: string | null;
  /** edit: Auswahl ändert sich; `null` = Auswahl aufheben. */
  onSelect?: (id: string | null, kind: FloorItemKind) => void;
  /** edit: neue Lage eines Tischs/Deko-Elements nach Loslassen bzw. Pfeiltaste. */
  onCommit?: (change: FloorChange) => void;
  /** edit: neue Punkte einer Wand/Zone (Punkt gezogen, eingefügt, gelöscht, Form verschoben). */
  onShapeCommit?: (change: FloorShapeChange) => void;
  /** edit: Wand bzw. Zone fertig gezeichnet (Werkzeug `wall`/`zone`). */
  onShapeCreate?: (shape: FloorShapeDraft) => void;
  /** edit: neuer Umriss (Werkzeug `outline`). */
  onOutlineCommit?: (points: FloorPoint[]) => void;
  /** edit: Esc bzw. „Abbrechen“ ohne angefangene Zeichnung, „Fertig“ beim Umriss — z. B. zurück zur Auswahl. */
  onToolCancel?: () => void;
  /** edit: Entf bzw. Rücktaste (ohne gewählten Punkt). */
  onDelete?: (id: string, kind: FloorItemKind) => void;
  /** edit: Strg/Cmd+D. */
  onDuplicate?: (id: string, kind: FloorItemKind) => void;
  /** edit: auf das Raster (und beim Zeichnen auf 0/45/90°) einrasten (Default true). */
  snap?: boolean;
  /** edit: Raster anzeigen (Default true). */
  showGrid?: boolean;
  /** edit: Tische außerhalb des Umrisses bzw. in gesperrten Zonen markieren (Default true). */
  showIssues?: boolean;
  /** Mindestmaßstab in px je Einheit (Default 0,5) — darunter scrollt die Hülle waagerecht. */
  minScale?: number;
  /** aria-label je Tisch; Default „Tisch {label}, {seats} Plätze“. */
  tableLabel?: (table: FloorTable) => string;
  /** edit: aria-label je Deko-Element; Default „Theke“, „Wand“, „Bühne“, Beschriftung. */
  decorLabel?: (decor: FloorDecor) => string;
  /** Beschriftung einer Zone; Default `label` bzw. Name des Typs. */
  zoneLabel?: (zone: FloorZone) => string;
  /** Texte (Werkzeuge, Griffe, Warnungen). */
  labels?: Partial<FloorPlanLabels>;
  className?: string;
  'aria-label'?: string;
}

/* ---------- Hilfen ---------- */

const DECOR_NAMES: Record<FloorDecor['type'], string> = {
  bar: 'Theke',
  wall: 'Wand',
  stage: 'Bühne',
  label: 'Beschriftung',
};

const ZONE_ICONS: Record<FloorZoneType, IconName> = {
  kitchen: 'chef',
  blocked: 'ban',
  bar: 'beer',
  other: 'zone',
};

const OUTLINE_KEY = '__outline';

const defaultTableLabel = (table: FloorTable) =>
  table.seats ? `Tisch ${table.label}, ${table.seats} Plätze` : `Tisch ${table.label}`;
const defaultDecorLabel = (decor: FloorDecor) => decor.label || DECOR_NAMES[decor.type];

/** Lage als CSS-Variablen in Prozent — die einzigen Inline-Styles des Plans. */
function placement(rect: FloorRect & { rotation: number }, width: number, height: number): CSSProperties {
  return {
    '--x': toPercent(rect.x, width),
    '--y': toPercent(rect.y, height),
    '--w': toPercent(rect.width, width),
    '--h': toPercent(rect.height, height),
    '--r': `${rect.rotation}deg`,
  } as CSSProperties;
}

function at(point: FloorPoint, width: number, height: number): CSSProperties {
  return { '--x': toPercent(point.x, width), '--y': toPercent(point.y, height) } as CSSProperties;
}

/** SVG-Pfad: ganze Fläche minus Umriss (gerade/ungerade) — der Bereich außerhalb. */
function outsidePath(points: ReadonlyArray<FloorPoint>, width: number, height: number): string {
  return `M0 0H${width}V${height}H0Z M${points.map((p) => `${p.x} ${p.y}`).join(' L')}Z`;
}

const isEditable = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  if (!el || typeof el.closest !== 'function') return false;
  return !!el.closest('input, textarea, select, [contenteditable="true"]');
};

interface DragState {
  id: string;
  kind: FloorRectKind;
  mode: 'move' | 'resize';
  pointerId: number;
  startX: number;
  startY: number;
  origin: FloorRect;
  rotation: number;
  rect: FloorRect;
  moved: boolean;
}

/** Ziehen eines Punkts oder einer ganzen Form (Wand, Zone, Umriss). */
interface PointDragState {
  key: string;
  kind: FloorShapeKind | 'outline';
  mode: 'point' | 'shape';
  index: number;
  pointerId: number;
  start: FloorPoint;
  origin: FloorPoint[];
  points: FloorPoint[];
  moved: boolean;
  /** Punkt wurde an einer Kantenmitte erst eingefügt → auch ohne Ziehen speichern. */
  inserted: boolean;
}

type PointOwner = FloorShapeKind | 'outline';

/* ---------- Komponente ---------- */

/**
 * Tischplan eines Bereichs. Die Fläche skaliert über aspect-ratio, alle
 * Lagen sind Prozentwerte bzw. SVG-Koordinaten in Einheiten — dieselben
 * Daten sehen in Kasse und Verwaltung gleich aus. Bearbeiten über Pointer
 * Events (Maus, Stift, Finger): Ziehen verschiebt, der Eckgriff ändert die
 * Größe, Punktgriffe formen Wände, Zonen und den Umriss; gespeichert wird
 * erst beim Loslassen.
 */
export function FloorPlan({
  width,
  height,
  gridSize = 20,
  tables,
  decor = [],
  walls = [],
  zones = [],
  outline,
  mode = 'view',
  tool = 'select',
  currentId,
  onTableClick,
  selectedId,
  onSelect,
  onCommit,
  onShapeCommit,
  onShapeCreate,
  onOutlineCommit,
  onToolCancel,
  onDelete,
  onDuplicate,
  snap = true,
  showGrid = true,
  showIssues = true,
  minScale = 0.5,
  tableLabel = defaultTableLabel,
  decorLabel = defaultDecorLabel,
  zoneLabel,
  labels: labelOverrides,
  className,
  ...rest
}: FloorPlanProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const pointDragRef = useRef<PointDragState | null>(null);
  const [draft, setDraft] = useState<{ id: string; rect: FloorRect } | null>(null);
  const [pointDraft, setPointDraft] = useState<{ key: string; points: FloorPoint[] } | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{ key: string; index: number } | null>(null);
  const [drawing, setDrawing] = useState<FloorPoint[]>([]);
  const [hover, setHover] = useState<FloorPoint | null>(null);

  const labels: FloorPlanLabels = {
    ...FLOOR_LABELS_DE,
    ...labelOverrides,
    zoneTypes: { ...FLOOR_LABELS_DE.zoneTypes, ...labelOverrides?.zoneTypes },
  };
  const editing = mode === 'edit';
  const activeTool: FloorTool = editing ? tool : 'select';
  const drawKind: FloorShapeKind | null = activeTool === 'wall' || activeTool === 'zone' ? activeTool : null;
  const area = { width, height };
  const grid = snap ? gridSize : 0;
  const outlinePoints = outline && outline.length >= 3 ? outline : null;
  const editOutline = activeTool === 'outline';
  const nameOfZone = (zone: FloorZone) =>
    zoneLabel ? zoneLabel(zone) : zone.label || labels.zoneTypes[zone.zoneType];

  const surfaceStyle = {
    '--oe-floor-w': width,
    '--oe-floor-h': height,
    '--oe-floor-grid': `${toPercent(gridSize, width)} ${toPercent(gridSize, height)}`,
    '--oe-floor-min-w': `${Math.round(width * minScale)}px`,
  } as CSSProperties;

  const rectOf = (item: FloorRect & { id: string }): FloorRect =>
    draft && draft.id === item.id ? draft.rect : { x: item.x, y: item.y, width: item.width, height: item.height };
  const pointsOf = (key: string, points: ReadonlyArray<FloorPoint>): ReadonlyArray<FloorPoint> =>
    pointDraft && pointDraft.key === key ? pointDraft.points : points;

  /** Bildschirm → Einheiten (ohne Einrasten). */
  const toUnits = (clientX: number, clientY: number): FloorPoint => {
    const surface = surfaceRef.current;
    if (!surface) return { x: 0, y: 0 };
    const box = surface.getBoundingClientRect();
    return {
      x: box.width > 0 ? ((clientX - box.left) * width) / box.width : 0,
      y: box.height > 0 ? ((clientY - box.top) * height) / box.height : 0,
    };
  };

  /* --- Zeichnen (Werkzeug Wand/Zone) --- */

  const minPoints = drawKind === 'wall' ? FLOOR_MIN_LINE_POINTS : FLOOR_MIN_POLYGON_POINTS;

  const finishDrawing = () => {
    if (!drawKind) return;
    if (drawing.length >= minPoints) onShapeCreate?.({ kind: drawKind, points: drawing });
    setDrawing([]);
    setHover(null);
  };
  const cancelDrawing = () => {
    if (drawing.length > 0) {
      setDrawing([]);
      setHover(null);
    } else {
      onToolCancel?.();
    }
  };
  const undoPoint = () => setDrawing((points) => points.slice(0, -1));

  const drawingRef = useRef({ count: 0, finish: finishDrawing, cancel: cancelDrawing, undo: undoPoint });
  drawingRef.current = { count: drawing.length, finish: finishDrawing, cancel: cancelDrawing, undo: undoPoint };

  // Werkzeugwechsel verwirft die angefangene Zeichnung und die Punktauswahl.
  useEffect(() => {
    setDrawing([]);
    setHover(null);
    setSelectedPoint(null);
  }, [tool, mode]);

  // Tastatur beim Zeichnen: Esc bricht ab, Enter beendet, Rücktaste nimmt den letzten Punkt.
  useEffect(() => {
    if (!drawKind) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditable(event.target)) return;
      const current = drawingRef.current;
      if (event.key === 'Escape') {
        event.preventDefault();
        current.cancel();
      } else if (event.key === 'Enter' && current.count > 0) {
        event.preventDefault();
        current.finish();
      } else if ((event.key === 'Backspace' || event.key === 'Delete') && current.count > 0) {
        event.preventDefault();
        current.undo();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawKind]);

  const nextDrawPoint = (event: { clientX: number; clientY: number }) =>
    snapPoint(toUnits(event.clientX, event.clientY), area, grid, snap ? drawing[drawing.length - 1] ?? null : null);

  const onDrawClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!drawKind || event.button !== 0) return;
    if (event.detail >= 2) {
      finishDrawing();
      return;
    }
    const point = nextDrawPoint(event);
    const first = drawing[0];
    // Zone schließen: Tipp auf den ersten Punkt (± 12 px).
    if (drawKind === 'zone' && first && drawing.length >= FLOOR_MIN_POLYGON_POINTS && surfaceRef.current) {
      const tolerance = pxToUnits(12, width, surfaceRef.current.clientWidth || 1);
      const raw = toUnits(event.clientX, event.clientY);
      if (Math.hypot(raw.x - first.x, raw.y - first.y) <= tolerance) {
        finishDrawing();
        return;
      }
    }
    if (samePoint(point, drawing[drawing.length - 1]) || drawing.length >= FLOOR_MAX_POINTS) return;
    setDrawing([...drawing, point]);
  };

  const onDrawMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawKind || drawing.length === 0 || event.pointerType === 'touch') return;
    const point = nextDrawPoint(event);
    if (!samePoint(point, hover)) setHover(point);
  };

  /* --- Tische und Deko: Ziehen und Größe ändern --- */

  const startDrag = (
    event: ReactPointerEvent<HTMLElement>,
    item: FloorRect & { id: string; rotation: number },
    kind: FloorRectKind,
    dragMode: DragState['mode'],
  ) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    setSelectedPoint(null);
    if (selectedId !== item.id) onSelect?.(item.id, kind);
    event.currentTarget.setPointerCapture(event.pointerId);
    const origin = { x: item.x, y: item.y, width: item.width, height: item.height };
    dragRef.current = {
      id: item.id,
      kind,
      mode: dragMode,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin,
      rotation: item.rotation,
      rect: origin,
      moved: false,
    };
  };

  const onDragMove = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragRef.current;
    const surface = surfaceRef.current;
    if (!state || !surface || state.pointerId !== event.pointerId) return;
    const px = event.clientX - state.startX;
    const py = event.clientY - state.startY;
    // Kleine Zitterbewegungen beim Antippen sind kein Ziehen.
    if (!state.moved && Math.hypot(px, py) < 3) return;
    state.moved = true;
    const dx = pxToUnits(px, width, surface.clientWidth);
    const dy = pxToUnits(py, width, surface.clientWidth);
    state.rect =
      state.mode === 'move'
        ? moveRect(state.origin, dx, dy, area, grid)
        : resizeRect(state.origin, dx, dy, area, grid);
    setDraft({ id: state.id, rect: state.rect });
  };

  const onDragEnd = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDraft(null);
    if (state.moved && event.type !== 'pointercancel') {
      onCommit?.({ id: state.id, kind: state.kind, ...state.rect, rotation: state.rotation });
    }
  };

  /* --- Punkte und Formen ziehen --- */

  const commitPoints = (key: string, kind: PointOwner, points: FloorPoint[]) => {
    if (kind === 'outline') onOutlineCommit?.(points);
    else onShapeCommit?.({ id: key, kind, points });
  };

  const startPointDrag = (
    event: ReactPointerEvent<Element>,
    key: string,
    kind: PointOwner,
    dragMode: PointDragState['mode'],
    points: ReadonlyArray<FloorPoint>,
    index: number,
    inserted = false,
  ) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const origin = points.slice();
    pointDragRef.current = {
      key,
      kind,
      mode: dragMode,
      index,
      pointerId: event.pointerId,
      start: toUnits(event.clientX, event.clientY),
      origin,
      points: origin,
      moved: false,
      inserted,
    };
    if (inserted) setPointDraft({ key, points: origin });
  };

  const onPointDragMove = (event: ReactPointerEvent<Element>) => {
    const state = pointDragRef.current;
    const surface = surfaceRef.current;
    if (!state || !surface || state.pointerId !== event.pointerId) return;
    const now = toUnits(event.clientX, event.clientY);
    const dx = now.x - state.start.x;
    const dy = now.y - state.start.y;
    if (!state.moved && Math.hypot(dx, dy) < pxToUnits(3, width, surface.clientWidth || 1)) return;
    state.moved = true;
    if (state.mode === 'shape') {
      state.points = movePoints(state.origin, dx, dy, area, grid);
    } else {
      const base = state.origin[state.index]!;
      state.points = replacePoint(state.origin, state.index, snapPoint({ x: base.x + dx, y: base.y + dy }, area, grid));
    }
    setPointDraft({ key: state.key, points: state.points });
  };

  const onPointDragEnd = (event: ReactPointerEvent<Element>) => {
    const state = pointDragRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    pointDragRef.current = null;
    setPointDraft(null);
    if (event.type === 'pointercancel') return;
    if (state.moved || state.inserted) commitPoints(state.key, state.kind, state.points);
  };

  const pointDragHandlers = {
    onPointerMove: onPointDragMove,
    onPointerUp: onPointDragEnd,
    onPointerCancel: onPointDragEnd,
  };

  /* --- Tastatur --- */

  const arrowDelta = (event: ReactKeyboardEvent<Element>): [number, number] | undefined => {
    const s = (gridSize > 0 ? gridSize : 1) * (event.shiftKey ? 5 : 1);
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-s, 0],
      ArrowRight: [s, 0],
      ArrowUp: [0, -s],
      ArrowDown: [0, s],
    };
    return map[event.key];
  };

  const commonKeys = (event: ReactKeyboardEvent<Element>, id: string, kind: FloorItemKind) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setSelectedPoint(null);
      onSelect?.(null, kind);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      onDelete?.(id, kind);
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
      event.preventDefault();
      onDuplicate?.(id, kind);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(id, kind);
    }
  };

  const onItemKeyDown = (
    event: ReactKeyboardEvent<HTMLElement>,
    item: FloorRect & { id: string; rotation: number },
    kind: FloorRectKind,
  ) => {
    const delta = arrowDelta(event);
    if (delta) {
      event.preventDefault();
      const next = moveRect(item, delta[0], delta[1], area, grid);
      if (next.x !== item.x || next.y !== item.y) {
        onCommit?.({ id: item.id, kind, ...next, rotation: item.rotation });
      }
      return;
    }
    commonKeys(event, item.id, kind);
  };

  const deletePoint = (key: string, kind: PointOwner, points: ReadonlyArray<FloorPoint>, index: number) => {
    const min = kind === 'wall' ? FLOOR_MIN_LINE_POINTS : FLOOR_MIN_POLYGON_POINTS;
    const next = removePoint(points, index, min);
    if (!next) return;
    setSelectedPoint(null);
    commitPoints(key, kind, next);
  };

  const onShapeKeyDown = (
    event: ReactKeyboardEvent<Element>,
    id: string,
    kind: FloorShapeKind,
    points: ReadonlyArray<FloorPoint>,
  ) => {
    const delta = arrowDelta(event);
    if (delta) {
      event.preventDefault();
      const next = movePoints(points, delta[0], delta[1], area, grid);
      if (!next.every((p, i) => samePoint(p, points[i]))) onShapeCommit?.({ id, kind, points: next });
      return;
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedPoint?.key === id) {
      event.preventDefault();
      deletePoint(id, kind, points, selectedPoint.index);
      return;
    }
    commonKeys(event, id, kind);
  };

  const onPointKeyDown = (
    event: ReactKeyboardEvent<Element>,
    key: string,
    kind: PointOwner,
    points: ReadonlyArray<FloorPoint>,
    index: number,
  ) => {
    const delta = arrowDelta(event);
    if (delta) {
      event.preventDefault();
      event.stopPropagation();
      const p = points[index]!;
      const next = clampPoint({ x: p.x + delta[0], y: p.y + delta[1] }, area);
      if (!samePoint(next, p)) commitPoints(key, kind, replacePoint(points, index, next));
      return;
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      event.stopPropagation();
      deletePoint(key, kind, points, index);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setSelectedPoint(null);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedPoint({ key, index });
    }
  };

  const editHandlers = (item: FloorRect & { id: string; rotation: number }, kind: FloorRectKind) => ({
    role: 'button' as const,
    tabIndex: activeTool === 'select' ? 0 : -1,
    'aria-pressed': selectedId === item.id,
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => startDrag(event, item, kind, 'move'),
    onPointerMove: onDragMove,
    onPointerUp: onDragEnd,
    onPointerCancel: onDragEnd,
    onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => onItemKeyDown(event, item, kind),
  });

  const handle = (item: FloorRect & { id: string; rotation: number }, kind: FloorRectKind) =>
    editing && activeTool === 'select' && selectedId === item.id ? (
      <span
        className="oe-floor__handle"
        aria-hidden
        onPointerDown={(event) => startDrag(event, item, kind, 'resize')}
      />
    ) : null;

  /** Griffe für Punkte und Kantenmitten einer Form bzw. des Umrisses. */
  const pointHandles = (key: string, kind: PointOwner, points: ReadonlyArray<FloorPoint>, closed: boolean) => (
    <>
      {points.length < FLOOR_MAX_POINTS
        ? edgeMidpoints(points, closed).map(({ after, point }) => (
            <span
              key={`add-${after}`}
              className="oe-floor__point oe-floor__point--add"
              style={at(point, width, height)}
              role="button"
              tabIndex={0}
              aria-label={labels.addPoint}
              onPointerDown={(event) => {
                const next = insertPoint(points, after, point);
                if (!next) return;
                setSelectedPoint({ key, index: after + 1 });
                startPointDrag(event, key, kind, 'point', next, after + 1, true);
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                const next = insertPoint(points, after, point);
                if (next) commitPoints(key, kind, next);
              }}
              {...pointDragHandlers}
            />
          ))
        : null}
      {points.map((point, index) => {
        const active = selectedPoint?.key === key && selectedPoint.index === index;
        return (
          <span
            key={`p-${index}`}
            className={cx('oe-floor__point', active && 'is-selected')}
            style={at(point, width, height)}
            role="button"
            tabIndex={0}
            aria-label={labels.point.replace('{n}', String(index + 1))}
            aria-pressed={active}
            onPointerDown={(event) => {
              setSelectedPoint({ key, index });
              startPointDrag(event, key, kind, 'point', points, index);
            }}
            onKeyDown={(event) => onPointKeyDown(event, key, kind, points, index)}
            {...pointDragHandlers}
          />
        );
      })}
    </>
  );

  /* --- Ableitungen für das Markup --- */

  const hatch = Math.max(6, Math.round(width / 90));
  const outsideId = `oe-floor-out-${uid}`;
  const blockedId = `oe-floor-blk-${uid}`;
  const shownOutline = editOutline ? pointsOf(OUTLINE_KEY, outlinePoints ?? rectOutline(area)) : outlinePoints;
  const blockedPolys = zones.filter((z) => z.zoneType === 'blocked').map((z) => pointsOf(z.id, z.points));
  const issueOf = (table: FloorTable, rect: FloorRect): FloorTableIssue | null =>
    editing && showIssues ? tableIssue({ ...rect, rotation: table.rotation }, shownOutline, blockedPolys) : null;

  let selectedShape: { kind: FloorShapeKind; id: string; points: ReadonlyArray<FloorPoint> } | null = null;
  if (editing && activeTool === 'select' && selectedId) {
    const wall = walls.find((w) => w.id === selectedId);
    const zone = zones.find((z) => z.id === selectedId);
    if (wall) selectedShape = { kind: 'wall', id: wall.id, points: pointsOf(wall.id, wall.points) };
    else if (zone) selectedShape = { kind: 'zone', id: zone.id, points: pointsOf(zone.id, zone.points) };
  }
  const drawPreview = drawKind && drawing.length > 0 ? (hover ? [...drawing, hover] : drawing) : null;

  const shapeProps = (id: string, kind: FloorShapeKind, label: string, points: ReadonlyArray<FloorPoint>) =>
    editing
      ? {
          role: 'button',
          tabIndex: activeTool === 'select' ? 0 : -1,
          'aria-label': label,
          'aria-pressed': selectedId === id,
          onPointerDown: (event: ReactPointerEvent<SVGElement>) => {
            if (activeTool !== 'select' || event.button !== 0) return;
            setSelectedPoint(null);
            if (selectedId !== id) onSelect?.(id, kind);
            startPointDrag(event, id, kind, 'shape', points, -1);
          },
          ...pointDragHandlers,
          onKeyDown: (event: ReactKeyboardEvent<SVGElement>) => onShapeKeyDown(event, id, kind, points),
        }
      : {};

  /* --- Markup --- */

  return (
    <div className={cx(bem('oe-floor-wrap', [editing && 'edit']), className)}>
      <div
        ref={surfaceRef}
        className={bem('oe-floor', [
          editing && 'edit',
          editing && showGrid && 'grid',
          editing && activeTool !== 'select' && `tool-${activeTool}`,
        ])}
        style={surfaceStyle}
        role="group"
        aria-label={rest['aria-label']}
        onPointerDown={
          editing && activeTool === 'select'
            ? (event) => {
                if (event.target === event.currentTarget) {
                  setSelectedPoint(null);
                  onSelect?.(null, 'table');
                }
              }
            : undefined
        }
        onClick={drawKind ? onDrawClick : undefined}
        onPointerMove={drawKind ? onDrawMove : undefined}
        onPointerLeave={drawKind ? () => setHover(null) : undefined}
      >
        <svg
          className="oe-floor__svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden={editing ? undefined : true}
          focusable="false"
        >
          <defs>
            <pattern id={outsideId} patternUnits="userSpaceOnUse" width={hatch} height={hatch} patternTransform="rotate(45)">
              <line className="oe-floor__hatch oe-floor__hatch--outside" x1="0" y1="0" x2="0" y2={hatch} strokeWidth={hatch * 0.35} />
            </pattern>
            <pattern id={blockedId} patternUnits="userSpaceOnUse" width={hatch} height={hatch} patternTransform="rotate(45)">
              <line className="oe-floor__hatch oe-floor__hatch--blocked" x1="0" y1="0" x2="0" y2={hatch} strokeWidth={hatch * 0.35} />
            </pattern>
          </defs>

          {shownOutline ? (
            <g className={cx('oe-floor__room', editOutline && 'is-editing')}>
              <path className="oe-floor__outside" d={outsidePath(shownOutline, width, height)} fillRule="evenodd" />
              <path
                className="oe-floor__outside-hatch"
                d={outsidePath(shownOutline, width, height)}
                fillRule="evenodd"
                fill={`url(#${outsideId})`}
              />
              <polygon className="oe-floor__outline" points={pointsAttr(shownOutline)} vectorEffect="non-scaling-stroke" />
            </g>
          ) : null}

          {zones.map((zone) => {
            const points = pointsOf(zone.id, zone.points);
            const label = `${labels.zoneTypes[zone.zoneType]}${zone.label ? `: ${zone.label}` : ''}`;
            return (
              <g
                key={zone.id}
                className={cx(
                  bem('oe-floor__zone', [zone.zoneType]),
                  editing && selectedId === zone.id && 'is-selected',
                  pointDraft?.key === zone.id && 'is-dragging',
                )}
              >
                <polygon
                  className="oe-floor__zone-fill"
                  points={pointsAttr(points)}
                  vectorEffect="non-scaling-stroke"
                  {...shapeProps(zone.id, 'zone', label, points)}
                />
                {zone.zoneType === 'blocked' ? (
                  <polygon className="oe-floor__zone-hatch" points={pointsAttr(points)} fill={`url(#${blockedId})`} />
                ) : null}
              </g>
            );
          })}

          {walls.map((wall) => {
            const points = pointsOf(wall.id, wall.points);
            return (
              <g
                key={wall.id}
                className={cx(
                  'oe-floor__wall',
                  editing && selectedId === wall.id && 'is-selected',
                  pointDraft?.key === wall.id && 'is-dragging',
                )}
              >
                <polyline
                  className="oe-floor__wall-line"
                  points={pointsAttr(points)}
                  strokeWidth={wall.thickness && wall.thickness > 0 ? wall.thickness : FLOOR_WALL_THICKNESS}
                />
                {editing ? (
                  <polyline
                    className="oe-floor__wall-hit"
                    points={pointsAttr(points)}
                    vectorEffect="non-scaling-stroke"
                    {...shapeProps(wall.id, 'wall', labels.wall, points)}
                  />
                ) : null}
              </g>
            );
          })}

          {drawPreview ? (
            <g className={bem('oe-floor__draft', [drawKind])}>
              {drawKind === 'zone' && drawPreview.length >= 3 ? (
                <polygon className="oe-floor__draft-fill" points={pointsAttr(drawPreview)} />
              ) : null}
              {drawKind === 'wall' ? (
                <polyline className="oe-floor__wall-line" points={pointsAttr(drawPreview)} strokeWidth={FLOOR_WALL_THICKNESS} />
              ) : (
                <polyline className="oe-floor__draft-line" points={pointsAttr(drawPreview)} vectorEffect="non-scaling-stroke" />
              )}
            </g>
          ) : null}
        </svg>

        {zones.map((zone) => {
          const points = pointsOf(zone.id, zone.points);
          if (points.length < 3) return null;
          return (
            <span
              key={`zl-${zone.id}`}
              className={bem('oe-floor__zonelabel', [zone.zoneType])}
              style={at(polygonCentroid(points), width, height)}
              aria-hidden
            >
              <Icon name={ZONE_ICONS[zone.zoneType]} />
              <span>{nameOfZone(zone)}</span>
            </span>
          );
        })}

        {decor.map((item) => {
          const rect = rectOf(item);
          const itemClass = cx(
            bem('oe-floor__decor', [item.type]),
            editing && selectedId === item.id && 'is-selected',
            draft?.id === item.id && 'is-dragging',
          );
          const style = placement({ ...rect, rotation: item.rotation }, width, height);
          const text = item.type === 'label' || item.type === 'bar' || item.type === 'stage' ? item.label : undefined;
          return editing ? (
            <div key={item.id} className={itemClass} style={style} aria-label={decorLabel(item)} {...editHandlers(item, 'decor')}>
              {text}
              {handle(item, 'decor')}
            </div>
          ) : (
            <div key={item.id} className={itemClass} style={style} aria-hidden>
              {text}
            </div>
          );
        })}

        {tables.map((table) => {
          const rect = rectOf(table);
          const issue = issueOf(table, rect);
          const tableClass = cx(
            bem('oe-floor__table', [table.shape === 'round' && 'round', table.state !== 'free' && table.state]),
            currentId === table.id && 'is-current',
            editing && selectedId === table.id && 'is-selected',
            draft?.id === table.id && 'is-dragging',
            issue && `has-issue is-${issue}`,
          );
          const style = placement({ ...rect, rotation: table.rotation }, width, height);
          const label = <span className="oe-floor__label">{table.label}</span>;

          if (editing) {
            return (
              <div
                key={table.id}
                className={tableClass}
                style={style}
                aria-label={issue ? `${tableLabel(table)}, ${labels[issue]}` : tableLabel(table)}
                aria-disabled={table.disabled || undefined}
                {...editHandlers(table, 'table')}
              >
                {label}
                {table.seats ? (
                  <span className="oe-floor__seats" aria-hidden>
                    <Icon name="users" />
                    {table.seats}
                  </span>
                ) : null}
                {issue ? (
                  <span className="oe-floor__issue" aria-hidden>
                    <Icon name="alert" />
                  </span>
                ) : null}
                {handle(table, 'table')}
              </div>
            );
          }
          return (
            <button
              key={table.id}
              type="button"
              className={tableClass}
              style={style}
              disabled={table.disabled}
              aria-label={tableLabel(table)}
              aria-current={currentId === table.id ? 'true' : undefined}
              onClick={() => onTableClick?.(table.id)}
            >
              {label}
              {table.hint ? <span className="oe-floor__hint">{table.hint}</span> : null}
            </button>
          );
        })}

        {selectedShape ? pointHandles(selectedShape.id, selectedShape.kind, selectedShape.points, selectedShape.kind === 'zone') : null}
        {editOutline && shownOutline ? pointHandles(OUTLINE_KEY, 'outline', shownOutline, true) : null}

        {drawKind
          ? drawing.map((point, index) => (
              <span
                key={`d-${index}`}
                className={cx('oe-floor__point', 'oe-floor__point--draft', index === 0 && drawKind === 'zone' && 'is-first')}
                style={at(point, width, height)}
                aria-hidden
              />
            ))
          : null}

      </div>
      {drawKind || editOutline ? (
        <div
          className="oe-floor__toolbar"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <span className="oe-floor__toolhint" role="status">
            {drawKind === 'wall' ? labels.drawWall : drawKind === 'zone' ? labels.drawZone : labels.editOutline}
          </span>
          {drawKind ? (
            <>
              <button type="button" className="oe-btn oe-btn--sm oe-btn--ghost" disabled={drawing.length === 0} onClick={undoPoint}>
                <Icon name="undo" />
                <span>{labels.undoPoint}</span>
              </button>
              <button type="button" className="oe-btn oe-btn--sm oe-btn--ghost" onClick={cancelDrawing}>
                <Icon name="x" />
                <span>{labels.cancel}</span>
              </button>
              <button
                type="button"
                className="oe-btn oe-btn--sm oe-btn--primary"
                disabled={drawing.length < minPoints}
                onClick={finishDrawing}
              >
                <Icon name="check" />
                <span>{labels.done}</span>
              </button>
            </>
          ) : (
            <button type="button" className="oe-btn oe-btn--sm oe-btn--primary" onClick={() => onToolCancel?.()}>
              <Icon name="check" />
              <span>{labels.done}</span>
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
