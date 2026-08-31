import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from 'react';
import { bem, cx } from './utils';

/* ---------- Badge & Pill ---------- */

export type BadgeTone = 'success' | 'warn' | 'danger' | 'info' | 'ink' | 'outline';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  tone?: BadgeTone;
  className?: string;
  children?: ReactNode;
}

export function Badge({ tone, className, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={bem('oe-badge', [tone], className)}>
      {children}
    </span>
  );
}

export function Pill({ className, children }: { className?: string; children?: ReactNode }) {
  return <span className={cx('oe-pill', className)}>{children}</span>;
}

/* ---------- Statuspunkt ---------- */

export type DotTone = 'live' | 'warn' | 'danger';

export function StatusDot({ tone, className }: { tone?: DotTone; className?: string }) {
  return <span className={bem('oe-dot', [tone], className)} aria-hidden />;
}

export interface StatusProps {
  tone?: DotTone;
  className?: string;
  children?: ReactNode;
}

export function Status({ tone, className, children }: StatusProps) {
  return (
    <span className={cx('oe-status', className)}>
      <StatusDot tone={tone} />
      {children}
    </span>
  );
}

/** Veränderung gegenüber einem Vergleichszeitraum. */
export function Delta({
  direction = 'up',
  className,
  children,
}: {
  direction?: 'up' | 'down' | 'flat';
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span className={bem('oe-delta', [direction !== 'up' && direction], className)}>{children}</span>
  );
}

/* ---------- Avatar ---------- */

export interface AvatarProps {
  /** Wird auf maximal zwei Zeichen gekürzt, wenn kein Bild gesetzt ist. */
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  round?: boolean;
  soft?: boolean;
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return (parts[0] ?? '').slice(0, 2).toUpperCase();
  return `${(parts[0] ?? '')[0] ?? ''}${(parts[parts.length - 1] ?? '')[0] ?? ''}`.toUpperCase();
}

export function Avatar({ name = '', src, size = 'md', round, soft, className }: AvatarProps) {
  return (
    <span
      className={bem('oe-avatar', [size !== 'md' && size, round && 'round', soft && 'soft'], className)}
      title={name || undefined}
    >
      {src ? <img src={src} alt={name} /> : initials(name)}
    </span>
  );
}

export function AvatarStack({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-avatar-stack', className)}>{children}</div>;
}

/* ---------- Tabelle ---------- */

export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'className'> {
  compact?: boolean;
  className?: string;
  children?: ReactNode;
}

/** Rahmen und Radius für eine Tabelle. */
export function TableWrap({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-table-wrap', className)}>{children}</div>;
}

export function Table({ compact, className, children, ...rest }: TableProps) {
  return (
    <table {...rest} className={bem('oe-table', [compact && 'compact'], className)}>
      {children}
    </table>
  );
}

/* ---------- Ladezustände ---------- */

export function Spinner({ className }: { className?: string }) {
  return <span className={cx('oe-spinner', className)} role="status" aria-label="Lädt" />;
}

export function Skeleton({ width, height, className }: { width?: string | number; height?: string | number; className?: string }) {
  return <div className={cx('oe-skel', className)} style={{ width, height }} aria-hidden />;
}

/* ---------- Rangabzeichen ---------- */

export function Rank({ children, className }: { children?: ReactNode; className?: string }) {
  return <span className={cx('oe-rank', className)}>{children}</span>;
}
