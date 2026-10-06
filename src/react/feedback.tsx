import type { ReactNode } from 'react';
import type { IconName } from '../icons/generated';
import { Icon } from './icon';
import { bem, cx } from './utils';

/* ---------- Banner ---------- */

export type BannerTone = 'success' | 'warn' | 'danger' | 'info';

export interface BannerProps {
  tone?: BannerTone;
  title?: ReactNode;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Banner({ tone, title, icon, className, children }: BannerProps) {
  return (
    <div className={bem('oe-banner', [tone], className)} role={tone === 'danger' ? 'alert' : 'status'}>
      {icon ? <span className="oe-banner__ico">{icon}</span> : null}
      <div>
        {title ? <b>{title}</b> : null}
        {children ? <p>{children}</p> : null}
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */

export interface ToastProps {
  tone?: 'success' | 'danger';
  title?: ReactNode;
  onDismiss?: () => void;
  /** Zugänglicher Name des Schließen-Knopfs. */
  dismissLabel?: string;
  className?: string;
  children?: ReactNode;
}

export function Toast({ tone, title, onDismiss, dismissLabel = 'Schließen', className, children }: ToastProps) {
  return (
    <div className={bem('oe-toast', [tone], className)} role="status">
      {title ? <b>{title}</b> : null}
      {children ? <span>{children}</span> : null}
      {onDismiss ? (
        <button type="button" className="oe-toast__x" onClick={onDismiss} aria-label={dismissLabel}>
          <Icon name="x" />
        </button>
      ) : null}
    </div>
  );
}

/* ---------- Leerzustand ---------- */

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cx('oe-empty', className)}>
      {icon ? <span className="oe-empty__ico">{icon}</span> : null}
      <b>{title}</b>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  );
}

export function NoData({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-nodata', className)}>{children}</div>;
}

/* ---------- Modal ----------
   Rein visuell: Fokusfalle, Escape-Handling und Portal bleiben
   bewusst außen vor, damit react-aria-components (openeos-web)
   oder ein eigener Dialog das übernehmen kann. */

export interface ModalProps {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Modal({ title, description, footer, className, children }: ModalProps) {
  return (
    <div className={cx('oe-modal', className)}>
      {title || description ? (
        <div className="oe-modal__head">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}
      <div className="oe-modal__body">{children}</div>
      {footer ? <div className="oe-modal__foot">{footer}</div> : null}
    </div>
  );
}

export function Scrim({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-scrim', className)}>{children}</div>;
}

/* ---------- Tooltip ---------- */

export function Tooltip({ label, className, children }: { label: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <span className={cx('oe-tip', className)}>
      {children}
      <span className="oe-tip__bubble" role="tooltip">
        {label}
      </span>
    </span>
  );
}

/* ---------- Hinweisfläche mit großem Icon ----------
   Kartenterminal („Karte auflegen“), leere Karte, Warten auf etwas
   außerhalb des Bildschirms. */

export interface PromptProps {
  icon: IconName;
  title: ReactNode;
  text?: ReactNode;
  className?: string;
  /** Unter dem Text, z. B. Spinner oder Abbrechen-Knopf. */
  children?: ReactNode;
}

export function Prompt({ icon, title, text, className, children }: PromptProps) {
  return (
    <div className={cx('oe-prompt', className)} role="status">
      <span className="oe-prompt__ico">
        <Icon name={icon} />
      </span>
      <b className="oe-prompt__title">{title}</b>
      {text ? <p className="oe-prompt__text">{text}</p> : null}
      {children}
    </div>
  );
}
