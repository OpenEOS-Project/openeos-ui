# OpenEOS-Icons

Linien-Icons für Kasse, Verwaltung, Shop und Displays — **ausschließlich
aus [Lucide](https://lucide.dev)** (ISC), unter stabilen OpenEOS-Namen.

- `lucide.json` — Zuordnung OpenEOS-Name → Lucide-Icon (die einzige Datei,
  die man von Hand ändert).
- `svg/` — je Icon eine SVG-Datei, aus Lucide übernommen (vendored).
- `generated.ts` — Typen und Geometrie für `Icon` und `iconSvg`.
- `LICENSE-lucide.txt` — Lizenztext aus `lucide-static` (ISC, Teile MIT
  von Feather).

`svg/`, `generated.ts` und `LICENSE-lucide.txt` erzeugt `pnpm icons` aus
`lucide.json` und dem installierten `lucide-static` (devDependency, Version
fest gepinnt). Zur Laufzeit hängt das Paket nicht von Lucide ab. CI prüft
mit `pnpm icons --check`, dass alles aktuell ist.

## Stil

Lucide-Geometrie auf 24er Raster, unverändert. Das umgebende `<svg>` setzt
den Stil des Sets — wie bis 0.4:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
```

- Farbe immer `currentColor` — Icons erben die Textfarbe.
- Strich 1,8 statt Lucides 2 (`ICON_STROKE_WIDTH`), damit Kacheln,
  Knöpfe und Tabellen so leicht wirken wie vorher.
- Elemente: `path`, `circle`, `rect`, `line` (`IconNodeTag`).

## Neues Icon

1. Passendes Motiv auf [lucide.dev/icons](https://lucide.dev/icons) suchen,
   den **kanonischen** Namen nehmen (Aliase wie `trash-2` oder `history`
   lehnt der Generator ab).
2. Eintrag in `lucide.json` (alphabetisch), `pnpm icons` ausführen.
3. Gruppe in `index.ts` (`iconGroups`) und Suchwörter in `keywords.ts`
   ergänzen — `test/icons.test.mjs` prüft, dass nichts fehlt.

## Zuordnung

Die Namen aus 0.4 bleiben; dahinter steht jetzt dieses Lucide-Icon
(gleichnamig, wenn nicht anders angegeben).

| Gruppe | OpenEOS → Lucide |
|---|---|
| Speisen & Getränke | `beer`, `wine`, `shot` → `martini`, `soda` → `cup-soda`, `water` → `glass-water`, `bottle` → `bottle-wine`, `coffee`, `cake` → `cake-slice`, `sausage` → `beef`, `bread` → `croissant`, `fries` → `popcorn`, `icecream` → `ice-cream-cone`, `utensils`, `flame`, `leaf`, `chef` → `chef-hat`, `deposit` → `recycle` |
| Aktionen | `cart` → `shopping-cart`, `cart-plus` → `shopping-cart-plus`, `plus`, `minus`, `x`, `check`, `chevron-down`, `chevron-up`, `chevron-right`, `chevron-left`, `arrow-right`, `search`, `filter` → `funnel`, `edit` → `pencil`, `trash`, `more` → `ellipsis`, `send`, `print` → `printer`, `download`, `refresh` → `refresh-cw`, `split`, `percent`, `backspace` → `delete`, `lock`, `eye`, `logout` → `log-out`, `star`, `history` → `rotate-ccw-clock`, `undo` → `undo-2`, `copy`, `rotate` → `rotate-cw`, `zoom-in`, `zoom-out` |
| Bezahlen | `card` → `credit-card`, `cash` → `banknote`, `contactless` → `nfc`, `ticket`, `receipt` → `receipt-text`, `qr` → `qr-code`, `tag`, `drawer` → `archive` |
| Betrieb | `table` → `rectangle-horizontal`, `table-round` → `circle`, `users`, `user`, `clock`, `calendar`, `dashboard` → `layout-dashboard`, `orders` → `clipboard-list`, `box`, `device` → `tablet-smartphone`, `printer`, `pin` → `map-pin`, `chart` → `chart-column`, `sliders` → `sliders-horizontal`, `home` → `house`, `grid` → `layout-grid`, `list`, `note` → `sticky-note`, `bell`, `mail`, `map`, `stage` → `theater`, `wall` → `brick-wall`, `text` → `type`, `sun`, `moon`, `monitor`, `menu` |
| Status | `check-circle` → `circle-check`, `x-circle` → `circle-x`, `alert` → `triangle-alert`, `info`, `wifi`, `wifi-off`, `shield` |

Maschinenlesbar: `iconSources` aus `@openeos/ui/icons`.

### Wo Lucide kein eigenes Motiv hat

| Name | Lucide | Warum |
|---|---|---|
| `table` | `rectangle-horizontal` | Kein Esstisch in Lucide (`table` ist dort eine Datentabelle). Der Tischplan zeigt Tische von oben — eckig als Rechteck … |
| `table-round` | `circle` | … rund als Kreis; im Umschalter „eckig/rund“ bleibt der Unterschied klar. |
| `sausage` | `beef` | Keine Wurst; das Fleischstück steht für Grill und Wurst. |
| `bread` | `croissant` | Kein Brot/Brötchen; Gebäck. |
| `fries` | `popcorn` | Keine Pommes; gleiche Form (Tüte mit Stäbchen). |
| `shot` | `martini` | Kein Schnapsglas; Spirituosenglas. |
| `bottle` | `bottle-wine` | Einzige neutrale Flasche (`milk` wirkt wie Milch). |
| `drawer` | `archive` | Keine Kassenlade; Kasten mit Schublade. |
| `stage` | `theater` | Bühne mit Vorhang. |
| `receipt` | `receipt-text` | Lucides `receipt` trägt ein Dollarzeichen. |
| `print`, `printer` | `printer` | Aktion und Gerät teilen sich das Motiv. |

Produktbilder (Pils, Apfelschorle, Grillwurst …) sind keine Linien-Icons:
sie kommen als Bild aus `@openeos/pos-icons` und werden seit 0.5.0 nicht
mehr auf dieses Set abgebildet.

## Lizenz

Alle Icons stammen aus Lucide (Version: `LUCIDE_VERSION`, derzeit 1.52.0)
und stehen unter der ISC-Lizenz; einige Lucide-Icons gehen auf Feather
(MIT) zurück. Beide Texte stehen in `LICENSE-lucide.txt`, jede SVG-Datei
nennt ihr Lucide-Original im Kopfkommentar. ISC und MIT sind mit der
AGPL-3.0-only des Pakets vereinbar.

Bis 0.4 enthielt das Set eigene Zeichnungen (und ein mit Tabler
geometrisch gleiches Icon, daher `LICENSE-tabler.txt`); beides ist mit
0.5.0 entfallen.
