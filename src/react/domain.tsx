import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import type { IconName } from '../icons/generated';
import { Icon } from './icon';
import { bem, cx } from './utils';

/* ---------- Produktkachel ---------- */

/* 'name' ausgelassen — siehe OrgCardProps. */
export interface TileProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'name'> {
  name: ReactNode;
  /**
   * `simple` (Default): dunkle bzw. mit `light` helle Kachel mit Name und
   * Meta. `product`: Produktkachel der Kasse mit Icon-Box, Menge, Preis.
   */
  variant?: 'simple' | 'product';
  /** simple: zweite Zeile, typischerweise der Preis. */
  meta?: ReactNode;
  picked?: boolean;
  light?: boolean;
  /** product: zweite Zeile unter dem Namen, z. B. „0,5 l“. */
  sub?: ReactNode;
  /** product: Preis unten links. */
  price?: ReactNode;
  /** product: Inhalt der Icon-Box — `<Icon>` oder `<img>`. */
  icon?: ReactNode;
  /** product: Mengenkreis an der Icon-Box; 0 oder leer blendet ihn aus. */
  qty?: number;
  /** product: kleine Hinweis-Icons unten rechts (Optionen, Pfand). */
  hints?: ReactNode;
  /** product: Markierung unten, z. B. `<Badge tone="warn">noch 3</Badge>`. */
  flag?: ReactNode;
  /** product: liegt im Warenkorb — grün umrandet. */
  inCart?: boolean;
  className?: string;
}

export function Tile({
  name,
  variant = 'simple',
  meta,
  picked,
  light,
  sub,
  price,
  icon,
  qty,
  hints,
  flag,
  inCart,
  className,
  ...rest
}: TileProps) {
  if (variant === 'product') {
    return (
      <button {...rest} type="button" className={cx('oe-tile oe-tile--product', inCart && 'is-in', className)}>
        <span className="oe-tile__top">
          <span className="oe-tile__txt">
            <b>{name}</b>
            {sub ? <em>{sub}</em> : null}
          </span>
          {icon || qty ? (
            <span className="oe-tile__ico">
              {icon}
              {qty ? <span className="oe-tile__qty">{qty}</span> : null}
            </span>
          ) : null}
        </span>
        <span className="oe-tile__ft">
          {price != null ? <span className="oe-tile__price">{price}</span> : null}
          {flag ? <span className="oe-tile__flag">{flag}</span> : null}
          {hints ? <span className="oe-tile__hint">{hints}</span> : null}
        </span>
      </button>
    );
  }
  return (
    <button
      {...rest}
      type="button"
      aria-pressed={picked}
      className={cx(bem('oe-tile', [light && 'light']), picked && 'is-picked', className)}
    >
      <b>{name}</b>
      {meta ? <span>{meta}</span> : null}
    </button>
  );
}

export function TileGrid({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-tilegrid', className)}>{children}</div>;
}

/* ---------- Küchenbon ---------- */

export type TicketState = 'new' | 'work' | 'warn' | 'late';

export interface TicketLine {
  qty: ReactNode;
  name: ReactNode;
}

export interface TicketProps {
  /** Bonnummer oder Tischbezeichnung. */
  title: ReactNode;
  meta?: ReactNode;
  lines: ReadonlyArray<TicketLine>;
  footLeft?: ReactNode;
  footRight?: ReactNode;
  state?: TicketState;
  className?: string;
}

export function Ticket({ title, meta, lines, footLeft, footRight, state, className }: TicketProps) {
  return (
    <article className={bem('oe-ticket', [state], className)}>
      <header className="oe-ticket__hd">
        <b>{title}</b>
        {meta ? <span>{meta}</span> : null}
      </header>
      <ul>
        {lines.map((line, index) => (
          <li key={index}>
            <i>{line.qty}</i>
            <span>{line.name}</span>
          </li>
        ))}
      </ul>
      {footLeft || footRight ? (
        <footer className="oe-ticket__ft">
          <span>{footLeft}</span>
          <span>{footRight}</span>
        </footer>
      ) : null}
    </article>
  );
}

/* ---------- Tische ---------- */

export interface TableChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  label: ReactNode;
  /** `free` = Grundfarbe (wie ohne Angabe), `busy` = offen, `wait` = wartet auf Bedienung. */
  state?: 'free' | 'busy' | 'wait';
  /** Kleine Zeile unter der Bezeichnung: „frei“, Betrag, „wartet“. */
  hint?: ReactNode;
  /** Aktuell geöffneter Tisch — dunkel umrandet. */
  current?: boolean;
  /** `lg`: Kasse (84 px hoch, 18 px Schrift). */
  size?: 'md' | 'lg';
  className?: string;
}

export function TableChip({ label, state, hint, current, size = 'md', className, ...rest }: TableChipProps) {
  return (
    <button
      {...rest}
      type="button"
      aria-current={current ? 'true' : undefined}
      className={bem('oe-tablechip', [state !== 'free' && state, size === 'lg' && 'lg'], cx(current && 'is-current', className))}
    >
      {label}
      {hint ? <small>{hint}</small> : null}
    </button>
  );
}

export interface TableGridProps {
  /** Mindestbreite einer Spalte in px (setzt `--oe-tables-min`, Default 74). */
  min?: number;
  className?: string;
  children?: ReactNode;
  'aria-label'?: string;
}

export function TableGrid({ min, className, children, ...rest }: TableGridProps) {
  const style = min ? ({ '--oe-tables-min': `${min}px` } as CSSProperties) : undefined;
  return (
    <div className={cx('oe-tables', className)} style={style} role={rest['aria-label'] ? 'group' : undefined} aria-label={rest['aria-label']}>
      {children}
    </div>
  );
}

/** @deprecated Seit 0.4.0 `TableGrid` verwenden; entfällt in 0.5.0. */
export const TableMap = TableGrid;

/* ---------- Ziffernblock ---------- */

/** Taste als Text (`'7'`, `'00'`) oder mit Icon, Beschriftung und Zustand. */
export type KeypadKey =
  | string
  | {
      key: string;
      /** Sichtbarer Text; ohne Angabe der Schlüssel selbst (außer bei Icon-Tasten). */
      label?: ReactNode;
      icon?: IconName;
      ariaLabel?: string;
      accent?: boolean;
      disabled?: boolean;
    };

export interface KeypadProps {
  onKey: (key: string) => void;
  /**
   * Tasten in Leserichtung, drei pro Reihe. Spezialtasten:
   * `'backspace'` (Icon backspace) und `'enter'` (Icon arrow-right, grün).
   * Default: 1–9, backspace, 0, enter.
   */
  keys?: ReadonlyArray<KeypadKey>;
  /** Tasten, die deaktiviert sind (z. B. `enter` ohne Eingabe). */
  disabledKeys?: ReadonlyArray<string>;
  /** Weitere grün hervorgehobene Tasten (zusätzlich zu `enter`). */
  accentKeys?: ReadonlyArray<string>;
  /** `lg`: 64-px-Tasten (Tischnummer an der Kasse). */
  size?: 'md' | 'lg';
  /** Zugängliche Namen der Spezialtasten. */
  labels?: { backspace?: string; enter?: string };
  /**
   * Physische Tastatur abfangen: Ziffern/Buchstaben, Rücktaste, Enter —
   * nur solange kein Eingabefeld den Fokus hat.
   */
  captureKeyboard?: boolean;
  className?: string;
  'aria-label'?: string;
}

const DEFAULT_KEYS: ReadonlyArray<KeypadKey> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'backspace', '0', 'enter'];
const DEFAULT_KEYPAD_LABELS = { backspace: 'Löschen', enter: 'Bestätigen' };

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag !== 'INPUT') return false;
  const type = (target as HTMLInputElement).type;
  return !['button', 'checkbox', 'radio', 'submit', 'reset', 'range', 'color', 'file'].includes(type);
}

export function Keypad({
  onKey,
  keys = DEFAULT_KEYS,
  disabledKeys = [],
  accentKeys = [],
  size = 'md',
  labels,
  captureKeyboard,
  className,
  ...rest
}: KeypadProps) {
  const names = { ...DEFAULT_KEYPAD_LABELS, ...labels };
  const normalized = keys.map((entry) => (typeof entry === 'string' ? { key: entry } : entry));

  const rootRef = useRef<HTMLDivElement>(null);
  const latest = useRef({ onKey, normalized, disabledKeys });
  latest.current = { onKey, normalized, disabledKeys };

  useEffect(() => {
    if (!captureKeyboard) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isEditable(event.target)) return;
      // Liegt ein Dialog über dem Ziffernblock, gehört die Tastatur ihm.
      const modals = document.querySelectorAll('[aria-modal="true"]');
      const top = modals[modals.length - 1];
      if (top && !(rootRef.current && top.contains(rootRef.current))) return;
      const { onKey: send, normalized: current, disabledKeys: disabled } = latest.current;
      let key: string | null = null;
      if (event.key === 'Backspace') key = 'backspace';
      else if (event.key === 'Enter') key = 'enter';
      else if (event.key.length === 1) key = event.key;
      if (key === null) return;
      const available = current.some((entry) => entry.key === key) || (key.length === 1 && /[0-9a-z-]/i.test(key));
      if (!available) return;
      const entry = current.find((candidate) => candidate.key === key);
      if (disabled.includes(key) || entry?.disabled) return;
      event.preventDefault();
      send(key);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [captureKeyboard]);

  return (
    <div
      ref={rootRef}
      className={bem('oe-keypad', [size === 'lg' && 'lg'], className)}
      role="group"
      aria-label={rest['aria-label']}
    >
      {normalized.map((entry) => {
        const special = entry.key === 'backspace' || entry.key === 'enter';
        const icon: IconName | undefined = entry.icon ?? (entry.key === 'backspace' ? 'backspace' : entry.key === 'enter' ? 'arrow-right' : undefined);
        const accent = entry.accent ?? (entry.key === 'enter' || accentKeys.includes(entry.key));
        const ariaLabel =
          entry.ariaLabel ?? (entry.key === 'backspace' ? names.backspace : entry.key === 'enter' ? names.enter : undefined);
        const content = entry.label ?? (icon ? <Icon name={icon} /> : special ? null : entry.key);
        return (
          <button
            key={entry.key}
            type="button"
            className={cx(accent && 'is-accent')}
            aria-label={ariaLabel}
            disabled={entry.disabled || disabledKeys.includes(entry.key)}
            onClick={() => onKey(entry.key)}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Kassenbon ---------- */

export interface ReceiptLine {
  qty: ReactNode;
  name: ReactNode;
  /** Einzelpreis — erscheint als eigene Spalte vor der Zeilensumme. */
  price?: ReactNode;
  total: ReactNode;
}

export interface ReceiptProps {
  title: ReactNode;
  meta?: ReactNode;
  /** Kleine Zeile unter dem Kopf: Veranstaltung, Kasse, Uhrzeit. */
  info?: ReactNode;
  lines: ReadonlyArray<ReceiptLine>;
  sumLabel?: ReactNode;
  sum: ReactNode;
  /** Hervorgehobene Zeile unter der Summe, z. B. „TESTBON“ oder „TSE signiert …“. */
  note?: ReactNode;
  foot?: ReactNode;
  className?: string;
}

export function Receipt({ title, meta, info, lines, sumLabel = 'Summe', sum, note, foot, className }: ReceiptProps) {
  return (
    <div className={cx('oe-receipt', className)}>
      <div className="oe-receipt__hd">
        <b>{title}</b>
        {meta ? <span>{meta}</span> : null}
      </div>
      {info ? <div className="oe-receipt__meta">{info}</div> : null}
      <ul className="oe-receipt__items">
        {lines.map((line, index) => (
          <li key={index} className={line.price != null ? 'has-price' : undefined}>
            <span>{line.qty}</span>
            <span>{line.name}</span>
            {line.price != null ? <span className="oe-receipt__price">{line.price}</span> : null}
            <span>{line.total}</span>
          </li>
        ))}
      </ul>
      <div className="oe-receipt__sum">
        <span>{sumLabel}</span>
        <span>{sum}</span>
      </div>
      {note ? <div className="oe-receipt__note">{note}</div> : null}
      {foot ? <div className="oe-receipt__ft">{foot}</div> : null}
    </div>
  );
}

/* ---------- Terminal ---------- */

export function Terminal({ title, className, children }: { title?: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <div className={cx('oe-term', className)}>
      <div className="oe-term__bar">
        <i />
        <i />
        <i />
        {title ? <span>{title}</span> : null}
      </div>
      <pre className="oe-term__body">{children}</pre>
    </div>
  );
}

/* ---------- Audit-Stream ---------- */

export interface StreamRow {
  time: ReactNode;
  tag: ReactNode;
  tone?: 'ok' | 'err' | 'tse';
  message: ReactNode;
}

export function Stream({ rows, className }: { rows: ReadonlyArray<StreamRow>; className?: string }) {
  return (
    <div className={cx('oe-stream', className)}>
      {rows.map((row, index) => (
        <div className="oe-stream__row" key={index}>
          <span className="oe-stream__t">{row.time}</span>
          <span className={bem('oe-stream__tag', [row.tone])}>{row.tag}</span>
          <span>{row.message}</span>
        </div>
      ))}
    </div>
  );
}
