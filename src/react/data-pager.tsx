import type { ReactNode } from 'react';
import { IconButton } from './button';
import { cx } from './utils';

/* ---------- DataPager ----------
   Seitenwahl zur `.oe-pager`-Klasse: Zurück/Weiter als Icon-Knöpfe,
   Seitenzahlen mit Lücken, Info „1–25 von 240“. Auf dem Telefon oder
   mit `compact` nur „Seite 3 von 10“ statt der Zahlenreihe. */

export interface DataPagerLabels {
  prev: string;
  next: string;
  /** `(from, to, total)` → „1–25 von 240“ */
  info: (from: number, to: number, total: number) => ReactNode;
  /** `(page, pages)` → „Seite 3 von 10“ */
  page: (page: number, pages: number) => ReactNode;
  /** Name der Navigation (aria-label). */
  nav: string;
  perPage: string;
}

export const PAGER_LABELS_DE: DataPagerLabels = {
  prev: 'Zurück',
  next: 'Weiter',
  info: (from, to, total) => (total === 0 ? '0 Einträge' : `${from}–${to} von ${total}`),
  page: (page, pages) => `Seite ${page} von ${pages}`,
  nav: 'Seiten',
  perPage: 'pro Seite',
};

export interface DataPagerProps {
  /** 1-basiert. */
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  /** Auswahl der Seitengröße; ohne Angabe kein Select. */
  pageSizes?: readonly number[];
  /** Nur Zurück/Weiter und „Seite x von y“, auch auf dem Desktop. */
  compact?: boolean;
  /** Nachbarn der aktuellen Seite in der Zahlenreihe. */
  siblings?: number;
  labels?: Partial<DataPagerLabels>;
  className?: string;
}

/** Seitenzahlen mit `null` als Lücke, z. B. 1 … 4 5 6 … 20. */
export function pageItems(page: number, pages: number, siblings = 1): Array<number | null> {
  if (pages <= 2 * siblings + 5) return Array.from({ length: pages }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - siblings, pages - 2 * siblings - 2));
  const end = Math.min(pages - 1, Math.max(page + siblings, 2 * siblings + 3));
  const items: Array<number | null> = [1];
  if (start > 2) items.push(null);
  for (let i = start; i <= end; i++) items.push(i);
  if (end < pages - 1) items.push(null);
  items.push(pages);
  return items;
}

export function DataPager({ page, pageSize, total, onChange, pageSizes, compact, siblings = 1, labels, className }: DataPagerProps) {
  const t = { ...PAGER_LABELS_DE, ...labels };
  const pages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const cur = Math.min(Math.max(1, page), pages);
  const from = total === 0 ? 0 : (cur - 1) * pageSize + 1;
  const to = Math.min(total, cur * pageSize);
  const go = (p: number) => {
    if (p !== cur && p >= 1 && p <= pages) onChange(p, pageSize);
  };

  return (
    <nav className={cx('oe-pager', compact && 'oe-pager--compact', className)} aria-label={t.nav}>
      <span className="oe-pager__info">{t.info(from, to, total)}</span>
      {pageSizes ? (
        <label className="oe-pager__size">
          <select
            value={pageSize}
            onChange={(e) => onChange(1, Number(e.target.value))}
            aria-label={t.perPage}
          >
            {pageSizes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span aria-hidden>{t.perPage}</span>
        </label>
      ) : null}
      <IconButton size="sm" variant="ghost" icon="chevron-left" label={t.prev} tooltip={false} disabled={cur <= 1} onClick={() => go(cur - 1)} />
      <span className="oe-pager__cur" aria-current="page">
        {t.page(cur, pages)}
      </span>
      <span className="oe-pager__pages">
        {pageItems(cur, pages, siblings).map((p, i) =>
          p === null ? (
            <span key={`gap-${i}`} className="oe-pager__gap" aria-hidden />
          ) : (
            <button
              key={p}
              type="button"
              className={p === cur ? 'is-active' : undefined}
              aria-current={p === cur ? 'page' : undefined}
              aria-label={typeof t.page(p, pages) === 'string' ? (t.page(p, pages) as string) : undefined}
              onClick={() => go(p)}
            >
              {p}
            </button>
          ),
        )}
      </span>
      <IconButton size="sm" variant="ghost" icon="chevron-right" label={t.next} tooltip={false} disabled={cur >= pages} onClick={() => go(cur + 1)} />
    </nav>
  );
}
