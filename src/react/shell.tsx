import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './utils';

/* ---------- Grundgerüst ---------- */

export interface ShellProps {
  collapsed?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Shell({ collapsed, className, children }: ShellProps) {
  return (
    <div className={cx('oe-shell', collapsed && 'oe-shell--collapsed', className)}>{children}</div>
  );
}

export function Sidebar({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <aside className={cx('oe-side', 'oe-scroll', className)}>{children}</aside>
  );
}

export function SidebarGroup({ caption, className, children }: { caption?: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <div className={cx('oe-side__group', className)}>
      {caption ? <div className="oe-side__cap">{caption}</div> : null}
      {children}
    </div>
  );
}

export function SidebarFoot({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-side__foot', className)}>{children}</div>;
}

/* ---------- Navigationseintrag ----------
   Als <a> wenn href gesetzt ist, sonst als <button>. Next.js'
   <Link> kann über asChild-artiges Wrapping außen bleiben —
   hier reicht href, weil Link ein <a> rendert. */

interface NavBase {
  icon?: ReactNode;
  active?: boolean;
  badge?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export type NavItemProps = NavBase &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
  );

export function NavItem({ icon, active, badge, className, children, ...rest }: NavItemProps) {
  const cls = cx('oe-nav', active && 'is-active', className);
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {badge ? <span className="oe-nav__badge">{badge}</span> : null}
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchorProps} className={cls} aria-current={active ? 'page' : undefined}>
        {inner}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonProps} type="button" className={cls} aria-current={active ? 'page' : undefined}>
      {inner}
    </button>
  );
}

/* ---------- Organisations- und Event-Karte ---------- */

/* 'name' und 'role' werden ausgelassen: beide existieren am <button>
   bereits als HTML- bzw. ARIA-Attribut mit engerem Typ. Die zweite
   Zeile heißt hier deshalb subtitle statt role. */
export interface OrgCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'name' | 'role'> {
  name: ReactNode;
  /** Zweite Zeile, typischerweise die Rolle im Verein. */
  subtitle?: ReactNode;
  avatar?: ReactNode;
  chevron?: ReactNode;
  className?: string;
}

export function OrgCard({ name, subtitle, avatar, chevron, className, ...rest }: OrgCardProps) {
  return (
    <button {...rest} type="button" className={cx('oe-orgcard', className)}>
      {avatar}
      <span className="oe-orgcard__txt">
        <b>{name}</b>
        {subtitle ? <span>{subtitle}</span> : null}
      </span>
      {chevron}
    </button>
  );
}

export interface EventCardProps {
  name: ReactNode;
  state?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EventCard({ name, state, icon, className }: EventCardProps) {
  return (
    <div className={cx('oe-eventcard', className)}>
      {icon}
      <span>
        <b>{name}</b>
        {state ? <span>{state}</span> : null}
      </span>
    </div>
  );
}

/* ---------- Topbar & Inhalt ---------- */

export interface TopbarProps {
  /** Links: wo man sich befindet. */
  where?: ReactNode;
  right?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Topbar({ where, right, className, children }: TopbarProps) {
  return (
    <header className={cx('oe-top', className)}>
      {where ? <span className="oe-top__where">{where}</span> : null}
      {children}
      {right ? <div className="oe-top__right">{right}</div> : null}
    </header>
  );
}

export function Main({ className, children }: { className?: string; children?: ReactNode }) {
  return <main className={cx('oe-main', className)}>{children}</main>;
}

/* ---------- Menü ---------- */

export function Menu({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-menu', className)}>{children}</div>;
}

export function MenuItem({
  icon,
  danger,
  className,
  children,
  ...rest
}: { icon?: ReactNode; danger?: boolean; className?: string; children?: ReactNode } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'children'
>) {
  return (
    <button
      {...rest}
      type="button"
      className={cx('oe-menu__item', danger && 'oe-menu__item--danger', className)}
    >
      {icon}
      {children}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="oe-menu__sep" role="separator" />;
}

export function MenuCaption({ children }: { children?: ReactNode }) {
  return <div className="oe-menu__cap">{children}</div>;
}
