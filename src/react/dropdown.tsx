import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { bem, cx } from './utils';

/* ---------- Auslöser ---------- */

export interface DropdownTriggerProps {
  /** Kleines Präfix links, etwa "Event". */
  prefix?: ReactNode;
  /** Der angezeigte Wert. */
  children?: ReactNode;
  variant?: 'quiet';
  size?: 'sm';
  block?: boolean;
  className?: string;
}

/** Chevron als Pfad — folgt currentColor, anders als ein Hintergrundbild. */
function Chevron() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path d="M2 4.5 6 8.5 10 4.5" />
    </svg>
  );
}

/* ---------- Kollisionslogik ---------- */

/** Mindestabstand des Panels zum sichtbaren Rand. */
const EDGE = 8;

/* Auf dem Server gibt es kein Layout; useLayoutEffect würde dort warnen. */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * Sichtbarer Bereich für das Panel: Viewport, geschnitten mit allen
 * Vorfahren, die waagerecht abschneiden (overflow ≠ visible). Ein
 * scrollender Inhaltsbereich etwa schneidet links an der Seitenleiste ab.
 */
function visibleBounds(from: HTMLElement): Bounds {
  const vv = window.visualViewport;
  const b: Bounds = {
    left: vv?.offsetLeft ?? 0,
    top: vv?.offsetTop ?? 0,
    right: (vv?.offsetLeft ?? 0) + (vv?.width ?? document.documentElement.clientWidth),
    bottom: (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight),
  };
  for (let el = from.parentElement; el && el !== document.body; el = el.parentElement) {
    const cs = getComputedStyle(el);
    if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
    const r = el.getBoundingClientRect();
    if (cs.overflowX !== 'visible') {
      b.left = Math.max(b.left, r.left);
      b.right = Math.min(b.right, r.right);
    }
  }
  return b;
}

interface PanelPos {
  align: 'start' | 'end';
  placement: 'bottom' | 'top';
  /** Feste waagerechte Lage (px relativ zum Auslöser-Wrapper), wenn keine Bündigkeit passt. */
  left?: number;
}

/**
 * Wählt Bündigkeit und Richtung so, dass das Panel sichtbar bleibt:
 * erst die gewünschte, dann die gespiegelte, sonst an den Rand
 * geschoben. Nach oben nur, wenn unten kein Platz ist und oben schon.
 */
function resolvePanelPos(
  wrap: HTMLElement,
  panel: HTMLElement,
  want: PanelPos,
): PanelPos {
  const w = wrap.getBoundingClientRect();
  const width = panel.offsetWidth;
  const height = panel.offsetHeight;
  const b = visibleBounds(wrap);
  const rtl = getComputedStyle(wrap).direction === 'rtl';
  const minL = b.left + EDGE;
  const maxR = b.right - EDGE;

  /* Linke Kante je Bündigkeit; "start" ist in RTL rechts. */
  const leftFor = (a: 'start' | 'end') =>
    (a === 'start') !== rtl ? w.left : w.right - width;
  const fits = (l: number) => l >= minL && l + width <= maxR;

  const other = want.align === 'start' ? 'end' : 'start';
  let align = want.align;
  let left: number | undefined;
  if (!fits(leftFor(want.align))) {
    if (fits(leftFor(other))) align = other;
    else {
      const clamped = Math.max(minL, Math.min(leftFor(want.align), maxR - width));
      left = Math.round(clamped - w.left);
    }
  }

  const gap = 5;
  const below = b.bottom - EDGE - (w.bottom + gap);
  const above = w.top - gap - (b.top + EDGE);
  let placement = want.placement;
  if (want.placement === 'bottom' && height > below && above >= height) placement = 'top';
  else if (want.placement === 'top' && height > above && below >= height) placement = 'bottom';

  return { align, placement, left };
}

/* ---------- Dropdown ---------- */

export interface DropdownProps {
  /** Inhalt des Auslösers. Ohne trigger wird label verwendet. */
  trigger?: ReactNode;
  label?: ReactNode;
  prefix?: ReactNode;
  triggerVariant?: 'quiet';
  triggerSize?: 'sm';
  block?: boolean;
  /**
   * Bevorzugte Bündigkeit des Panels am Auslöser (`end` = rechtsbündig).
   * Passt das Panel so nicht in den sichtbaren Bereich (Viewport bzw.
   * abschneidender Container), wird gespiegelt oder an den Rand geschoben.
   */
  align?: 'start' | 'end';
  /** Bevorzugt nach oben öffnen; kippt nach unten, wenn oben kein Platz ist. */
  placement?: 'bottom' | 'top';
  className?: string;
  children?: ReactNode;
}

/**
 * Dropdown aus Auslöser und Panel.
 *
 * Schließt bei Klick nach außen, mit Escape und bei Auswahl einer
 * Option. Die Optionen bleiben ungesteuert — was ein Klick bewirkt,
 * entscheidet die Anwendung; hier wird nur zugeklappt.
 */
export function Dropdown({
  trigger,
  label,
  prefix,
  triggerVariant,
  triggerSize,
  block,
  align = 'start',
  placement = 'bottom',
  className,
  children,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PanelPos | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  /* Vor dem Zeichnen messen: das Panel steht zuerst in der gewünschten
     Lage, wird gemessen und ggf. umgesetzt — ohne sichtbares Springen. */
  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const measure = () => {
      if (wrapRef.current && panelRef.current) {
        setPos(resolvePanelPos(wrapRef.current, panelRef.current, { align, placement }));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open, align, placement]);

  const eff = pos ?? { align, placement };
  const panelStyle: CSSProperties | undefined =
    /* Inline schlägt die logischen Insets der Klasse in beiden Richtungen. */
    eff.left !== undefined ? { left: eff.left, right: 'auto' } : undefined;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* Ein Klick im Panel schließt — außer er kam aus dem Suchfeld, das
     sonst nach dem ersten Zeichen verschwände. */
  const onPanelClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.oe-dd__search')) return;
    if (target.closest('.oe-dd__opt')) setOpen(false);
  }, []);

  return (
    <div ref={wrapRef} className={cx('oe-dd', open && 'is-open', className)}>
      <button
        type="button"
        className={bem('oe-dd__trigger', [triggerVariant, triggerSize, block && 'block'])}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {prefix ? <span className="oe-dd__pre">{prefix}</span> : null}
        {trigger ?? <span className="oe-dd__val">{label}</span>}
        <Chevron />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        role="menu"
        className={cx(
          'oe-dd__panel',
          eff.align === 'end' && 'oe-dd__panel--end',
          eff.placement === 'top' && 'oe-dd__panel--top',
        )}
        style={panelStyle}
        onClick={onPanelClick}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Bausteine im Panel ---------- */

interface OptionBase {
  /** Hervorgehoben mit Häkchen. */
  selected?: boolean;
  danger?: boolean;
  icon?: ReactNode;
  /** Zweitwert rechts, etwa eine Anzahl. */
  meta?: ReactNode;
  className?: string;
  children?: ReactNode;
}

function optionClass({ selected, danger, className }: OptionBase) {
  return cx('oe-dd__opt', selected && 'is-sel', danger && 'oe-dd__opt--danger', className);
}

export type DropdownOptionProps = OptionBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export function DropdownOption({
  selected,
  danger,
  icon,
  meta,
  className,
  children,
  ...rest
}: DropdownOptionProps) {
  return (
    <button
      {...rest}
      type="button"
      role="menuitem"
      aria-current={selected || undefined}
      className={optionClass({ selected, danger, className })}
    >
      {icon}
      {children}
      {meta ? <small>{meta}</small> : null}
    </button>
  );
}

export type DropdownLinkProps = OptionBase &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>;

/** Optisch identisch, semantisch ein Link. */
export function DropdownLink({
  selected,
  danger,
  icon,
  meta,
  className,
  children,
  ...rest
}: DropdownLinkProps) {
  return (
    <a {...rest} role="menuitem" className={optionClass({ selected, danger, className })}>
      {icon}
      {children}
      {meta ? <small>{meta}</small> : null}
    </a>
  );
}

export function DropdownCaption({ children }: { children?: ReactNode }) {
  return <div className="oe-dd__cap">{children}</div>;
}

export function DropdownSeparator() {
  return <div className="oe-dd__sep" role="separator" />;
}

export interface DropdownSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Bleibt beim Scrollen oben stehen. */
export function DropdownSearch({ value, onChange, placeholder }: DropdownSearchProps) {
  return (
    <div className="oe-dd__search">
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
