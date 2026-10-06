import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

/**
 * Bottom-Sheets per Herunterziehen schließen (Telefon, Tablet hochkant).
 *
 * Gezogen wird am Griff und am Kopf jederzeit, im scrollenden Inhalt nur,
 * wenn er ganz oben steht und die Bewegung klar nach unten geht — sonst
 * scrollt der Inhalt wie gewohnt. Geschlossen wird ab einer Wegschwelle
 * oder bei einem schnellen Wisch; bei zu wenig Weg federt das Blatt zurück.
 * Der Versatz läuft über eine CSS-Variable, ohne React neu zu rendern.
 */
export interface SwipeToCloseOptions {
  /** Aus (z. B. nicht schließbares Blatt): keine Geste. */
  enabled: boolean;
  onClose: () => void;
  /** Hier beginnt das Ziehen immer (Griff, Kopf). */
  grip?: string;
  /** Scrollender Inhalt: Ziehen nur, wenn er oben steht. */
  scroller?: string;
  /** CSS-Variable für den Versatz in px. */
  property?: string;
  /** Klasse während des Ziehens (schaltet die Übergänge ab). */
  draggingClass?: string;
  /** Nur in diesem Viewport (dort ist das Blatt ein Bottom-Sheet). */
  media?: string;
  /** Nach dem Wisch nach unten hinausgleiten, dann `onClose`. */
  animateOut?: boolean;
}

/** Ab diesem Weg (px) schließt das Blatt — höchstens ein gutes Drittel seiner Höhe. */
export const SWIPE_CLOSE_DISTANCE = 120;
/** Ab dieser Geschwindigkeit (px/ms) genügt ein kurzer Wisch … */
export const SWIPE_CLOSE_VELOCITY = 0.5;
/** … von mindestens so viel Weg (px). */
const SWIPE_MIN_FLICK = 24;
/** Bis hierher (px) ist eine Bewegung noch ein Tippen. */
const SLOP = 8;

/** Schließt ein Wisch mit diesem Weg (px), dieser Geschwindigkeit (px/ms) bei dieser Blatthöhe? */
export function swipeShouldClose(offset: number, velocity: number, height: number): boolean {
  if (offset <= 0) return false;
  const distance = height > 0 ? Math.min(SWIPE_CLOSE_DISTANCE, height * 0.35) : SWIPE_CLOSE_DISTANCE;
  if (offset >= distance) return true;
  return velocity >= SWIPE_CLOSE_VELOCITY && offset >= SWIPE_MIN_FLICK;
}

const NO_DRAG = 'input, textarea, select, [contenteditable="true"], [data-oe-nodrag]';
const INTERACTIVE = 'button, a[href], [role="button"], [role="tab"], label';

interface DragState {
  startX: number;
  startY: number;
  /** Am Griff/Kopf begonnen. */
  grip: boolean;
  target: Element;
  active: boolean;
  offset: number;
  samples: Array<{ y: number; t: number }>;
}

/** Steht jeder senkrecht scrollende Vorfahr zwischen `from` und `root` oben? */
function scrolledToTop(from: Element, root: Element): boolean {
  for (let el: Element | null = from; el && el !== root.parentElement; el = el.parentElement) {
    if (el instanceof HTMLElement && el.scrollTop > 0) {
      const overflow = getComputedStyle(el).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return false;
    }
    if (el === root) break;
  }
  return true;
}

function velocityOf(samples: Array<{ y: number; t: number }>): number {
  const last = samples[samples.length - 1];
  if (!last || samples.length < 2) return 0;
  // Nur die letzten ~100 ms zählen: wer erst zieht und dann anhält, wischt nicht.
  const first = samples.find((s) => last.t - s.t <= 100) ?? last;
  const dt = last.t - first.t;
  return dt > 0 ? (last.y - first.y) / dt : 0;
}

function reducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useSwipeToClose(ref: RefObject<HTMLElement | null>, options: SwipeToCloseOptions) {
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let state: DragState | null = null;
    let closing = false;
    /** Bis dahin (performance.now) wird ein Klick nach einem Zug verschluckt. */
    let suppressUntil = 0;

    const opt = () => {
      const o = latest.current;
      return {
        grip: o.grip ?? '.oe-sheet__handle, .oe-sheet__hd',
        scroller: o.scroller ?? '.oe-sheet__body',
        property: o.property ?? '--oe-sheet-drag',
        draggingClass: o.draggingClass ?? 'is-dragging',
        media: o.media ?? '(max-width: 820px)',
      };
    };

    const setOffset = (px: number) => el.style.setProperty(opt().property, `${px}px`);

    const begin = (x: number, y: number, target: EventTarget | null): DragState | null => {
      const o = latest.current;
      if (!o.enabled || closing || !(target instanceof Element) || !el.contains(target)) return null;
      const { grip, scroller, media } = opt();
      if (typeof window.matchMedia === 'function' && !window.matchMedia(media).matches) return null;
      if (target.closest(NO_DRAG)) return null;
      const inGrip = !!target.closest(grip);
      if (inGrip && target.closest(INTERACTIVE)) return null;
      if (!inGrip && !target.closest(scroller)) return null;
      return { startX: x, startY: y, grip: inGrip, target, active: false, offset: 0, samples: [{ y, t: performance.now() }] };
    };

    /** `true`: diese Bewegung gehört dem Blatt (Standardverhalten unterbinden). */
    const move = (x: number, y: number): boolean => {
      if (!state) return false;
      if (!state.active) {
        const dx = x - state.startX;
        const dy = y - state.startY;
        if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return false;
        const downward = dy > 0 && dy > Math.abs(dx) * 1.2;
        if (!downward || (!state.grip && !scrolledToTop(state.target, el))) {
          state = null;
          return false;
        }
        state.active = true;
        // Ab hier zählt der Weg — kein Sprung um die Tippschwelle.
        state.startY = y;
        el.classList.add(opt().draggingClass);
      }
      state.offset = Math.max(0, y - state.startY);
      const now = performance.now();
      state.samples.push({ y, t: now });
      if (state.samples.length > 8) state.samples.shift();
      setOffset(state.offset);
      return true;
    };

    const end = () => {
      const current = state;
      state = null;
      if (!current?.active) return;
      el.classList.remove(opt().draggingClass);
      suppressUntil = performance.now() + 400;
      if (!swipeShouldClose(current.offset, velocityOf(current.samples), el.offsetHeight)) {
        setOffset(0);
        return;
      }
      const o = latest.current;
      if (o.animateOut === false || reducedMotion()) {
        setOffset(0);
        o.onClose();
        return;
      }
      closing = true;
      setOffset(el.offsetHeight + 24);
      window.setTimeout(() => {
        closing = false;
        latest.current.onClose();
        // Bleibt das Element stehen (z. B. Warenkorb), ist es beim nächsten Öffnen wieder oben.
        setOffset(0);
      }, 180);
    };

    const cancel = () => {
      const current = state;
      state = null;
      if (!current?.active) return;
      el.classList.remove(opt().draggingClass);
      setOffset(0);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        cancel();
        return;
      }
      const touch = event.touches[0];
      state = touch ? begin(touch.clientX, touch.clientY, event.target) : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      if (move(touch.clientX, touch.clientY) && event.cancelable) event.preventDefault();
    };

    /* Maus/Stift: nur am Griff (der Kopf bleibt markierbar). */
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.button !== 0) return;
      const handle = opt().grip.split(',')[0]?.trim();
      if (!handle || !(event.target instanceof Element) || !event.target.closest(handle)) return;
      state = begin(event.clientX, event.clientY, event.target);
      if (!state) return;
      const pointerId = event.pointerId;
      const onMove = (e: PointerEvent) => {
        if (e.pointerId === pointerId && move(e.clientX, e.clientY)) e.preventDefault();
      };
      const onUp = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (e.type === 'pointercancel') cancel();
        else end();
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    /* Nach einem Zug kein Klick auf das Element unter dem Finger. */
    const onClickCapture = (event: MouseEvent) => {
      if (performance.now() > suppressUntil) return;
      suppressUntil = 0;
      event.preventDefault();
      event.stopPropagation();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', cancel);
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('click', onClickCapture, true);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchcancel', cancel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, [ref]);
}
