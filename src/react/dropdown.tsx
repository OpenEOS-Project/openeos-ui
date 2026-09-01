import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { bem, cx } from './utils';

/* ---------- Auslöser ---------- */

export interface DropdownTriggerProps {
  /** Kleines Präfix links, etwa "Event". */
  prefix?: ReactNode;
  /** Der angezeigte Wert. */
  children?: ReactNode;
  variant?: 'quiet';
  size?: 'sm';
  block?: boolean;
  className?: string;
}

/** Chevron als Pfad — folgt currentColor, anders als ein Hintergrundbild. */
function Chevron() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path d="M2 4.5 6 8.5 10 4.5" />
    </svg>
  );
}

/* ---------- Dropdown ---------- */

export interface DropdownProps {
  /** Inhalt des Auslösers. Ohne trigger wird label verwendet. */
  trigger?: ReactNode;
  label?: ReactNode;
  prefix?: ReactNode;
  triggerVariant?: 'quiet';
  triggerSize?: 'sm';
  block?: boolean;
  /** Panel rechtsbündig statt links. */
  align?: 'start' | 'end';
  /** Panel nach oben öffnen — für Auslöser am unteren Rand. */
  placement?: 'bottom' | 'top';
  className?: string;
  children?: ReactNode;
}

/**
 * Dropdown aus Auslöser und Panel.
 *
 * Schließt bei Klick nach außen, mit Escape und bei Auswahl einer
 * Option. Die Optionen bleiben ungesteuert — was ein Klick bewirkt,
 * entscheidet die Anwendung; hier wird nur zugeklappt.
 */
export function Dropdown({
  trigger,
  label,
  prefix,
  triggerVariant,
  triggerSize,
  block,
  align = 'start',
  placement = 'bottom',
  className,
  children,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* Ein Klick im Panel schließt — außer er kam aus dem Suchfeld, das
     sonst nach dem ersten Zeichen verschwände. */
  const onPanelClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.oe-dd__search')) return;
    if (target.closest('.oe-dd__opt')) setOpen(false);
  }, []);

  return (
    <div ref={wrapRef} className={cx('oe-dd', open && 'is-open', className)}>
      <button
        type="button"
        className={bem('oe-dd__trigger', [triggerVariant, triggerSize, block && 'block'])}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {prefix ? <span className="oe-dd__pre">{prefix}</span> : null}
        {trigger ?? <span className="oe-dd__val">{label}</span>}
        <Chevron />
      </button>

      <div
        id={panelId}
        role="menu"
        className={cx(
          'oe-dd__panel',
          align === 'end' && 'oe-dd__panel--end',
          placement === 'top' && 'oe-dd__panel--top',
        )}
        onClick={onPanelClick}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Bausteine im Panel ---------- */

interface OptionBase {
  /** Hervorgehoben mit Häkchen. */
  selected?: boolean;
  danger?: boolean;
  icon?: ReactNode;
  /** Zweitwert rechts, etwa eine Anzahl. */
  meta?: ReactNode;
  className?: string;
  children?: ReactNode;
}

function optionClass({ selected, danger, className }: OptionBase) {
  return cx('oe-dd__opt', selected && 'is-sel', danger && 'oe-dd__opt--danger', className);
}

export type DropdownOptionProps = OptionBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export function DropdownOption({
  selected,
  danger,
  icon,
  meta,
  className,
  children,
  ...rest
}: DropdownOptionProps) {
  return (
    <button
      {...rest}
      type="button"
      role="menuitem"
      aria-current={selected || undefined}
      className={optionClass({ selected, danger, className })}
    >
      {icon}
      {children}
      {meta ? <small>{meta}</small> : null}
    </button>
  );
}

export type DropdownLinkProps = OptionBase &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>;

/** Optisch identisch, semantisch ein Link. */
export function DropdownLink({
  selected,
  danger,
  icon,
  meta,
  className,
  children,
  ...rest
}: DropdownLinkProps) {
  return (
    <a {...rest} role="menuitem" className={optionClass({ selected, danger, className })}>
      {icon}
      {children}
      {meta ? <small>{meta}</small> : null}
    </a>
  );
}

export function DropdownCaption({ children }: { children?: ReactNode }) {
  return <div className="oe-dd__cap">{children}</div>;
}

export function DropdownSeparator() {
  return <div className="oe-dd__sep" role="separator" />;
}

export interface DropdownSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Bleibt beim Scrollen oben stehen. */
export function DropdownSearch({ value, onChange, placeholder }: DropdownSearchProps) {
  return (
    <div className="oe-dd__search">
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
