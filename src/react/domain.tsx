import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { bem, cx } from './utils';

/* ---------- Produktkachel ---------- */

/* 'name' ausgelassen — siehe OrgCardProps. */
export interface TileProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'name'> {
  name: ReactNode;
  /** Zweite Zeile, typischerweise der Preis. */
  meta?: ReactNode;
  picked?: boolean;
  light?: boolean;
  className?: string;
}

export function Tile({ name, meta, picked, light, className, ...rest }: TileProps) {
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
  state?: 'busy' | 'wait';
  hint?: ReactNode;
  className?: string;
}

export function TableChip({ label, state, hint, className, ...rest }: TableChipProps) {
  return (
    <button {...rest} type="button" className={bem('oe-tablechip', [state], className)}>
      {label}
      {hint ? <small>{hint}</small> : null}
    </button>
  );
}

export function TableMap({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-tables', className)}>{children}</div>;
}

/* ---------- Ziffernblock ---------- */

export interface KeypadProps {
  onKey: (key: string) => void;
  /** Tasten, die grün hervorgehoben werden. */
  accentKeys?: ReadonlyArray<string>;
  keys?: ReadonlyArray<string>;
  className?: string;
}

const DEFAULT_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'] as const;

export function Keypad({ onKey, accentKeys = [], keys = DEFAULT_KEYS, className }: KeypadProps) {
  return (
    <div className={cx('oe-keypad', className)}>
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          className={cx(accentKeys.includes(key) && 'is-accent')}
          onClick={() => onKey(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );
}

/* ---------- Kassenbon ---------- */

export interface ReceiptLine {
  qty: ReactNode;
  name: ReactNode;
  total: ReactNode;
}

export interface ReceiptProps {
  title: ReactNode;
  meta?: ReactNode;
  lines: ReadonlyArray<ReceiptLine>;
  sumLabel?: ReactNode;
  sum: ReactNode;
  foot?: ReactNode;
  className?: string;
}

export function Receipt({ title, meta, lines, sumLabel = 'Summe', sum, foot, className }: ReceiptProps) {
  return (
    <div className={cx('oe-receipt', className)}>
      <div className="oe-receipt__hd">
        <b>{title}</b>
        {meta ? <span>{meta}</span> : null}
      </div>
      <ul className="oe-receipt__items">
        {lines.map((line, index) => (
          <li key={index}>
            <span>{line.qty}</span>
            <span>{line.name}</span>
            <span>{line.total}</span>
          </li>
        ))}
      </ul>
      <div className="oe-receipt__sum">
        <span>{sumLabel}</span>
        <span>{sum}</span>
      </div>
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
