import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Button, IconButton } from './button';
import { Sheet } from './sheet';
import { cx } from './utils';

/* ---------- FilterBar ----------
   Filterzeile über einer Tabelle. Auf dem Desktop stehen die Kinder
   nebeneinander; bis 767 px bleibt nur `leading` (etwa die Suche) und
   ein Filter-Knopf mit Zähler, der ein Sheet mit denselben Kindern
   öffnet. Die Kinder werden nur einmal gerendert (inline oder im
   Sheet), ihr Zustand gehört der Anwendung. */

export const FILTER_BAR_QUERY = '(max-width: 767px)';

/** `true`, sobald die Media-Query greift; auf dem Server und vor dem Mount `false`. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export interface FilterBarProps {
  /** Immer sichtbar, auch auf dem Telefon (z. B. `<SearchInput>`). */
  leading?: ReactNode;
  /** Rechts, immer sichtbar (z. B. „Neu“-Knopf). */
  actions?: ReactNode;
  /** Zahl aktiver Filter — Badge am Filter-Knopf. */
  activeCount?: number;
  /** Setzt alle Filter zurück; zeigt den Knopf im Sheet. */
  onReset?: () => void;
  label?: string;
  title?: ReactNode;
  resetLabel?: string;
  applyLabel?: string;
  className?: string;
  children?: ReactNode;
}

export function FilterBar({
  leading,
  actions,
  activeCount = 0,
  onReset,
  label = 'Filter',
  title,
  resetLabel = 'Zurücksetzen',
  applyLabel = 'Anwenden',
  className,
  children,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const mobile = useMediaQuery(FILTER_BAR_QUERY);
  useEffect(() => {
    if (!mobile) setOpen(false);
  }, [mobile]);

  return (
    <div className={cx('oe-filterbar', activeCount > 0 && 'has-active', className)}>
      {leading ? <div className="oe-filterbar__lead">{leading}</div> : null}
      {!mobile ? <div className="oe-filterbar__fields">{children}</div> : null}
      <div className="oe-filterbar__toggle">
        <IconButton
          icon="filter"
          label={label}
          variant={activeCount > 0 ? 'accent' : 'ghost'}
          badge={activeCount > 0 ? activeCount : undefined}
          tooltip={false}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        />
      </div>
      {actions ? <div className="oe-filterbar__actions">{actions}</div> : null}
      <Sheet
        open={mobile && open}
        onClose={() => setOpen(false)}
        title={title ?? label}
        icon="filter"
        footer={
          <>
            {onReset ? (
              <Button variant="ghost" onClick={onReset}>
                {resetLabel}
              </Button>
            ) : null}
            <Button variant="primary" className="oe-grow" onClick={() => setOpen(false)}>
              {applyLabel}
            </Button>
          </>
        }
      >
        <div className="oe-filterbar__sheet">{children}</div>
      </Sheet>
    </div>
  );
}
