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
die `--pos-*`-Aliase mit.

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

Die Komponenten sind bewusst dünn: sie setzen Klassen und Struktur, kein
Zustand und kein Overlay-Verhalten. Fokusfalle, Portale und Tastatur-
navigation bleiben Sache der Anwendung (in `openeos-web` macht das
react-aria-components).

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
   gh release create v0.3.2 --target main --generate-notes
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

AGPL-3.0-only
