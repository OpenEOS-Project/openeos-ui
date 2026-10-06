import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import { useRef, useState } from 'react';
import { Icon } from './icon';
import { moveRect, pxToUnits, resizeRect, toPercent, type FloorRect } from './floor-plan-math';
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

export type FloorItemKind = 'table' | 'decor';

export interface FloorChange {
  id: string;
  kind: FloorItemKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface FloorPlanProps {
  /** Bereichsgröße in Einheiten. */
  width: number;
  height: number;
  /** Rasterschritt in Einheiten (Default 20). */
  gridSize?: number;
  tables: ReadonlyArray<FloorTable>;
  decor?: ReadonlyArray<FloorDecor>;
  /** `view` (Kasse, Default) oder `edit` (Verwaltung). */
  mode?: 'view' | 'edit';
  /** view: markierter Tisch (der aktuell geöffnete). */
  currentId?: string | null;
  /** view: Tipp auf einen Tisch. */
  onTableClick?: (id: string) => void;
  /** edit: gewähltes Element. */
  selectedId?: string | null;
  /** edit: Auswahl ändert sich; `null` = Auswahl aufheben. */
  onSelect?: (id: string | null, kind: FloorItemKind) => void;
  /** edit: neue Lage nach Loslassen bzw. Pfeiltaste. */
  onCommit?: (change: FloorChange) => void;
  /** edit: Entf bzw. Rücktaste. */
  onDelete?: (id: string, kind: FloorItemKind) => void;
  /** edit: Strg/Cmd+D. */
  onDuplicate?: (id: string, kind: FloorItemKind) => void;
  /** edit: auf das Raster einrasten (Default true). */
  snap?: boolean;
  /** edit: Raster anzeigen (Default true). */
  showGrid?: boolean;
  /** Mindestmaßstab in px je Einheit (Default 0,5) — darunter scrollt die Hülle waagerecht. */
  minScale?: number;
  /** aria-label je Tisch; Default „Tisch {label}, {seats} Plätze“. */
  tableLabel?: (table: FloorTable) => string;
  /** edit: aria-label je Deko-Element; Default „Theke“, „Wand“, „Bühne“, Beschriftung. */
  decorLabel?: (decor: FloorDecor) => string;
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

interface DragState {
  id: string;
  kind: FloorItemKind;
  mode: 'move' | 'resize';
  pointerId: number;
  startX: number;
  startY: number;
  origin: FloorRect;
  rotation: number;
  rect: FloorRect;
  moved: boolean;
}

/* ---------- Komponente ---------- */

/**
 * Tischplan eines Bereichs. Die Fläche skaliert über aspect-ratio, alle
 * Lagen sind Prozentwerte — dieselben Daten sehen in Kasse und
 * Verwaltung gleich aus. Bearbeiten über Pointer Events (Maus, Stift,
 * Finger): Ziehen verschiebt, der Eckgriff ändert die Größe, `onCommit`
 * kommt erst beim Loslassen.
 */
export function FloorPlan({
  width,
  height,
  gridSize = 20,
  tables,
  decor = [],
  mode = 'view',
  currentId,
  onTableClick,
  selectedId,
  onSelect,
  onCommit,
  onDelete,
  onDuplicate,
  snap = true,
  showGrid = true,
  minScale = 0.5,
  tableLabel = defaultTableLabel,
  decorLabel = defaultDecorLabel,
  className,
  ...rest
}: FloorPlanProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [draft, setDraft] = useState<{ id: string; rect: FloorRect } | null>(null);
  const editing = mode === 'edit';
  const area = { width, height };
  const grid = snap ? gridSize : 0;

  const surfaceStyle = {
    '--oe-floor-w': width,
    '--oe-floor-h': height,
    '--oe-floor-grid': `${toPercent(gridSize, width)} ${toPercent(gridSize, height)}`,
    '--oe-floor-min-w': `${Math.round(width * minScale)}px`,
  } as CSSProperties;

  const rectOf = (item: FloorRect & { id: string }): FloorRect =>
    draft && draft.id === item.id ? draft.rect : { x: item.x, y: item.y, width: item.width, height: item.height };

  /* --- Ziehen und Größe ändern --- */

  const startDrag = (
    event: ReactPointerEvent<HTMLElement>,
    item: FloorRect & { id: string; rotation: number },
    kind: FloorItemKind,
    dragMode: DragState['mode'],
  ) => {
    if (event.button !== 0) return;
    event.stopPropagation();
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

  /* --- Tastatur --- */

  const onItemKeyDown = (
    event: ReactKeyboardEvent<HTMLElement>,
    item: FloorRect & { id: string; rotation: number },
    kind: FloorItemKind,
  ) => {
    const step = (gridSize > 0 ? gridSize : 1) * (event.shiftKey ? 5 : 1);
    const arrows: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = arrows[event.key];
    if (delta) {
      event.preventDefault();
      const next = moveRect(item, delta[0], delta[1], area, grid);
      if (next.x !== item.x || next.y !== item.y) {
        onCommit?.({ id: item.id, kind, ...next, rotation: item.rotation });
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onSelect?.(null, kind);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      onDelete?.(item.id, kind);
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
      event.preventDefault();
      onDuplicate?.(item.id, kind);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(item.id, kind);
    }
  };

  const editHandlers = (item: FloorRect & { id: string; rotation: number }, kind: FloorItemKind) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-pressed': selectedId === item.id,
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => startDrag(event, item, kind, 'move'),
    onPointerMove: onDragMove,
    onPointerUp: onDragEnd,
    onPointerCancel: onDragEnd,
    onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => onItemKeyDown(event, item, kind),
  });

  const handle = (item: FloorRect & { id: string; rotation: number }, kind: FloorItemKind) =>
    editing && selectedId === item.id ? (
      <span
        className="oe-floor__handle"
        aria-hidden
        onPointerDown={(event) => startDrag(event, item, kind, 'resize')}
      />
    ) : null;

  /* --- Markup --- */

  return (
    <div className={cx('oe-floor-wrap', className)}>
      <div
        ref={surfaceRef}
        className={bem('oe-floor', [editing && 'edit', editing && showGrid && 'grid'])}
        style={surfaceStyle}
        role="group"
        aria-label={rest['aria-label']}
        onPointerDown={
          editing
            ? (event) => {
                if (event.target === event.currentTarget) onSelect?.(null, 'table');
              }
            : undefined
        }
      >
        {decor.map((item) => {
          const rect = rectOf(item);
          const className = cx(
            bem('oe-floor__decor', [item.type]),
            editing && selectedId === item.id && 'is-selected',
            draft?.id === item.id && 'is-dragging',
          );
          const style = placement({ ...rect, rotation: item.rotation }, width, height);
          const text = item.type === 'label' || item.type === 'bar' || item.type === 'stage' ? item.label : undefined;
          return editing ? (
            <div key={item.id} className={className} style={style} aria-label={decorLabel(item)} {...editHandlers(item, 'decor')}>
              {text}
              {handle(item, 'decor')}
            </div>
          ) : (
            <div key={item.id} className={className} style={style} aria-hidden>
              {text}
            </div>
          );
        })}

        {tables.map((table) => {
          const rect = rectOf(table);
          const className = cx(
            bem('oe-floor__table', [table.shape === 'round' && 'round', table.state !== 'free' && table.state]),
            currentId === table.id && 'is-current',
            editing && selectedId === table.id && 'is-selected',
            draft?.id === table.id && 'is-dragging',
          );
          const style = placement({ ...rect, rotation: table.rotation }, width, height);
          const label = <span className="oe-floor__label">{table.label}</span>;

          if (editing) {
            return (
              <div
                key={table.id}
                className={className}
                style={style}
                aria-label={tableLabel(table)}
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
                {handle(table, 'table')}
              </div>
            );
          }
          return (
            <button
              key={table.id}
              type="button"
              className={className}
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
      </div>
    </div>
  );
}
