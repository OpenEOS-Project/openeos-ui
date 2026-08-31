import type { HTMLAttributes, ReactNode } from 'react';
import { bem, cx } from './utils';

/* ---------- Card ---------- */

export type CardVariant = 'flat' | 'raised' | 'ink' | 'accent';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  variant?: CardVariant;
  className?: string;
  children?: ReactNode;
}

export function Card({ variant, className, children, ...rest }: CardProps) {
  return (
    <div {...rest} className={bem('oe-card', [variant], className)}>
      {children}
    </div>
  );
}

export interface CardHeadProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Rechts im Kopf, typischerweise Buttons oder ein Menü. */
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function CardHead({ title, description, actions, className, children }: CardHeadProps) {
  return (
    <div className={cx('oe-card__head', className)}>
      <div>
        {title ? <h3 className="oe-card__title">{title}</h3> : null}
        {description ? <p className="oe-card__desc">{description}</p> : null}
        {children}
      </div>
      {actions}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-card__body', className)}>{children}</div>;
}

export function CardFoot({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-card__foot', className)}>{children}</div>;
}

/* ---------- KPI ---------- */

export function Kpis({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-kpis', className)}>{children}</div>;
}

export interface KpiProps {
  label: ReactNode;
  value: ReactNode;
  /** Fußzeile, z. B. Vergleich zum Vortag. */
  foot?: ReactNode;
  variant?: 'accent' | 'ink';
  className?: string;
}

export function Kpi({ label, value, foot, variant, className }: KpiProps) {
  return (
    <div className={bem('oe-kpi', [variant], className)}>
      <span className="oe-kpi__label">{label}</span>
      <span className="oe-kpi__value">{value}</span>
      {foot ? <span className="oe-kpi__foot">{foot}</span> : null}
    </div>
  );
}

/* ---------- Meter ---------- */

export interface MeterProps {
  label: ReactNode;
  /** Anteil von 0 bis 1. Werte außerhalb werden begrenzt. */
  value: number;
  /** Rechts über dem Balken, z. B. "412 €". */
  hint?: ReactNode;
  tone?: 'warn' | 'danger';
  className?: string;
}

export function Meter({ label, value, hint, tone, className }: MeterProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className={bem('oe-meter', [tone], className)}>
      <div className="oe-meter__top">
        <span>{label}</span>
        {hint ? <b>{hint}</b> : null}
      </div>
      <div
        className="oe-meter__bar"
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="oe-meter__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------- Seitenkopf ---------- */

export interface PageHeadProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Brotkrumen, üblicherweise <Link>-Elemente. */
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHead({ title, subtitle, breadcrumbs, actions, className }: PageHeadProps) {
  return (
    <div className={cx('oe-pagehead', className)}>
      <div>
        {breadcrumbs ? <nav className="oe-crumbs">{breadcrumbs}</nav> : null}
        <h1 className="oe-pagehead__title">{title}</h1>
        {subtitle ? <p className="oe-pagehead__sub">{subtitle}</p> : null}
      </div>
      {actions ? <div className="oe-actions">{actions}</div> : null}
    </div>
  );
}

/* ---------- Tabs ---------- */

export interface TabItem<T extends string = string> {
  id: T;
  label: ReactNode;
  /** Zahl rechts neben dem Label. */
  count?: number;
}

export interface TabsProps<T extends string = string> {
  items: ReadonlyArray<TabItem<T>>;
  active: T;
  onChange: (id: T) => void;
  className?: string;
  'aria-label'?: string;
}

export function Tabs<T extends string = string>({
  items,
  active,
  onChange,
  className,
  ...rest
}: TabsProps<T>) {
  return (
    <div className={cx('oe-tabs', className)} role="tablist" aria-label={rest['aria-label']}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === active}
          className={cx('oe-tab', item.id === active && 'is-active')}
          onClick={() => onChange(item.id)}
        >
          {item.label}
          {typeof item.count === 'number' ? (
            <span className="oe-tab__count">{item.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

/* ---------- Toolbar ---------- */

export function Toolbar({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-toolbar', className)}>{children}</div>;
}
