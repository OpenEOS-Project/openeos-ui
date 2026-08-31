import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { bem, cx } from './utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'quiet'
  | 'accent'
  | 'danger'
  | 'danger-quiet'
  | 'signal'
  | 'outline-light';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonBase {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Volle Breite des Containers. */
  block?: boolean;
  /** Quadratisch, für Buttons die nur ein Icon tragen. */
  iconOnly?: boolean;
  className?: string;
  children?: ReactNode;
}

function buttonClass({ variant = 'secondary', size = 'md', block, iconOnly, className }: ButtonBase) {
  return bem(
    'oe-btn',
    [variant, size !== 'md' && size, block && 'block', iconOnly && 'icon'],
    className,
  );
}

export type ButtonProps = ButtonBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    /** Zeigt einen Spinner und sperrt den Button. */
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  block,
  iconOnly,
  className,
  loading,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={buttonClass({ variant, size, block, iconOnly, className })}
    >
      {loading ? <span className="oe-spinner" aria-hidden /> : null}
      {children}
    </button>
  );
}

export type ButtonLinkProps = ButtonBase &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>;

/** Optisch identisch zu Button, semantisch ein Link. */
export function ButtonLink({ variant, size, block, iconOnly, className, children, ...rest }: ButtonLinkProps) {
  return (
    <a {...rest} className={buttonClass({ variant, size, block, iconOnly, className })}>
      {children}
    </a>
  );
}

export interface ButtonGroupProps {
  className?: string;
  children?: ReactNode;
}

export function ButtonGroup({ className, children }: ButtonGroupProps) {
  return <div className={cx('oe-btn-group', className)}>{children}</div>;
}

export function Actions({ className, children }: ButtonGroupProps) {
  return <div className={cx('oe-actions', className)}>{children}</div>;
}
