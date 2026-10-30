import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { IconName } from '../icons/generated';
import { IconButton } from './button';
import { Spinner } from './data-display';
import { Dropdown, DropdownLink, DropdownOption } from './dropdown';
import { Icon, renderIcon } from './icon';
import { Tooltip } from './tooltip';
import { bem, cx } from './utils';

/* ---------- DataTable ----------
   Dichte Admin-Tabelle: auf dem Desktop eine echte <table> ohne
   waagerechtes Scrollen (Spalten mit priority 3 verschwinden unter
   1180 px, priority 2 unter 1024 px — reine CSS-Klassen), auf dem
   Telefon (≤ 767 px) wird jede Zeile zu einem zweizeiligen Eintrag:
   Zeile 1 = title + trailing, Zeile 2 = subtitle und meta, mit Punkt
   getrennt. Aktionen sitzen rechts: auf dem Desktop die ersten
   `inlineActions` als IconButton mit Tooltip, der Rest im ⋯-Dropdown;
   auf dem Telefon alle im Dropdown mit sichtbaren Texten.

   <table>/<tr>/<td> bleiben samt expliziten ARIA-Rollen erhalten, damit
   `getByRole('row')` / `getByRole('cell')` auch dann greifen, wenn CSS
   die Zeilen als Grid darstellt. */

export type DataColumnPriority = 1 | 2 | 3;
export type DataColumnMobile = 'title' | 'subtitle' | 'meta' | 'trailing' | 'hidden';

export interface DataColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  align?: 'start' | 'center' | 'end';
  /** Zahl: Mono, Tabellenziffern, rechtsbündig, kein Umbruch. */
  num?: boolean;
  /** 1 immer sichtbar · 2 ab 1024 px · 3 ab 1180 px (Desktop). */
  priority?: DataColumnPriority;
  /**
   * Rolle in der Telefon-Ansicht. Ohne Angabe: die erste Spalte wird
   * `title` (sofern keine andere es ist), alle anderen `hidden`.
   */
  mobile?: DataColumnMobile;
  width?: string | number;
  minWidth?: string | number;
  /** Zusätzliche Klasse auf th und td. */
  className?: string;
}

export interface RowAction {
  id: string;
  label: string;
  icon: IconName | ReactNode;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Als Link (z. B. Detailseite). */
  href?: string;
  danger?: boolean;
  /** Hervorgehoben (accent) in der Inline-Leiste. */
  primary?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface DataTableProps<T> {
  rows: readonly T[];
  /** Eindeutiger Schlüssel je Zeile: Feldname oder Funktion. */
  rowKey: keyof T | ((row: T, index: number) => string | number);
  columns: ReadonlyArray<DataColumn<T>>;
  actions?: (row: T, index: number) => RowAction[];
  /** Desktop: so viele Aktionen als Icon-Knöpfe, der Rest im Dropdown. */
  inlineActions?: number;
  onRowClick?: (row: T, event: MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>) => void;
  dense?: boolean;
  stickyHeader?: boolean;
  /** Nur für Screenreader; beschreibt die Tabelle. */
  caption: ReactNode;
  /** Inhalt, wenn `rows` leer ist. */
  empty?: ReactNode;
  loading?: boolean;
  /** Unter der Tabelle, z. B. `<DataPager>`. */
  footer?: ReactNode;
  /** Kopf der Aktionsspalte (sr-only) und Name des ⋯-Knopfs. */
  actionsLabel?: string;
  moreLabel?: string;
  loadingLabel?: string;
  rowClassName?: (row: T, index: number) => string | undefined;
  className?: string;
  id?: string;
}

const INTERACTIVE = 'a,button,input,select,textarea,label,[role="menu"],[role="menuitem"],[contenteditable="true"]';

function size(v: string | number | undefined): string | undefined {
  return typeof v === 'number' ? `${v}px` : v;
}

function isEmpty(node: ReactNode): boolean {
  return node === null || node === undefined || node === false || node === '';
}

/** Mobile-Rolle je Spalte: erste Spalte wird title, wenn keine es ist. */
function mobileRoles<T>(columns: ReadonlyArray<DataColumn<T>>): DataColumnMobile[] {
  const hasTitle = columns.some((c) => c.mobile === 'title');
  return columns.map((c, i) => c.mobile ?? (i === 0 && !hasTitle ? 'title' : 'hidden'));
}

const MOBILE_CLASS: Record<DataColumnMobile, string> = {
  title: 'oe-dt__m-title',
  subtitle: 'oe-dt__m-l2 oe-dt__m-sub',
  meta: 'oe-dt__m-l2 oe-dt__m-meta',
  trailing: 'oe-dt__m-trailing',
  hidden: 'oe-dt__m-hidden',
};

function colClass<T>(c: DataColumn<T>, mobile: DataColumnMobile, kind: 'th' | 'td'): string {
  return cx(
    `oe-dt__${kind}`,
    c.num && `oe-dt__${kind}--num`,
    c.align && !c.num && `oe-dt__${kind}--${c.align}`,
    c.priority && c.priority > 1 && `oe-dt__p${c.priority}`,
    mobile === 'title' && kind === 'td' && 'oe-dt__td--title',
    MOBILE_CLASS[mobile],
    c.className,
  );
}

export function DataTable<T>({
  rows,
  rowKey,
  columns,
  actions,
  inlineActions = 2,
  onRowClick,
  dense,
  stickyHeader,
  caption,
  empty = 'Keine Einträge',
  loading,
  footer,
  actionsLabel = 'Aktionen',
  moreLabel = 'Weitere Aktionen',
  loadingLabel = 'Lädt',
  rowClassName,
  className,
  id,
}: DataTableProps<T>) {
  const keyOf = (row: T, i: number): string | number =>
    typeof rowKey === 'function' ? rowKey(row, i) : (String(row[rowKey]) as string);
  const mobile = mobileRoles(columns);
  const hasActions = Boolean(actions);
  const colCount = columns.length + (hasActions ? 1 : 0);

  const onCellClick = (e: MouseEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick) return;
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE) && target.closest(INTERACTIVE) !== e.currentTarget) return;
    if (typeof window !== 'undefined' && window.getSelection()?.toString()) return;
    onRowClick(row, e);
  };
  const onRowKey = (e: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick || e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowClick(row, e);
    }
  };

  return (
    <div
      id={id}
      className={bem('oe-dt', [dense && 'dense', stickyHeader && 'sticky', onRowClick && 'clickable', loading && 'loading'], className)}
      aria-busy={loading || undefined}
    >
      <table className="oe-dt__table" role="table">
        <caption className="oe-sr-only">{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            {columns.map((c, i) => (
              <th
                key={c.id}
                role="columnheader"
                scope="col"
                className={colClass(c, mobile[i] ?? 'hidden', 'th')}
                style={c.width || c.minWidth ? { width: size(c.width), minWidth: size(c.minWidth) } : undefined}
              >
                {c.header}
              </th>
            ))}
            {hasActions ? (
              <th role="columnheader" scope="col" className="oe-dt__th oe-dt__th--actions">
                <span className="oe-sr-only">{actionsLabel}</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.length === 0 ? (
            <tr role="row" className="oe-dt__tr oe-dt__tr--empty">
              <td role="cell" className="oe-dt__td oe-dt__empty" colSpan={colCount}>
                {loading ? <Spinner /> : empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const acts = actions ? actions(row, i).filter((a) => !a.hidden) : [];
              return (
                <tr
                  key={keyOf(row, i)}
                  role="row"
                  className={cx('oe-dt__tr', rowClassName?.(row, i))}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? (e) => onCellClick(e, row) : undefined}
                  onKeyDown={onRowClick ? (e) => onRowKey(e, row) : undefined}
                >
                  {columns.map((c, ci) => {
                    const content = c.cell(row, i);
                    return (
                      <td
                        key={c.id}
                        role="cell"
                        className={cx(colClass(c, mobile[ci] ?? 'hidden', 'td'), isEmpty(content) && 'is-empty')}
                      >
                        {content}
                      </td>
                    );
                  })}
                  {hasActions ? (
                    <td role="cell" className="oe-dt__td oe-dt__td--actions" onClick={(e) => e.stopPropagation()}>
                      {acts.length > 0 ? (
                        <RowActions actions={acts} inline={inlineActions} moreLabel={moreLabel} />
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {loading && rows.length > 0 ? (
        <div className="oe-dt__loading">
          <Spinner />
          <span className="oe-sr-only">{loadingLabel}</span>
        </div>
      ) : null}
      {footer ? <div className="oe-dt__foot">{footer}</div> : null}
    </div>
  );
}

/* ---------- Aktionen je Zeile ---------- */

function actionVariant(a: RowAction) {
  return a.danger ? 'danger-quiet' : a.primary ? 'accent' : 'quiet';
}

function RowActions({ actions, inline, moreLabel }: { actions: RowAction[]; inline: number; moreLabel: string }) {
  const inlineActs = actions.slice(0, inline);
  const overflow = actions.slice(inline);
  return (
    <div className="oe-dt__actions">
      {inlineActs.map((a) => (
        <IconButton
          key={a.id}
          className="oe-dt__inline"
          size="xs"
          variant={actionVariant(a)}
          label={a.label}
          icon={a.icon}
          href={a.disabled ? undefined : a.href}
          disabled={a.disabled}
          onClick={a.onClick}
          data-action={a.id}
        />
      ))}
      <Tooltip label={moreLabel}>
        <Dropdown
          className={cx('oe-dt__more', overflow.length === 0 && 'oe-dt__more--m')}
          triggerVariant="icon"
          triggerSize="xs"
          align="end"
          aria-label={moreLabel}
          trigger={<Icon name="more" />}
        >
          {actions.map((a, i) => {
            const common = {
              className: i < inline ? 'oe-dt__opt--inline' : undefined,
              danger: a.danger,
              icon: renderIcon(a.icon),
              'data-action': a.id,
            };
            return a.href && !a.disabled ? (
              <DropdownLink key={a.id} {...common} href={a.href} onClick={a.onClick}>
                {a.label}
              </DropdownLink>
            ) : (
              <DropdownOption key={a.id} {...common} disabled={a.disabled} onClick={a.onClick}>
                {a.label}
              </DropdownOption>
            );
          })}
        </Dropdown>
      </Tooltip>
    </div>
  );
}
