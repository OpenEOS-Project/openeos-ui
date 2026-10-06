/**
 * Reine Rechenfunktionen des Tischplans — ohne DOM, damit sie sich mit
 * node:test prüfen lassen. Alle Werte in Einheiten des Bereichs
 * (Default 1200 × 800, Raster 20), nicht in Pixeln.
 */

export interface FloorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FloorArea {
  width: number;
  height: number;
}

/** Kleinste Tisch- bzw. Dekogröße beim Ziehen am Eckgriff. */
export const FLOOR_MIN_SIZE = 40;

/** Rundet auf das nächste Vielfache von `grid`; `grid ≤ 0` lässt den Wert stehen. */
export function snapToGrid(value: number, grid: number): number {
  if (!(grid > 0)) return value;
  const snapped = Math.round(value / grid) * grid;
  return Object.is(snapped, -0) ? 0 : snapped;
}

/**
 * Hält ein Rechteck vollständig in der Fläche: Größe höchstens die
 * Fläche (und mindestens `minSize`), dann `0 ≤ x ≤ width − w` bzw.
 * `0 ≤ y ≤ height − h`.
 */
export function clampToArea(rect: FloorRect, area: FloorArea, minSize = 0): FloorRect {
  const width = Math.min(Math.max(rect.width, minSize), area.width);
  const height = Math.min(Math.max(rect.height, minSize), area.height);
  const x = Math.min(Math.max(rect.x, 0), area.width - width);
  const y = Math.min(Math.max(rect.y, 0), area.height - height);
  return { x, y, width, height };
}

/**
 * Bildschirm-Pixel → Einheiten: `px * areaWidth / clientWidth`.
 * Die Fläche skaliert gleichmäßig (aspect-ratio), deshalb genügt die Breite.
 */
export function pxToUnits(px: number, areaWidth: number, clientWidth: number): number {
  if (!(clientWidth > 0)) return 0;
  return (px * areaWidth) / clientWidth;
}

/** Drehung um `delta` Grad, normalisiert auf 0–359. */
export function rotateBy(rotation: number, delta: number): number {
  const next = Math.round(rotation + delta) % 360;
  // `+ 0` macht aus -0 eine 0 (-720 % 360 ergibt -0).
  return (next < 0 ? next + 360 : next) + 0;
}

/** Anteil in Prozent für die CSS-Variablen (--x, --y, --w, --h), auf 4 Stellen gerundet. */
export function toPercent(value: number, total: number): string {
  if (!(total > 0)) return '0%';
  return `${Math.round((value / total) * 1_000_000) / 10_000}%`;
}

/**
 * Verschiebt ein Rechteck um (dx, dy) Einheiten, rastet optional ein und
 * hält es in der Fläche — die Rechnung hinter Ziehen und Pfeiltasten.
 */
export function moveRect(rect: FloorRect, dx: number, dy: number, area: FloorArea, grid = 0): FloorRect {
  return clampToArea(
    { ...rect, x: snapToGrid(rect.x + dx, grid), y: snapToGrid(rect.y + dy, grid) },
    area,
  );
}

/**
 * Ändert die Größe über den Eckgriff unten rechts: Breite/Höhe wachsen um
 * (dw, dh), rasten optional ein, bleiben ≥ `minSize` und enden am Rand der
 * Fläche; die Position bleibt.
 */
export function resizeRect(
  rect: FloorRect,
  dw: number,
  dh: number,
  area: FloorArea,
  grid = 0,
  minSize = FLOOR_MIN_SIZE,
): FloorRect {
  const width = Math.min(Math.max(snapToGrid(rect.width + dw, grid), minSize), area.width - rect.x);
  const height = Math.min(Math.max(snapToGrid(rect.height + dh, grid), minSize), area.height - rect.y);
  return { ...rect, width, height };
}
