import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { IconName } from '../icons/generated';
import { Avatar } from './data-display';
import { Icon, renderIcon } from './icon';
import { bem, cx } from './utils';

/* Bausteine der Kasse. Alle Texte kommen als Props; Defaults sind
   deutsch (du-Form), die Anwendung übergibt übersetzte Texte. */

/* ---------- Icon-Box ---------- */

export interface IconBoxProps {
  /** Name aus dem OpenEOS-Set oder eigenes Element. */
  icon?: IconName | ReactNode;
  /** `accent`: Grün-zart. `ink`: Kontrastfläche mit Signalgrün. */
  tone?: 'default' | 'accent' | 'ink';
  /** sm 32 px · md 36 px · lg 46 px */
  size?: 'sm' | 'md' | 'lg';
  /** Mengenkreis oben rechts; 0, '' oder null blendet ihn aus. */
  badge?: ReactNode;
  /** Statt Icon, z. B. ein Produktfoto (`<img>` füllt die Box). */
  children?: ReactNode;
  className?: string;
}

export function IconBox({ icon, tone = 'default', size = 'md', badge, children, className }: IconBoxProps) {
  const showBadge = badge !== undefined && badge !== null && badge !== '' && badge !== 0 && badge !== false;
  return (
    <span className={bem('oe-icobox', [tone !== 'default' && tone, size !== 'md' && size], className)}>
      {icon ? renderIcon(icon) : null}
      {children}
      {showBadge ? <i className="oe-icobox__badge">{badge}</i> : null}
    </span>
  );
}

/* ---------- Legende (Tischfarben) ---------- */

export interface LegendItem {
  tone: 'free' | 'busy' | 'wait';
  label: ReactNode;
}

export function Legend({ items, className }: { items: ReadonlyArray<LegendItem>; className?: string }) {
  return (
    <ul className={cx('oe-legend', className)}>
      {items.map((item) => (
        <li className="oe-legend__item" key={item.tone}>
          <span className={`oe-legend__sw oe-legend__sw--${item.tone}`} aria-hidden />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/* ---------- Warenkorbzeile ---------- */

export interface CartLineProps {
  name: ReactNode;
  /** Neben dem Namen, z. B. „0,5 l“. */
  sub?: ReactNode;
  /** Optionen und Notiz, einzeilig gekürzt. */
  meta?: ReactNode;
  /** Status gesendeter Positionen, z. B. `<><Icon name="chef" />gesendet</>`. */
  sent?: ReactNode;
  /** Zeilensumme. */
  total: ReactNode;
  /** Mengensteuerung (ungesendete Zeilen), typischerweise `<Stepper>`. */
  stepper?: ReactNode;
  /** Menge als Text statt Stepper (gesendete Zeilen), z. B. „2 Stk.“. */
  qtyText?: ReactNode;
  /** Tipp auf Name/Optionen, z. B. Optionen bearbeiten. */
  onClick?: () => void;
  className?: string;
}

/** Eine Zeile im Warenkorb — als `<li>`, in einer `<ul className="oe-cartlines">`. */
export function CartLine({ name, sub, meta, sent, total, stepper, qtyText, onClick, className }: CartLineProps) {
  const main = (
    <>
      <span className="oe-cartline__name">
        {name}
        {sub ? <small>{sub}</small> : null}
      </span>
      {meta ? <span className="oe-cartline__meta">{meta}</span> : null}
      {sent ? <span className="oe-cartline__sent">{sent}</span> : null}
    </>
  );
  return (
    <li className={cx('oe-cartline', sent ? 'is-sent' : null, className)}>
      {stepper ?? <span className="oe-cartline__qty">{qtyText}</span>}
      {onClick ? (
        <button type="button" className="oe-cartline__main" onClick={onClick}>
          {main}
        </button>
      ) : (
        <span className="oe-cartline__main">{main}</span>
      )}
      <span className="oe-cartline__sum">{total}</span>
    </li>
  );
}

/* ---------- Warenkorb-Leiste (kompakt) ---------- */

export interface CartBarProps {
  /** Anzahl Artikel — steuert nur die Animation, angezeigt wird `countLabel`. */
  count: number;
  /** z. B. „3 Artikel“. */
  countLabel: ReactNode;
  total: ReactNode;
  /** Text der Schaltfläche rechts, z. B. „Warenkorb“. */
  label: ReactNode;
  onClick: () => void;
  /** Jede Änderung (z. B. Zähler beim Hinzufügen) spielt die Bump-Animation. */
  bumpKey?: string | number;
  className?: string;
  'aria-label'?: string;
}

/** Lässt die Bump-Animation bei jeder Änderung von `key` neu laufen. */
function useBump(key: string | number | undefined): boolean {
  const [bump, setBump] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (key === undefined) return;
    setBump(false);
    const frame = requestAnimationFrame(() => setBump(true));
    const timer = window.setTimeout(() => setBump(false), 400);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [key]);
  return bump;
}

export function CartBar({ count, countLabel, total, label, onClick, bumpKey, className, ...rest }: CartBarProps) {
  const bump = useBump(bumpKey ?? count);
  return (
    <button
      type="button"
      className={cx('oe-cartbar', bump && 'oe-bump', className)}
      onClick={onClick}
      aria-label={rest['aria-label']}
    >
      <span className="oe-cartbar__ico">
        <Icon name="cart" />
      </span>
      <span className="oe-cartbar__n">{countLabel}</span>
      <b className="oe-cartbar__sum">{total}</b>
      <span className="oe-cartbar__go">
        {label}
        <Icon name="chevron-up" />
      </span>
    </button>
  );
}

/* ---------- Kategorienleiste ---------- */

export interface CategoryNavProps {
  /** Kassen-Breakpoints: ≤ 1180 px schmale Spalte, ≤ 820 px Chip-Leiste. */
  responsive?: boolean;
  className?: string;
  children?: ReactNode;
  'aria-label': string;
}

export function CategoryNav({ responsive, className, children, ...rest }: CategoryNavProps) {
  return (
    <nav className={bem('oe-catnav', [responsive && 'responsive'], className)} aria-label={rest['aria-label']}>
      {children}
    </nav>
  );
}

export interface CategoryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  /** Inhalt der Icon-Box: `<Icon>` oder `<img>`. */
  icon: ReactNode;
  label: ReactNode;
  /** Anzahl Produkte; ab ≤ 1180 px ausgeblendet. */
  count?: ReactNode;
  active?: boolean;
  className?: string;
}

export function CategoryButton({ icon, label, count, active, className, ...rest }: CategoryButtonProps) {
  return (
    <button
      {...rest}
      type="button"
      aria-current={active ? 'true' : undefined}
      className={cx('oe-cat', active && 'is-active', className)}
    >
      <span className="oe-cat__ico">{icon}</span>
      <span className="oe-cat__lbl">{label}</span>
      {count != null ? <span className="oe-cat__n">{count}</span> : null}
    </button>
  );
}

/* ---------- Benutzer-Chip ---------- */

export interface UserChipProps {
  /** Anzeigename, z. B. „Anna B.“ — Initialen für den Avatar kommen daraus. */
  name: string;
  avatarSrc?: string;
  /** Schloss-Knopf; ohne Handler kein Knopf. */
  onLock?: () => void;
  lockLabel?: string;
  /** Kompakter Kopf: nur Avatar + Schloss, Name bleibt für Screenreader. */
  compact?: boolean;
  className?: string;
}

export function UserChip({ name, avatarSrc, onLock, lockLabel = 'Kasse sperren', compact, className }: UserChipProps) {
  return (
    <div className={bem('oe-userchip', [compact && 'compact'], className)}>
      <Avatar name={name} src={avatarSrc} size="sm" round />
      <b className={compact ? 'oe-sr-only' : 'oe-userchip__name'}>{name}</b>
      {onLock ? (
        <button
          type="button"
          className="oe-btn oe-btn--quiet oe-btn--icon oe-btn--sm oe-userchip__lock"
          onClick={onLock}
          aria-label={lockLabel}
        >
          <Icon name="lock" />
        </button>
      ) : null}
    </div>
  );
}
