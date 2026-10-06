import type { CSSProperties, ReactNode, SVGAttributes } from 'react';
import { ICON_NODES, ICON_STROKE_WIDTH, type IconName } from '../icons/generated';
import { cx } from './utils';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'className' | 'children' | 'name'> {
  name: IconName;
  /** Kantenlänge in px; setzt `--oe-ico`. Ohne: 18px bzw. der Wert des Elternelements. */
  size?: number;
  /**
   * Zugängliche Beschriftung. Ohne Label ist das Icon dekorativ
   * (`aria-hidden`), mit Label `role="img"` + `aria-label`.
   */
  label?: string;
  /** Füllt die Form (z. B. Stern für Favoriten). */
  filled?: boolean;
  className?: string;
}

export function Icon({ name, size, label, filled, className, style, ...rest }: IconProps) {
  const nodes = ICON_NODES[name] ?? ICON_NODES.x;
  const sized = size ? ({ ...style, '--oe-ico': `${size}px` } as CSSProperties) : style;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...rest}
      style={sized}
      className={cx('oe-icon', filled && 'oe-icon--filled', className)}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {nodes.map(([Tag, attrs], index) => (
        <Tag key={index} {...attrs} />
      ))}
    </svg>
  );
}

/** Icon-Props der Komponenten: Name aus dem Set → <Icon>, sonst unverändert. */
export function renderIcon(icon: IconName | ReactNode): ReactNode {
  return typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon;
}
