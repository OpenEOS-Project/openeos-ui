import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../icons/generated';
import { renderIcon } from './icon';
import { Tooltip } from './tooltip';
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

/* ---------- IconButton ---------- */

export interface IconButtonProps
  extends Omit<ButtonProps, 'iconOnly' | 'children' | 'size' | 'aria-label' | 'title'> {
  /** Zugänglicher Name (aria-label) und Text des Tooltips. */
  label: string;
  /** Name aus dem Icon-Set oder ein eigenes Element. */
  icon: IconName | ReactNode;
  size?: 'xs' | 'sm' | 'md';
  /** Tooltip mit `label`; `false` nur aria-label. */
  tooltip?: boolean;
  tooltipPlacement?: 'top' | 'bottom';
  /** Kleine Zahl oder Punkt oben rechts, etwa aktive Filter. */
  badge?: ReactNode;
  /** Als Link statt Button. */
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Quadratischer Knopf nur mit Icon: `aria-label` aus `label`, Tooltip
 * mit demselben Text bei Hover, Fokus und langem Drücken.
 */
export function IconButton({
  label,
  icon,
  size = 'md',
  tooltip = true,
  tooltipPlacement,
  badge,
  href,
  target,
  rel,
  className,
  ...rest
}: IconButtonProps) {
  const content = (
    <>
      {renderIcon(icon)}
      {badge !== undefined && badge !== null && badge !== false ? (
        <span className="oe-btn__badge" aria-hidden>
          {badge}
        </span>
      ) : null}
    </>
  );
  const { loading, disabled, type, ...anchorRest } = rest;
  const el = href ? (
    <ButtonLink
      {...(anchorRest as Omit<ButtonLinkProps, 'children'>)}
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      aria-disabled={disabled || undefined}
      iconOnly
      size={size}
      className={cx(badge != null && badge !== false && 'has-badge', className)}
    >
      {content}
    </ButtonLink>
  ) : (
    <Button
      {...rest}
      aria-label={label}
      iconOnly
      size={size}
      className={cx(badge != null && badge !== false && 'has-badge', className)}
    >
      {content}
    </Button>
  );
  return tooltip ? (
    <Tooltip label={label} placement={tooltipPlacement}>
      {el}
    </Tooltip>
  ) : (
    el
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
