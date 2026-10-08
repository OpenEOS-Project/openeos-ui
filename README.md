# @openeos/ui

Das OpenEOS-Designsystem: Tokens, Klassenbibliothek und React-Komponenten
für Admin, POS, Shop, Landing und Displays.

Ein Paket, damit die Optik an genau einer Stelle gepflegt wird und alle
Repos sie per Versionssprung übernehmen.

## Installation

```bash
pnpm add @openeos/ui
```

## Einbinden

### 1. Styles

Einmal pro Anwendung, im Root-Layout:

```ts
import '@openeos/ui/styles.css';
```

Das bringt Tokens (hell und dunkel), die `.oe-*`-Klassenbibliothek und
die (veralteten) `--pos-*`-Aliase mit.

### 2. Schriften (Next.js)

```tsx
import { openEosFonts } from '@openeos/ui/fonts';

export default function RootLayout({ children }) {
  return <html className={openEosFonts.className}>{/* … */}</html>;
}
```

Setzt `--font-oe-sans` (Geist) und `--font-oe-mono` (JetBrains Mono) —
genau die Variablen, die `tokens.css` erwartet.

**Display-Schrift ist seit 0.3.3 Geist Extra Bold (800)**, vorher
Bricolage Grotesque. Es gibt nur noch zwei Familien: Geist und
JetBrains Mono. `.oe-display` setzt Gewicht 800, Laufweite `-0.04em`
und Zeilenhöhe `0.98`; für sehr große Headlines (ab ca. 80px) darf es
`-0.045em` sein. `font-variation-settings: "opsz" …` hat bei Geist
keine Wirkung und kann in eigenem CSS entfallen. `.oe-italic` wird
synthetisch geneigt (Geist hat keinen Kursivschnitt).

`--font-oe-display` setzt `tokens.css` als Alias auf `--font-oe-sans` —
dieselbe Datei, kein zweiter Download. Wer `tokens.css` nicht einbindet,
verwendet für Überschriften direkt `var(--font-oe-sans)`. Der Export
`bricolageDisplay` bleibt als veralteter Alias auf `geistSans` bestehen.

Die Schriften liegen seit 0.3.2 als WOFF2 im Paket und werden über
`next/font/local` eingebunden — weder `next build` noch der Browser
greifen auf Google Fonts zu (vorher `next/font/google`). Variable Fonts
aus Fontsource, Teilmengen latin und latin-ext (Umlaute, ß, ẞ, €);
Lizenz jeweils SIL OFL 1.1, siehe `src/fonts/files/OFL-*.txt`.
Verbraucher müssen nichts ändern.

### 3. Untitled-UI-Bridge (nur Tailwind-Projekte)

Projekte mit Untitled UI binden statt `styles.css` die Bridge in ihre
Tailwind-Einstiegsdatei ein. Sie färbt die beiden Primitiv-Ramps
(`--color-neutral-*`, `--color-brand-*`) auf die OpenEOS-Palette um —
damit übernehmen alle bestehenden Untitled-Komponenten die neue Optik,
ohne dass eine einzige angefasst werden muss.

```css
@import "tailwindcss";
@import "./theme.css";
@import "@openeos/ui/css/bridge-untitled.css";  /* muss NACH theme.css stehen */
@import "@openeos/ui/css/index.css";
```

Die Reihenfolge ist nicht optional: Tailwind führt alle `@theme`-Blöcke
in Quellreihenfolge zusammen, der spätere Wert gewinnt.

## Dark-Mode

Der Entwurf war hell. Die dunkle Palette ist daraus abgeleitet und
greift bei `.dark-mode` (Untitled UI), `.dark` (Tailwind-Konvention)
oder `[data-theme="dark"]`.

Zwei Tokengruppen existieren eigens dafür — wer eigene Komponenten
schreibt, sollte sie kennen:

| Token | Wofür |
|---|---|
| `--oe-primary` / `--oe-on-primary` | Primäraktion. **Nicht** `--oe-ink` benutzen: das ist im Dunkeln die Textfarbe und würde weiße Flächen erzeugen. |
| `--oe-contrast*` / `--oe-on-contrast*` | Invertierte Flächen (Ink-Karten, KPI, POS-Kacheln, Toast, Tooltip). Im Dunkeln werden sie *angehoben* statt invertiert. |
| `--oe-on-accent` | Kontrast auf `--oe-green-ink`-Füllungen (Häkchen, Meter). |
| `--oe-on-signal` | Kontrast auf `--oe-green` — immer dunkel, weil Signalgrün in beiden Modi hell ist. |

## React

```tsx
import { Button, Card, CardHead, CardBody, Kpi, Kpis } from '@openeos/ui';

<Kpis>
  <Kpi label="Umsatz heute" value="1.284,50 €" variant="accent" />
</Kpis>

<Card variant="raised">
  <CardHead title="Bestellungen" actions={<Button variant="primary">Neu</Button>} />
  <CardBody>…</CardBody>
</Card>
```

Die Komponenten sind bewusst dünn: sie setzen Klassen und Struktur und
halten keinen fachlichen Zustand. Ausnahmen mit eigenem Verhalten sind
`Sheet` (Portal, Fokusfalle, Escape, Scroll-Sperre, Wischen) und
`FloorPlan` im Bearbeitungsmodus (Ziehen, Eckgriff, Werkzeuge, Tastatur). Alle Texte
sind Props mit deutschem Default (du-Form); Anwendungen übergeben
übersetzte Texte.

### Kasse (seit 0.4.0)

| Komponente | Zweck | Klassen |
|---|---|---|
| `Icon` | Linien-Icon aus dem OpenEOS-Set (Lucide) (`name`, `size`, `label`, `filled`) | `.oe-icon` |
| `IconBox` | Icon oder Bild auf getönter Fläche, optional Mengenkreis; `accent` (seit 0.5.1) färbt Fläche und Icon in einer eigenen Farbe, z. B. der Kategoriefarbe, mit mindestens 3:1 Kontrast in Hell und Dunkel | `.oe-icobox*`, `.oe-icobox--tint` + `--oe-icobox-accent` |
| `Tile variant="product"` | Produktkachel: Name, Zeile 2, Icon-Box, Menge, Preis, Hinweise | `.oe-tile--product`, `.oe-tile__*` |
| `TableChip`, `TableGrid` | Tisch-Kachel (`state`, `current`, `size="lg"`) und Raster (`min`) | `.oe-tablechip*`, `.oe-tables` |
| `Legend` | Legende der Tischfarben | `.oe-legend*` |
| `Keypad` | Ziffernblock mit Icon-Tasten, `size="lg"`, `captureKeyboard` | `.oe-keypad*` |
| `Segment` | jetzt mit `icon`, `disabled`, `size="lg"` | `.oe-segment*` |
| `Stepper` | Menge −/+, `removeAtMin` zeigt Papierkorb | `.oe-stepper*` |
| `ChoiceGroup` | Zahlarten-Auswahl (radiogroup, Pfeiltasten) | `.oe-choices`, `.oe-choice` |
| `Sheet` | Dialog-Blatt: md 480 · wide 720 · pay 820 · done 400 px, ≤ 820 px Bottom-Sheet | `.oe-sheet*`, `.oe-sheet-layer` |
| `CartLine`, `CartBar` | Warenkorbzeile (`<li>` in `.oe-cartlines`) und Warenkorb-Leiste | `.oe-cartline*`, `.oe-cartbar*`, `.oe-bump` |
| `CategoryNav`, `CategoryButton` | Kategorienleiste, `responsive` folgt den Kassen-Breakpoints | `.oe-catnav*`, `.oe-cat*` |
| `Prompt` | gestrichelte Hinweisfläche mit großem Icon (Kartenterminal) | `.oe-prompt*` |
| `UserChip` | Benutzer mit Schloss-Knopf | `.oe-userchip*` |
| `StatusPill` | Kopf-Status (Online, TSE, Drucker, Uhr) | `.oe-statuspill*` |
| `FloorPlan` | Tischplan, `mode="view"` (Kasse) bzw. `"edit"` (Verwaltung); seit 0.6.0 mit Raumform, Wänden und Zonen | `.oe-floor*` |
| `Receipt` | jetzt mit Einzelpreis-Spalte, `info`- und `note`-Zeile | `.oe-receipt*` |

Ohne React-Komponente, als Klassen: `.oe-due` / `.oe-due__amount`
(zu zahlender Betrag), `.oe-given` (Gegeben; leer zeigt einen CSS-Strich),
`.oe-change` / `.oe-change--neg` (Rückgeld bzw. fehlender Betrag).

`FloorPlan` setzt Lage und Größe ausschließlich als CSS-Variablen in
Prozent (`--x`, `--y`, `--w`, `--h`, `--r`); die Fläche skaliert über
`aspect-ratio`. Die Rechenfunktionen (`snapToGrid`, `clampToArea`,
`pxToUnits`, `rotateBy`, `moveRect`, `resizeRect`, `toPercent`) sind
einzeln exportiert.

**Seit 0.6.0: Raumform, Wände, Zonen.** Neben rechteckiger Deko (`decor`)
nimmt `FloorPlan` auf:

| Prop | Typ | Darstellung |
|---|---|---|
| `outline` | `FloorPoint[] \| null` | Umriss des Raums (Polygon). Außerhalb grau schraffiert. Ohne (oder < 3 Punkte) gilt die ganze Fläche. |
| `walls` | `FloorWall[]` (`id`, `points` ≥ 2, `thickness?` Default 10) | Linienzug (SVG-Polyline), Stärke in Einheiten |
| `zones` | `FloorZone[]` (`id`, `zoneType: 'kitchen' \| 'blocked' \| 'bar' \| 'other'`, `points` ≥ 3, `label?`) | Polygon, Farbe aus dem Typ, `blocked` schraffiert; Beschriftung mit Icon im Schwerpunkt. Reine Darstellung, nie anklickbar in `view`. |

Koordinaten in Einheiten des Bereichs; das SVG liegt mit
`viewBox="0 0 width height"` unter Deko und Tischen. Im Bearbeitungsmodus
wählt `tool` das Werkzeug:

- `select` (Default): Tische/Deko wie bisher; Wände und Zonen anklicken,
  ziehen (verschiebt alle Punkte), Punktgriffe ziehen, an Kantenmitten
  Punkte einfügen, Entf löscht den gewählten Punkt bzw. ohne Punktauswahl das
  Element (`onDelete(id, 'wall' | 'zone')`), Pfeiltasten verschieben.
  Änderungen kommen als `onShapeCommit({ id, kind, points })`.
- `wall` / `zone`: Punkte klicken/tippen, Einrasten ans Raster und an
  0/45/90°; Doppelklick, Enter, „Fertig“ oder (Zone) Tipp auf den ersten
  Punkt beendet → `onShapeCreate({ kind, points })`. Rücktaste nimmt den
  letzten Punkt, Esc bricht ab (ohne Punkte: `onToolCancel()`).
- `outline`: Umriss (Default: Rechteck der Fläche) mit Punktgriffen
  bearbeiten → `onOutlineCommit(points)`; „Fertig“ ruft `onToolCancel()`.

Tische außerhalb des Umrisses bzw. in gesperrten Zonen markiert der
Bearbeitungsmodus (`.has-issue`, Warn-Icon, Zusatz im `aria-label`;
abschaltbar mit `showIssues={false}`). Alle Texte über `labels`
(`FLOOR_LABELS_DE`). Rechenfunktionen ohne DOM: `snapPoint`,
`pointInPolygon`, `polygonCentroid`, `polygonArea`, `movePoints`,
`insertPoint`, `removePoint`, `edgeMidpoints`, `rectOutline`,
`isRectOutline`, `tableIssue`; Grenzen `FLOOR_MAX_POINTS` (100),
`FLOOR_MIN_LINE_POINTS` (2), `FLOOR_MIN_POLYGON_POINTS` (3).

Eine statische Übersicht aller Bausteine in hell und
dunkel liegt in `examples/pos.html` (nach `pnpm build` über einen lokalen
Server öffnen).

**Kassen-Breakpoints:** kompakt ≤ 820 px, mittel ≤ 1180 px, darüber breit —
als `breakpoints.posCompact` / `breakpoints.posMedium` in
`@openeos/ui/tokens`. `.oe-catnav--responsive`, `.oe-sheet`,
`.oe-tablechip--lg` und `.oe-keypad` schalten an diesen Grenzen um.

## Icons

```tsx
import { Icon } from '@openeos/ui';                       // nur die Komponente
import { iconNames, iconGroups, iconKeywords, iconSources, iconSvg, isIconName, legacyIcon } from '@openeos/ui/icons';

<Icon name="beer" />                    // dekorativ: aria-hidden
<Icon name="lock" label="Sperren" />    // mit Bedeutung: role="img" + aria-label
<Icon name="star" filled size={20} />   // gefüllt, 20 px
iconSvg('beer', 20)                     // SVG-String ohne React (Doku, Landing, statische Seiten)
```

97 Linien-Icons in fünf Gruppen (`food`, `actions`, `payment`,
`operations`, `status`); Größe über `--oe-ico` (Default 18 px), Farbe über
`currentColor`. **Alle Icons stammen aus [Lucide](https://lucide.dev)**
(ISC) und werden zur Buildzeit ins Paket übernommen — keine
Laufzeit-Abhängigkeit. Die OpenEOS-Namen bleiben stabil; welches
Lucide-Icon dahintersteht, liefert `iconSources` (z. B. `cart` →
`shopping-cart`). `iconKeywords` liefert deutsche und englische Suchwörter
für einen Icon-Picker. Die SVG-Dateien liegen im Paket unter
`src/icons/svg/` — Zuordnung, Stil und Lizenz in
[`src/icons/README.md`](src/icons/README.md).

**Produkt-Icons sind keine Linien-Icons:** Produktbilder (Pils,
Apfelschorle, Grillwurst …) kommen als Bild aus `@openeos/pos-icons`
(`pos-icon:<id>`); dieses Paket bildet sie seit 0.5.0 nicht mehr ab.

`legacyIcon(value)` bildet Emojis aus alten Kategoriedaten auf ein
OpenEOS-Icon ab; die Tabelle steht als `legacyIconMap` zur Verfügung, ohne
Treffer gilt `LEGACY_FALLBACK_ICON` (`utensils`).

### Icons statt Zeichen

Im Markup stehen keine Emojis und keine Unicode-Symbole (`⌫ ✕ ✓ ▾ → ⋯ ×`)
— weder in den Komponenten noch in Anwendungen, die sie verwenden.
Pfeile, Kreuze, Haken und Rücktaste kommen aus dem Icon-Set, leere Werte
zeigt CSS (z. B. `.oe-given b:empty`). Seit 0.4.0 halten sich auch
`Keypad`, `Chip` und `Toast` daran.

## Changelog

### 0.6.1

- **FloorPlan:** Die Werkzeugleiste beim Zeichnen bzw. Bearbeiten der
  Raumform steht jetzt **unter** der Karte statt darüber. Vorher rutschte die
  Karte beim Wechsel des Werkzeugs um die Höhe der Leiste nach unten — wer
  gerade klickte, traf daneben.

### 0.6.0

- **FloorPlan: Raumform, Wände, Zonen.** Neue Props `outline`, `walls`,
  `zones`, `tool`, `onShapeCreate`, `onShapeCommit`, `onOutlineCommit`,
  `onToolCancel`, `showIssues`, `zoneLabel`, `labels`. Darstellung als SVG
  in `view` und `edit`, hell und dunkel; Werkzeuge Wand zeichnen, Zone
  zeichnen, Raumform bearbeiten (Punktgriffe, Einrasten an Raster und
  0/45/90°, Entf/Esc/Enter). Warnung für Tische außerhalb des Umrisses bzw.
  in gesperrten Zonen.
- **Rechenfunktionen** für Punkte und Polygone (siehe oben), mit `node --test`.
- **Tokens** `--oe-floor-outside`, `--oe-floor-hatch`, `--oe-floor-outline`,
  `--oe-floor-zone-kitchen|blocked|bar|other` (hell und dunkel).
- **Icons** `pointer` (Lucide `mouse-pointer-2`), `zone` (`square-dashed`),
  `outline` (`pentagon`), `ban` (`ban`) — 97 Icons.

### 0.5.3

- **Icon** `menu` (Lucide `menu`, drei waagerechte Striche) für Haupt-Menüs,
  etwa den Menü-Knopf im Kassen-Kopf. `more` (`···`) bleibt für
  Zeilen- und Kontextaktionen.

### 0.5.2

- **Sheet: Herunterziehen schließt** am Griff, am Kopf und im Inhalt,
  wenn er oben steht (Schwelle oder schneller Wisch, sonst federt das
  Blatt zurück). Die Geste steht als `useSwipeToClose` auch eigenen
  Bottom-Sheets zur Verfügung; `data-oe-nodrag` nimmt Elemente aus.
- **Icons** `sun`, `moon`, `monitor` (Darstellung hell/dunkel/System).

### 0.5.0

- **Icons aus Lucide:** Alle 89 Icons sind jetzt Lucide-Icons (1.52.0, ISC)
  unter den bisherigen Namen; die eigenen Zeichnungen sind entfallen.
  `scripts/build-icons.mjs` übernimmt die Geometrie aus `lucide-static`
  (devDependency) nach `src/icons/lucide.json`. Strich bleibt 1,8,
  `currentColor`, runde Enden. Wo Lucide kein eigenes Motiv hat (z. B.
  `table`, `sausage`, `fries`), steht das nächstliegende — Liste in
  [`src/icons/README.md`](src/icons/README.md).
- **Neu:** `iconSources` (Name → Lucide-Icon), `LUCIDE_VERSION`,
  `ICON_STROKE_WIDTH`.
- **Breaking:** `legacyIconMap` enthält keine `pos-icon:<id>`-Einträge mehr,
  `legacyIcon('pos-icon:…')` liefert `undefined`. `IconNodeTag` umfasst
  jetzt auch `'line'`. Details unter „Migration 0.4 → 0.5“.
- **Lizenz:** `src/icons/LICENSE-lucide.txt` (ISC/MIT) liegt bei,
  `LICENSE-tabler.txt` ist entfallen.
- `pos-alias.css` und der Alias `TableMap` bleiben vorerst (veraltet) im
  Paket; sie entfallen in einer späteren Version.

### 0.4.1

- **Silbentrennung in Produktkachel und Warenkorbzeile:** `.oe-tile--product`
  (Name) und `.oe-cartline__name` trennen lange Wörter jetzt nach Silben
  (`hyphens: auto; overflow-wrap: break-word`) statt mitten im Wort
  (`overflow-wrap: anywhere`): „Apfel-|schorle“ statt „Apfelsch|orle“.
  Voraussetzung ist ein `lang`-Attribut am Dokument (`<html lang="de">`);
  ohne `lang` bricht der Browser nur an Wortgrenzen bzw. als letzte
  Rettung im Wort.
- **`pos-alias.css` entschärft:** Die Grundregeln für `.pos-root`
  (Schrift, Farbe, `box-sizing`, Knopf-Reset, Fokusring) stehen jetzt in
  `:where()` und haben Spezifität 0. Vorher setzte `.pos-root button
  { color: inherit }` die Textfarbe von `.oe-btn--primary` & Co. außer Kraft
  — Primärknöpfe in `.pos-root` hatten unsichtbaren Text. Kein Breaking
  Change; eigene `.pos-root`-Regeln der App gewinnen jetzt immer. Die Datei
  bleibt veraltet und entfällt in 0.5.0 (statt `.pos-root` → `.oe-root`).

## Migration 0.5 → 0.6

| Änderung | Was tun |
|---|---|
| **`FloorItemKind` (Breaking für erschöpfende `switch`):** jetzt `'table' \| 'decor' \| 'wall' \| 'zone'`. `onSelect`, `onDelete`, `onDuplicate` können `'wall'`/`'zone'` liefern. | Zweige für Wände/Zonen ergänzen oder diese Fälle ignorieren. |
| **`FloorChange.kind`** ist jetzt `FloorRectKind` (`'table' \| 'decor'`) — unverändert in der Sache, nur ein eigener Typ. | Nichts; wer den Typ ausschreibt, `FloorRectKind` nutzen. |
| **Wand als Linienzug** kommt über `walls`, nicht über `decor`. `decor` bleibt rechteckig (`bar`, `wall`, `stage`, `label`). | Daten mit `points` (z. B. aus `table_areas.decor`) vor der Übergabe aufteilen: Rechtecke → `decor`, `{ type: 'wall', points }` → `walls`, `{ type: 'zone', … }` → `zones`. |
| **Hülle im Bearbeitungsmodus** hat `.oe-floor-wrap--edit` mit 8 px Innenabstand (Platz für Punktgriffe am Rand); beim Zeichnen steht eine Werkzeugleiste (`.oe-floor__toolbar`) unter der Karte (seit 0.6.1). | Feste Höhen/Abstände um den Editor prüfen. |
| Neue Icons `pointer`, `zone`, `outline`, `ban` (97 statt 93) | Tests, die die Anzahl prüfen, anpassen. |

## Migration 0.4 → 0.5

| Änderung | Was tun |
|---|---|
| **Icon-Geometrie (sichtbar):** Jedes Icon sieht jetzt aus wie sein Lucide-Gegenstück; Namen, Größe, Strich und Farbe bleiben. | Nichts — außer Screenshots/visuelle Tests neu aufnehmen. Wer ein bestimmtes Motiv erwartet, in `iconSources` bzw. `src/icons/README.md` nachsehen. |
| **Produkt-Icons (Breaking):** `legacyIconMap` enthält keine `pos-icon:<id>`-Einträge mehr; `legacyIcon('pos-icon:pils')` liefert `undefined` statt `'beer'`. | Produkte mit `pos-icon:<id>` als Bild aus `@openeos/pos-icons` zeigen (Paket als eigene Abhängigkeit), nicht als Linien-Icon. Ohne Bild auf das Icon der Kategorie bzw. `LEGACY_FALLBACK_ICON` zurückfallen. |
| Emojis aus Kategoriedaten | Unverändert: `legacyIcon('\u{1F37A}')` → `'beer'`. |
| **`IconNodeTag`** umfasst jetzt `'line'` (Lucide zeichnet einige Icons mit `<line>`). | Nur relevant, wer `ICON_NODES` selbst rendert und nach Tag verzweigt: `line` (Attribute `x1`, `y1`, `x2`, `y2`) unterstützen. `Icon` und `iconSvg` tun das bereits. |
| `src/icons/svg/*.svg` haben einen Kopfkommentar mit dem Lucide-Namen | Wer die Dateien direkt einliest, Kommentare überspringen. |
| `src/icons/LICENSE-tabler.txt` entfällt | Verweise darauf entfernen; maßgeblich ist `LICENSE-lucide.txt`. |

## Migration 0.3 → 0.4

| Änderung | Was tun |
|---|---|
| **`Keypad`-Tasten (Breaking):** Default jetzt `1–9, backspace, 0, enter` statt `1–9, '.', 0, '⌫'`. `'backspace'` und `'enter'` sind Spezialtasten mit Icon; `onKey` liefert diese Namen. | Wer die Defaults nutzte und `'⌫'`/`'.'` auswertete, auf `'backspace'` umstellen bzw. `keys` explizit übergeben (`'.'` geht weiter als Text-Taste). Zugängliche Namen über `labels`. |
| **`Keypad`-Größe:** Tasten haben jetzt eine Mindesthöhe von 52 px (Touch). | Bei Bedarf über eigene Klasse überschreiben. |
| `TableMap` heißt jetzt `TableGrid` | `TableMap` bleibt als veralteter Alias bis 0.5.0. |
| `pos-alias.css` (`--pos-*`) ist veraltet | Auf `--oe-*`-Tokens umstellen; die Aliase entfallen in 0.5.0. |
| `react-dom` ist Peer-Abhängigkeit (Portal von `Sheet`) | In React-Projekten ohnehin vorhanden. |
| `.oe-root button` setzt Schrift/Farbe nur noch mit Spezifität 0,0,1 | Vorher überschrieb der Reset die Textfarbe von `.oe-btn--primary` & Co. innerhalb von `.oe-root`; keine Aktion nötig. |
| Text in Warn-/Fehlerfarbe nutzt `--oe-warn-ink` / `--oe-danger-ink` | `.oe-badge--warn/--danger`, `.oe-banner--warn/--danger` und die Tisch-Zustände erreichen damit 4,5:1. Eigene Klassen mit `color: var(--oe-warn)` auf hellem Grund ebenso umstellen. |
| `.oe-tile b/span`-Regeln greifen nur noch auf direkte Kinder der einfachen Kachel | Nur relevant für eigenes, tiefer verschachteltes Markup in `.oe-tile`. |

## Tokens in JavaScript

Für alles, was keine CSS-Variable auflösen kann — Charts, Canvas, PDF,
E-Mail:

```ts
import { theme, chartSeries } from '@openeos/ui/tokens';
```

Im normalen Markup immer die CSS-Variablen benutzen: nur die kennen den
Dark-Mode.

## Entwicklung

```bash
pnpm install
pnpm build      # dist/ + gebündeltes styles.css
pnpm dev        # Watch-Modus
pnpm typecheck
pnpm icons      # src/icons/svg/, generated.ts, LICENSE-lucide.txt aus Lucide (src/icons/lucide.json)
pnpm test       # node:test gegen dist/ (vorher pnpm build)
```

Die Styles liegen als einzelne Module unter `src/styles/` und werden beim
Build zu einer flachen `dist/styles.css` zusammengezogen. Konsumenten
können auch einzelne Module ziehen: `@openeos/ui/css/buttons.css`.

## Release

Veröffentlicht wird automatisch aus GitHub Actions
(`.github/workflows/publish.yml`) per npm Trusted Publishing — es gibt
kein npm-Token im Repo.

1. Version in einem PR anheben (`version` in `package.json`, z. B. mit
   `npm version 0.3.2 --no-git-tag-version`) und mergen.
2. Release anlegen — der Tag muss `v` + die Version aus `package.json` sein:

   ```bash
   gh release create v0.4.0 --target main --generate-notes
   ```

3. Der Workflow „Publish to npm“ prüft Tag gegen Version, baut und
   veröffentlicht mit Provenance. Passen Tag und Version nicht zusammen,
   bricht er ab. Prerelease-Versionen (`1.0.0-rc.1`) landen unter dem
   dist-tag `next`, nicht `latest`.

### Einmalige Einrichtung auf npmjs.com

npmjs.com → Paket `@openeos/ui` → **Settings** → **Trusted Publisher** →
**GitHub Actions**:

| Feld | Wert |
|---|---|
| Organization or user | `OpenEOS-Project` |
| Repository | `openeos-ui` |
| Workflow filename | `publish.yml` |
| Environment name | *(leer lassen)* |

Danach kann unter **Settings** → **Publishing access** „Require two-factor
authentication and disallow tokens“ gesetzt werden: Trusted Publishing
funktioniert weiter, klassische Tokens nicht mehr.

## Lizenz

AGPL-3.0-only. Schriften: SIL OFL 1.1 (`src/fonts/files/OFL-*.txt`).
Icons: ausschließlich [Lucide](https://lucide.dev), ISC (Teile MIT von
Feather) — `src/icons/LICENSE-lucide.txt`, Details in
`src/icons/README.md`.
