import type { InputHTMLAttributes, KeyboardEvent, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useId, useRef } from 'react';
import type { IconName } from '../icons/generated';
import { Icon, renderIcon } from './icon';
import { bem, cx } from './utils';

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
  /** Icon vor dem Text: Name aus dem OpenEOS-Set oder eigenes Element. */
  icon?: IconName | ReactNode;
  disabled?: boolean;
}

export interface SegmentProps<T extends string = string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (id: T) => void;
  /** `lg`: mindestens 40 px hoch (Touch). */
  size?: 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

export function Segment<T extends string = string>({ options, value, onChange, size = 'md', className, ...rest }: SegmentProps<T>) {
  return (
    <div className={bem('oe-segment', [size === 'lg' && 'lg'], className)} role="group" aria-label={rest['aria-label']}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === value}
          disabled={option.disabled}
          className={cx(option.id === value && 'is-active')}
          onClick={() => onChange(option.id)}
        >
          {option.icon ? renderIcon(option.icon) : null}
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Stepper ---------- */

export interface StepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  /**
   * Bei `value === min + 1` zeigt die Minus-Taste einen Papierkorb —
   * der nächste Tipp entfernt die Zeile (Warenkorb).
   */
  removeAtMin?: boolean;
  /** `lg`: 46 × 46 px (Optionen-Sheet). Default md: 40 × 44 px. */
  size?: 'md' | 'lg';
  disabled?: boolean;
  /** Zugängliche Namen der Tasten. */
  labels?: { decrease?: string; increase?: string; remove?: string };
  className?: string;
}

const DEFAULT_STEPPER_LABELS = { decrease: 'Weniger', increase: 'Mehr', remove: 'Entfernen' };

export function Stepper({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max,
  removeAtMin,
  size = 'md',
  disabled,
  labels,
  className,
}: StepperProps) {
  const names = { ...DEFAULT_STEPPER_LABELS, ...labels };
  const removes = Boolean(removeAtMin) && value === min + 1;
  return (
    <div className={bem('oe-stepper', [size === 'lg' && 'lg'], className)}>
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled || value <= min}
        aria-label={removes ? names.remove : names.decrease}
      >
        <Icon name={removes ? 'trash' : 'minus'} />
      </button>
      <b className="oe-stepper__val" aria-live="polite">
        {value}
      </b>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled || (max != null && value >= max)}
        aria-label={names.increase}
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}

/* ---------- Auswahl großer Optionen (Zahlarten) ---------- */

export interface ChoiceOption<T extends string = string> {
  id: T;
  label: ReactNode;
  icon?: IconName;
  disabled?: boolean;
  /** Kleiner Zusatz rechts, z. B. Terminalname. */
  hint?: ReactNode;
}

export interface ChoiceGroupProps<T extends string = string> {
  options: ReadonlyArray<ChoiceOption<T>>;
  value: T | null;
  onChange: (id: T) => void;
  /** `stack` (Default): untereinander. `row`: nebeneinander, Icon über Text. */
  layout?: 'stack' | 'row';
  className?: string;
  'aria-label'?: string;
}

/**
 * Einfachauswahl als große Knöpfe (role="radiogroup"). Pfeiltasten
 * wechseln die Auswahl, Tab springt nur die gewählte Option an.
 */
export function ChoiceGroup<T extends string = string>({
  options,
  value,
  onChange,
  layout = 'stack',
  className,
  ...rest
}: ChoiceGroupProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const enabled = options.filter((option) => !option.disabled);
  const focusId = enabled.some((option) => option.id === value) ? value : enabled[0]?.id;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key) || enabled.length === 0) return;
    event.preventDefault();
    const current = enabled.findIndex((option) => option.id === value);
    let next = current;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = enabled.length - 1;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current + 1) % enabled.length;
    else next = (current - 1 + enabled.length) % enabled.length;
    const target = enabled[next];
    if (!target) return;
    onChange(target.id);
    refs.current[options.indexOf(target)]?.focus();
  };

  return (
    <div
      className={bem('oe-choices', [layout === 'row' && 'row'], className)}
      role="radiogroup"
      aria-label={rest['aria-label']}
      onKeyDown={onKeyDown}
    >
      {options.map((option, index) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={option.id === focusId ? 0 : -1}
            disabled={option.disabled}
            className={cx('oe-choice', active && 'is-active')}
            onClick={() => onChange(option.id)}
          >
            {option.icon ? <Icon name={option.icon} /> : null}
            <span>{option.label}</span>
            {option.hint ? <span className="oe-choice__hint">{option.hint}</span> : null}
          </button>
        );
      })}
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
  disabled?: boolean;
  /** Zugänglicher Name des Entfernen-Kreuzes. */
  removeLabel?: string;
  className?: string;
  children?: ReactNode;
}

export function Chip({ active, onRemove, onClick, disabled, removeLabel = 'Entfernen', className, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={onClick ? active : undefined}
      className={cx('oe-chip', active && 'is-active', className)}
    >
      {children}
      {onRemove ? (
        <span
          className="oe-chip__x"
          role="button"
          tabIndex={-1}
          aria-label={removeLabel}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <Icon name="x" />
        </span>
      ) : null}
    </button>
  );
}
