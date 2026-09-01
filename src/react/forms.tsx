import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { cx } from './utils';

/* ---------- Feld-Hülle ---------- */

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  /** Gesetzt heißt: Feld wird als fehlerhaft markiert. */
  error?: ReactNode;
  htmlFor?: string;
  className?: string;
  children?: ReactNode;
}

export function Field({ label, hint, error, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cx('oe-field', Boolean(error) && 'is-invalid', className)}>
      {label ? <label htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {hint && !error ? <span className="oe-field__hint">{hint}</span> : null}
      {error ? <span className="oe-field__err">{error}</span> : null}
    </div>
  );
}

/* ---------- Eingaben ----------
   Jede Komponente akzeptiert label/hint/error und verdrahtet
   id und aria-describedby selbst, damit Screenreader die
   Fehlermeldung vorlesen. */

type WithField = Pick<FieldProps, 'label' | 'hint' | 'error'> & { fieldClassName?: string };

export type InputProps = WithField &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { className?: string };

export function Input({ label, hint, error, fieldClassName, className, id, ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const msgId = `${inputId}-msg`;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={fieldClassName}>
      <input
        {...rest}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? msgId : undefined}
        className={cx('oe-input', className)}
      />
    </Field>
  );
}

export type TextareaProps = WithField &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & { className?: string };

export function Textarea({ label, hint, error, fieldClassName, className, id, ...rest }: TextareaProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={fieldClassName}>
      <textarea
        {...rest}
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cx('oe-textarea', className)}
      />
    </Field>
  );
}

export type SelectProps = WithField &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> & { className?: string };

export function Select({ label, hint, error, fieldClassName, className, id, children, ...rest }: SelectProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={fieldClassName}>
      <span className="oe-select-wrap">
        <select
          {...rest}
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cx('oe-select', className)}
        >
          {children}
        </select>
      </span>
    </Field>
  );
}

/** Eingabe mit angehängtem Suffix, z. B. "€" oder "%". */
export function InputGroup({ addon, className, children }: { addon: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <div className={cx('oe-input-group', className)}>
      {children}
      <span className="oe-input-group__addon">{addon}</span>
    </div>
  );
}

export function SearchInput({ icon, className, ...rest }: InputProps & { icon?: ReactNode }) {
  return (
    <div className={cx('oe-search', className)}>
      {icon}
      <input {...rest} type="search" className="oe-input" />
    </div>
  );
}

/* ---------- Checkbox, Radio, Switch ---------- */

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
  className?: string;
  children?: ReactNode;
};

export function Checkbox({ className, children, ...rest }: CheckboxProps) {
  return (
    <label className={cx('oe-check', className)}>
      <input {...rest} type="checkbox" />
      <span className="oe-check__box" />
      {children}
    </label>
  );
}

export function Radio({ className, children, ...rest }: CheckboxProps) {
  return (
    <label className={cx('oe-check', 'oe-check--radio', className)}>
      <input {...rest} type="radio" />
      <span className="oe-check__box" />
      {children}
    </label>
  );
}

export function Switch({ className, children, ...rest }: CheckboxProps) {
  return (
    <label className={cx('oe-switch', className)}>
      <input {...rest} type="checkbox" role="switch" />
      <span className="oe-switch__track" />
      {children}
    </label>
  );
}

export interface SettingToggleProps {
  label: ReactNode;
  /** Erklaerender Satz unter der Beschriftung. */
  hint?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  /**
   * Ohne eigenen Rahmen und Hintergrund — fuer Zeilen, die in einer
   * .oe-setting-list stehen und ihre Trennlinien von dort bekommen.
   */
  flush?: boolean;
  /** Felder, die zu dieser Einstellung gehoeren — nur sichtbar, wenn sie an ist. */
  children?: ReactNode;
}

/**
 * Eine An/Aus-Einstellung als Zeile: Beschriftung links, Schalter rechts.
 *
 * Die Beschriftung ist mit dem Schalter verknuepft, damit ein Klick darauf
 * ihn umlegt und Screenreader den Namen vorlesen — ein Schalter ohne
 * zugeordnete Beschriftung wird sonst nur als "Schalter" angesagt.
 */
export function SettingToggle({
  label,
  hint,
  checked,
  onChange,
  disabled,
  className,
  flush,
  children,
}: SettingToggleProps) {
  const id = useId();

  return (
    <div className={cx('oe-setting', flush && 'oe-setting--flush', className)}>
      <div className="oe-setting__row">
        <div className="oe-setting__copy">
          <label className="oe-setting__label" htmlFor={id}>
            {label}
          </label>
          {hint && <div className="oe-setting__hint">{hint}</div>}
        </div>
        <Switch
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
      </div>
      {checked && children && <div className="oe-setting__body">{children}</div>}
    </div>
  );
}

/* ---------- Segment & Chips ---------- */

export interface SegmentOption<T extends string = string> {
  id: T;
  label: ReactNode;
}

export interface SegmentProps<T extends string = string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (id: T) => void;
  className?: string;
  'aria-label'?: string;
}

export function Segment<T extends string = string>({ options, value, onChange, className, ...rest }: SegmentProps<T>) {
  return (
    <div className={cx('oe-segment', className)} role="group" aria-label={rest['aria-label']}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === value}
          className={cx(option.id === value && 'is-active')}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Chips({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('oe-chips', className)}>{children}</div>;
}

export interface ChipProps {
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export function Chip({ active, onRemove, onClick, className, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cx('oe-chip', active && 'is-active', className)}
    >
      {children}
      {onRemove ? (
        <span
          className="oe-chip__x"
          role="button"
          tabIndex={-1}
          aria-label="Entfernen"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </span>
      ) : null}
    </button>
  );
}
