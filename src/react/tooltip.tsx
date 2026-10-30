import type { CSSProperties, FocusEvent, PointerEvent as ReactPointerEvent, ReactElement, ReactNode } from 'react';
import { Children, cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { resolvePanelPos, useIsoLayoutEffect, type PanelPlacement } from './dropdown';
import { cx } from './utils';

/* ---------- Tooltip ----------
   Kurzer Hinweis zu einem Element, meist der Name eines Icon-Knopfs.

   Öffnet nach `delay` ms bei Hover, sofort bei Tastaturfokus und nach
   langem Drücken auf Touch; schließt beim Verlassen, Blur, Klick,
   Scrollen und mit Escape. Die Blase liegt in einem Portal an
   `document.body` (position: fixed) und weicht Rändern aus
   (`resolvePanelPos` aus dem Dropdown). Solange sie offen ist, trägt
   das Kind `aria-describedby`.

   Das Kind muss ein einzelnes Element sein, das Props an sein
   DOM-Element durchreicht (Button, IconButton, Dropdown, ein <span>).
   `always` zeigt die Blase statisch über dem Kind — das Verhalten bis
   0.6 — ohne Portal, für Demos und feste Hinweise. */

export interface TooltipProps {
  label: ReactNode;
  /** Bevorzugte Seite; kippt, wenn dort kein Platz ist. */
  placement?: PanelPlacement;
  /** Verzögerung bis zum Öffnen bei Hover (ms). */
  delay?: number;
  /** Blase immer sichtbar, direkt im Markup (kein Portal, keine Interaktion). */
  always?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  children?: ReactNode;
}

const GAP = 7;
const LONG_PRESS = 500;

interface Pos {
  left: number;
  top: number;
  placement: PanelPlacement;
  /** Pfeil-Lage in px relativ zur linken Kante der Blase. */
  arrow: number;
}

type TriggerProps = {
  'aria-describedby'?: string;
  onPointerEnter?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel?: (e: ReactPointerEvent<HTMLElement>) => void;
  onFocus?: (e: FocusEvent<HTMLElement>) => void;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
  onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
};

/** Ruft den Handler des Kindes und danach unseren. */
function chain<E>(theirs: ((e: E) => void) | undefined, ours: (e: E) => void) {
  return (e: E) => {
    theirs?.(e);
    ours(e);
  };
}

export function Tooltip({ label, placement = 'top', delay = 300, always, disabled, id, className, children }: TooltipProps) {
  if (always) {
    return (
      <span className={cx('oe-tip', className)}>
        {children}
        <span className="oe-tip__bubble" role="tooltip" id={id}>
          {label}
        </span>
      </span>
    );
  }
  return (
    <FloatingTooltip label={label} placement={placement} delay={delay} disabled={disabled} id={id} className={className}>
      {children}
    </FloatingTooltip>
  );
}

function FloatingTooltip({ label, placement = 'top', delay = 300, disabled, id, className, children }: TooltipProps) {
  const autoId = useId();
  const tipId = id ?? autoId;
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const anchor = useRef<HTMLElement | null>(null);
  const bubble = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Über langes Drücken geöffnet: bleibt bis zum nächsten Tippen außerhalb. */
  const pressed = useRef(false);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const show = useCallback((el: HTMLElement) => {
    anchor.current = el;
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    clear();
    pressed.current = false;
    setOpen(false);
  }, []);

  useEffect(() => clear, []);
  useEffect(() => {
    if (disabled) hide();
  }, [disabled, hide]);

  /* Messen, bevor die Blase sichtbar wird. */
  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const measure = () => {
      const el = anchor.current;
      const b = bubble.current;
      if (!el || !b || !el.isConnected) return;
      const r = resolvePanelPos(el, b, { align: 'center', placement }, GAP);
      const w = el.getBoundingClientRect();
      const width = b.offsetWidth;
      const left = r.left !== undefined ? w.left + r.left : w.left + (w.width - width) / 2;
      const top = r.placement === 'bottom' ? w.bottom + GAP : w.top - GAP - b.offsetHeight;
      const arrow = Math.max(10, Math.min(width - 10, w.left + w.width / 2 - left));
      setPos({ left: Math.round(left), top: Math.round(top), placement: r.placement, arrow: Math.round(arrow) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open, placement, label]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    const onScroll = () => hide();
    const onPointerDown = (e: PointerEvent) => {
      if (pressed.current && anchor.current && !anchor.current.contains(e.target as Node)) hide();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('scroll', onScroll, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [open, hide]);

  const child = Children.only(children);
  if (!isValidElement<TriggerProps>(child)) return <>{children}</>;
  const own = child.props;

  const triggerProps: TriggerProps = {
    'aria-describedby': open ? cx(own['aria-describedby'], tipId) : own['aria-describedby'],
    onPointerEnter: chain(own.onPointerEnter, (e) => {
      if (disabled || e.pointerType === 'touch') return;
      const el = e.currentTarget;
      clear();
      timer.current = setTimeout(() => show(el), delay);
    }),
    onPointerLeave: chain(own.onPointerLeave, (e) => {
      if (e.pointerType === 'touch') return;
      hide();
    }),
    onPointerDown: chain(own.onPointerDown, (e) => {
      if (e.pointerType === 'touch') {
        if (disabled) return;
        const el = e.currentTarget;
        clear();
        timer.current = setTimeout(() => {
          pressed.current = true;
          show(el);
        }, LONG_PRESS);
      } else hide();
    }),
    onPointerUp: chain(own.onPointerUp, (e) => {
      if (e.pointerType === 'touch') clear();
    }),
    onPointerCancel: chain(own.onPointerCancel, () => clear()),
    onFocus: chain(own.onFocus, (e) => {
      if (disabled) return;
      const el = e.currentTarget;
      let visible = true;
      try {
        visible = el.matches(':focus-visible');
      } catch {
        /* ältere Engines: immer zeigen */
      }
      if (visible) {
        clear();
        show(el);
      }
    }),
    onBlur: chain(own.onBlur, () => hide()),
    onContextMenu: chain(own.onContextMenu, (e) => {
      if (pressed.current) e.preventDefault();
    }),
  };

  const style: CSSProperties | undefined = pos
    ? ({ left: pos.left, top: pos.top, '--oe-tip-arrow': `${pos.arrow}px` } as CSSProperties)
    : undefined;

  return (
    <>
      {cloneElement(child as ReactElement<TriggerProps>, triggerProps)}
      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={bubble}
              id={tipId}
              role="tooltip"
              className={cx('oe-tip__bubble oe-tip__bubble--float', pos && `oe-tip__bubble--${pos.placement}`, !pos && 'is-measuring', className)}
              style={style}
            >
              {label}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
