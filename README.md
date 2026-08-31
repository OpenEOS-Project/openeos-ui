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

Setzt `--font-oe-sans` (Geist), `--font-oe-display` (Bricolage Grotesque)
und `--font-oe-mono` (JetBrains Mono) — genau die Variablen, die
`tokens.css` erwartet.

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

## Lizenz

AGPL-3.0-only
