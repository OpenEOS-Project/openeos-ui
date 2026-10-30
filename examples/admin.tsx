/* Spielwiese: DataTable, DataPager, FilterBar, IconButton, Tooltip.
   Bauen mit `pnpm build && pnpm examples`, öffnen über einen lokalen
   Server: npx serve . → /examples/admin.html (?theme=dark für dunkel). */
import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Badge,
  Button,
  DataPager,
  DataTable,
  Dropdown,
  DropdownOption,
  FilterBar,
  Icon,
  IconButton,
  SearchInput,
  Select,
  Status,
  Tooltip,
  type DataColumn,
  type RowAction,
} from '../src/index';

interface Order {
  id: string;
  number: string;
  guest: string;
  table: string;
  status: 'open' | 'paid' | 'cancelled';
  items: number;
  total: number;
  method: 'cash' | 'card';
  time: string;
  staff: string;
}

const STATUS: Record<Order['status'], { label: string; tone: 'success' | 'warn' | 'danger' }> = {
  open: { label: 'Offen', tone: 'warn' },
  paid: { label: 'Bezahlt', tone: 'success' },
  cancelled: { label: 'Storniert', tone: 'danger' },
};
const eur = (n: number) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

const GUESTS = ['Lena Hoffmann', 'Jonas Becker', 'Sarah Schulz-Wittenberg', 'Tim Wagner', 'Mia Fischer', 'Paul Schneider', 'Emma Meyer', 'Ben Weber'];
const ORDERS: Order[] = Array.from({ length: 137 }, (_, i) => ({
  id: `o${i + 1}`,
  number: `#${String(4200 + i).padStart(5, '0')}`,
  guest: GUESTS[i % GUESTS.length] ?? '',
  table: `A${(i % 12) + 1}`,
  status: (['open', 'paid', 'paid', 'paid', 'cancelled'] as const)[i % 5] ?? 'paid',
  items: (i * 7) % 9 + 1,
  total: Math.round(((i * 37) % 180 + 4.5) * 100) / 100,
  method: i % 3 === 0 ? 'cash' : 'card',
  time: `${String(11 + (i % 11)).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}`,
  staff: ['Anna', 'Max', 'Kim'][i % 3] ?? '',
}));

function Playground() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [dense, setDense] = useState(true);
  const [log, setLog] = useState<string[]>([]);
  const note = (s: string) => setLog((l) => [s, ...l].slice(0, 5));

  const filtered = useMemo(
    () =>
      ORDERS.filter(
        (o) =>
          (!query || o.guest.toLowerCase().includes(query.toLowerCase()) || o.number.includes(query)) &&
          (!status || o.status === status) &&
          (!method || o.method === method),
      ),
    [query, status, method],
  );
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const active = Number(Boolean(status)) + Number(Boolean(method));

  const columns: DataColumn<Order>[] = [
    { id: 'number', header: 'Nr.', cell: (o) => <span className="oe-table__id">{o.number}</span>, mobile: 'meta', width: 90 },
    { id: 'guest', header: 'Gast', cell: (o) => <span title={o.guest}>{o.guest}</span>, mobile: 'title' },
    { id: 'table', header: 'Tisch', cell: (o) => o.table, priority: 2, mobile: 'meta', width: 70 },
    { id: 'status', header: 'Status', cell: (o) => <Badge tone={STATUS[o.status].tone}>{STATUS[o.status].label}</Badge>, mobile: 'subtitle' },
    { id: 'items', header: 'Pos.', cell: (o) => o.items, num: true, priority: 3 },
    { id: 'method', header: 'Zahlart', cell: (o) => (o.method === 'cash' ? 'Bar' : 'Karte'), priority: 3, mobile: 'meta' },
    { id: 'staff', header: 'Kasse', cell: (o) => <Status tone="live">{o.staff}</Status>, priority: 2 },
    { id: 'time', header: 'Zeit', cell: (o) => o.time, num: true, priority: 2, mobile: 'hidden' },
    { id: 'total', header: 'Summe', cell: (o) => eur(o.total), num: true, mobile: 'trailing' },
  ];
  const actions = (o: Order): RowAction[] => [
    { id: 'open', label: 'Öffnen', icon: 'eye', primary: true, onClick: () => note(`Öffnen ${o.number}`) },
    { id: 'print', label: 'Bon drucken', icon: 'print', onClick: () => note(`Drucken ${o.number}`) },
    { id: 'refund', label: 'Erstatten', icon: 'undo', disabled: o.status !== 'paid', onClick: () => note(`Erstatten ${o.number}`) },
    { id: 'cancel', label: 'Stornieren', icon: 'x-circle', danger: true, hidden: o.status === 'cancelled', onClick: () => note(`Stornieren ${o.number}`) },
  ];

  return (
    <div className="ex">
      <header className="ex-hd">
        <div>
          <span className="oe-label">@openeos/ui 0.7.0</span>
          <h1>Admin-Tabellen</h1>
        </div>
        <div className="oe-row">
          <Tooltip label="Dichte Zeilen ein/aus">
            <Button variant={dense ? 'accent' : 'ghost'} size="sm" onClick={() => setDense((d) => !d)}>
              {dense ? 'Dicht' : 'Normal'}
            </Button>
          </Tooltip>
          <IconButton icon="refresh" label="Neu laden" variant="ghost" size="sm" onClick={() => note('Neu geladen')} />
          <IconButton icon="download" label="Export als CSV" variant="ghost" size="sm" badge={3} onClick={() => note('Export')} />
          <IconButton icon="trash" label="Alles löschen" variant="danger-quiet" size="sm" disabled />
          <Dropdown triggerVariant="icon" aria-label="Mehr" trigger={<Icon name="more" />} align="end">
            <DropdownOption onClick={() => note('Einstellungen')}>Einstellungen</DropdownOption>
          </Dropdown>
        </div>
      </header>

      <section className="ex-sec">
        <FilterBar
          leading={<SearchInput placeholder="Gast oder Nummer" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} aria-label="Suche" />}
          activeCount={active}
          onReset={() => { setStatus(''); setMethod(''); setPage(1); }}
          actions={<Button variant="primary" size="sm">Neue Bestellung</Button>}
        >
          <Select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">Alle Status</option>
            <option value="open">Offen</option>
            <option value="paid">Bezahlt</option>
            <option value="cancelled">Storniert</option>
          </Select>
          <Select aria-label="Zahlart" value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }}>
            <option value="">Alle Zahlarten</option>
            <option value="cash">Bar</option>
            <option value="card">Karte</option>
          </Select>
        </FilterBar>

        <DataTable
          rows={pageRows}
          rowKey="id"
          columns={columns}
          actions={actions}
          inlineActions={2}
          dense={dense}
          stickyHeader
          caption="Bestellungen"
          onRowClick={(o) => note(`Zeile ${o.number}`)}
          empty="Keine Bestellungen für diesen Filter."
          footer={
            <DataPager
              page={page}
              pageSize={pageSize}
              total={filtered.length}
              pageSizes={[10, 25, 50]}
              onChange={(p, s) => { setPage(p); setPageSize(s); }}
            />
          }
        />
        <p className="ex-log" aria-live="polite">{log.length ? log.join(' · ') : 'Klicks erscheinen hier.'}</p>
      </section>

      <section className="ex-sec">
        <h2>Leer und ladend</h2>
        <div className="ex-split">
          <DataTable rows={[]} rowKey="id" columns={columns.slice(0, 4)} caption="Leer" actions={actions} />
          <DataTable rows={pageRows.slice(0, 3)} rowKey="id" columns={columns.slice(0, 4)} caption="Lädt" loading />
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById('app')!).render(<Playground />);
