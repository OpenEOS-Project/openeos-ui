# OpenEOS-Icons

Linien-Icons auf 24er Raster für Kasse, Verwaltung, Shop und Displays.
Eine Datei je Icon in `svg/`; `generated.ts` wird daraus erzeugt
(`pnpm icons`, Prüfung in CI mit `pnpm icons --check`).

## Stil

Jede Datei hat genau diese Wurzel und nur `path`, `circle`, `rect`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
```

- Farbe immer `currentColor` — Icons erben die Textfarbe.
- Punkte (z. B. `more`, `list`, `info`) sind gefüllte Kreise
  `<circle r="1.1" fill="currentColor" stroke="none" />`, sonst keine Füllung.
- `rect` ohne `rx="0"`; keine `transform`, `style`, `class`, `id`.
- Dateiname = Icon-Name, kebab-case.

Neues Icon: Datei in `svg/` anlegen, `pnpm icons` ausführen, Gruppe in
`index.ts` (`iconGroups`) und Suchwörter in `keywords.ts` ergänzen — die
Tests in `test/icons.test.mjs` prüfen, dass nichts davon fehlt.

## Herkunft und Lizenz

**77 Icons** stammen aus dem Entwurf `openeos-icons.js` (OpenEOS-Designsystem,
dort beschrieben als „Eigene Linien-Icons“, ohne Lizenzkopf). **12 Icons** sind
für 0.4.0 im selben Stil neu gezeichnet: `map`, `history`, `undo`, `copy`,
`rotate`, `table-round`, `stage`, `wall`, `text`, `zoom-in`, `zoom-out`, `drawer`.

Vor dem Release 0.4.0 wurden alle 89 Icons automatisch mit
[Lucide](https://lucide.dev) 1.52.0 (ISC, Teile MIT/Feather) und
[Tabler Icons](https://tabler.io/icons) 3.49.0 outline (MIT) verglichen —
textuell (identische Pfade) und geometrisch (Liniensegmente, Kreise und
Rechtecke nach Normalisierung, Jaccard-Ähnlichkeit zum ähnlichsten Icon
beider Sets):

| Ergebnis | Icons |
|---|---|
| geometrisch identisch mit Lucide (ISC) | `dashboard` = `layout-dashboard` |
| geometrisch identisch mit Tabler (MIT) | `box` = `box` |
| identisch mit Grundformen aus Lucide/Feather (MIT) | `plus`, `minus`, `x`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `more` (= `ellipsis`) |
| Teilüberdeckung ≤ 50 %, eigene Geometrie | alle übrigen, u. a. die Stichproben `wifi`, `mail`, `lock`, `search`, `cart`, `printer`, `calendar` (Ähnlichkeit ≤ 0,15) |

Kein Pfad ist wörtlich übernommen. Für die geometrisch gleichen Icons liegen
die Lizenztexte vorsorglich bei — beide Lizenzen sind mit AGPL-3.0 vereinbar:

- `LICENSE-lucide.txt` — ISC (Lucide) und MIT (Feather) für `dashboard` und
  die Grundformen oben
- `LICENSE-tabler.txt` — MIT für `box`

Alle anderen Icons sind eigene Zeichnungen und stehen wie das Paket unter
AGPL-3.0-only.
