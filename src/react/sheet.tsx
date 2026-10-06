import type { PointerEvent as ReactPointerEvent, ReactNode, RefObject } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { IconName } from '../icons/generated';
import { Icon } from './icon';
import { IconBox } from './pos';
import { bem, cx } from './utils';

/**
 * Dialog als Blatt: mittig mit Abstand zum Rand, bis 820 px als
 * Bottom-Sheet mit Griff.
 *
 * Verhalten (aus dem Kassen-Dialog von openeos-web übernommen):
 * Portal an `document.body` bzw. `container`, Escape schließt, Tab
 * bleibt im Blatt, beim Schließen kehrt der Fokus zum auslösenden
 * Element zurück, die Seite dahinter scrollt nicht. Liegen mehrere
 * Blätter übereinander, reagiert nur das oberste. Auf dem Telefon
 * schließt Wischen am Griff nach unten.
 */
export interface SheetProps {
  open: boolean;
  /** Escape, Hintergrund, Schließen-Knopf, Wischen. */
  onClose: () => void;
  title: ReactNode;
  /** Kleine Zeile unter dem Titel (mono). */
  subtitle?: ReactNode;
  /** Icon-Box links im Kopf. */
  icon?: IconName;
  iconTone?: 'default' | 'accent' | 'ink';
  /** md 480 · wide 720 · pay 820 · done 400 px */
  size?: 'md' | 'wide' | 'pay' | 'done';
  /** Feste Zeile zwischen Kopf und Inhalt (Filter, Umschalter). */
  toolbar?: ReactNode;
  /** Fester Bereich unter dem scrollenden Inhalt (z. B. Ziffernblock). */
  pinned?: ReactNode;
  /** Fuß mit Trennlinie (Summe, Bestätigen). */
  footer?: ReactNode;
  /**
   * `false`: weder Escape noch Hintergrund noch Wischen schließen, und es
   * gibt keinen Schließen-Knopf — für Zustände, die quittiert werden müssen.
   */
  dismissible?: boolean;
  closeLabel?: string;
  /** Kopf nur für Screenreader (z. B. Abschluss-Blatt mit eigenem Titel im Inhalt). */
  hideHeader?: boolean;
  /** Erhält beim Öffnen den Fokus; ohne Angabe das Blatt selbst. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Ziel des Portals; Default `document.body`. */
  container?: HTMLElement | null;
  className?: string;
  children?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Gemeinsamer Zustand aller offenen Blätter: Stapel (oberstes zuletzt)
   und Scroll-Sperre, die erst mit dem letzten Blatt endet. */
const stack: symbol[] = [];
let lockedOverflow: string | null = null;

function lockScroll() {
  if (stack.length === 1) {
    lockedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
}
function unlockScroll() {
  if (stack.length === 0 && lockedOverflow !== null) {
    document.body.style.overflow = lockedOverflow;
    lockedOverflow = null;
  }
}

/** Ab diesem Wischweg (px) schließt das Blatt beim Loslassen. */
const SWIPE_CLOSE = 80;

export function Sheet(props: SheetProps) {
  const { open, container } = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!open || !mounted) return null;
  return createPortal(<SheetLayer {...props} />, container ?? document.body);
}

function SheetLayer({
  onClose,
  title,
  subtitle,
  icon,
  iconTone = 'accent',
  size = 'md',
  toolbar,
  pinned,
  footer,
  dismissible = true,
  closeLabel = 'Schließen',
  hideHeader,
  initialFocusRef,
  className,
  children,
}: SheetProps) {
  const titleId = useId();
  const subId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const latest = useRef({ onClose, dismissible });
  latest.current = { onClose, dismissible };
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startY: number; dy: number; pointerId: number } | null>(null);
  const pressedOnScrim = useRef(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const id = Symbol('sheet');
    stack.push(id);
    lockScroll();
    const isTop = () => stack[stack.length - 1] === id;

    // Fokus hinein beim Öffnen, zurück beim Schließen.
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (initialFocusRef?.current ?? panel).focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTop()) return;
      if (event.key === 'Escape') {
        if (!latest.current.dismissible) return;
        event.preventDefault();
        event.stopPropagation();
        latest.current.onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.getClientRects().length > 0,
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);
      if (event.shiftKey && (!inside || active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // Verschwindet der fokussierte Knopf (Inhalt wechselt), fällt der Fokus
    // auf <body> — dann zurück ins Blatt, sonst liest ein Screenreader ins Leere.
    const observer = new MutationObserver(() => {
      if (document.activeElement === document.body && isTop()) panel.focus({ preventScroll: true });
    });
    observer.observe(panel, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      observer.disconnect();
      const index = stack.indexOf(id);
      if (index >= 0) stack.splice(index, 1);
      unlockScroll();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
    // Nur beim Öffnen: initialFocusRef ist ein Ref, onClose kommt über latest.
  }, []);

  /* Wischen am Griff (nur sichtbar ≤ 820 px). Der Versatz läuft über die
     CSS-Variable --oe-sheet-drag, ohne bei jeder Bewegung neu zu rendern. */
  const onHandleDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dismissible) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, dy: 0, pointerId: event.pointerId };
    setDragging(true);
  };
  const onHandleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    state.dy = Math.max(0, event.clientY - state.startY);
    panelRef.current?.style.setProperty('--oe-sheet-drag', `${state.dy}px`);
  };
  const onHandleUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    panelRef.current?.style.setProperty('--oe-sheet-drag', '0px');
    if (state.dy > SWIPE_CLOSE) onClose();
  };

  return (
    <div
      className="oe-scrim oe-sheet-layer"
      onPointerDown={(event) => {
        pressedOnScrim.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        // Nur ein Klick, der auf dem Hintergrund beginnt und endet, schließt —
        // nicht das Loslassen nach einer Textauswahl im Blatt.
        if (dismissible && pressedOnScrim.current && event.target === event.currentTarget) onClose();
        pressedOnScrim.current = false;
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subId : undefined}
        tabIndex={-1}
        className={cx(bem('oe-sheet', [size !== 'md' && size]), dragging && 'is-dragging', className)}
      >
        <div
          className="oe-sheet__handle"
          aria-hidden
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
        />
        <div className={hideHeader ? 'oe-sr-only' : 'oe-sheet__hd'}>
          {icon ? <IconBox icon={icon} tone={iconTone} /> : null}
          <div className="oe-sheet__titles">
            <h2 id={titleId} className="oe-sheet__title">
              {title}
            </h2>
            {subtitle ? (
              <p id={subId} className="oe-sheet__sub">
                {subtitle}
              </p>
            ) : null}
          </div>
          {dismissible && !hideHeader ? (
            <button
              type="button"
              className="oe-btn oe-btn--quiet oe-btn--icon oe-sheet__close"
              onClick={onClose}
              aria-label={closeLabel}
            >
              <Icon name="x" />
            </button>
          ) : null}
        </div>
        {toolbar ? <div className="oe-sheet__toolbar">{toolbar}</div> : null}
        <div className="oe-sheet__body oe-scroll">{children}</div>
        {pinned ? <div className="oe-sheet__pinned">{pinned}</div> : null}
        {footer ? <div className="oe-sheet__ft">{footer}</div> : null}
      </div>
    </div>
  );
}
