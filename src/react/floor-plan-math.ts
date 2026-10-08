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

/* ---------- Linien und Polygone (seit 0.6.0) ---------- */

export interface FloorPoint {
  x: number;
  y: number;
}

/** Höchstens so viele Punkte je Wand, Zone oder Umriss (wie die API). */
export const FLOOR_MAX_POINTS = 100;
/** Mindestpunkte: Wand (Linienzug) 2, Zone und Umriss (Polygon) 3. */
export const FLOOR_MIN_LINE_POINTS = 2;
export const FLOOR_MIN_POLYGON_POINTS = 3;
/** Winkel-Einrasten: so nah (in Grad) muss die Richtung an 0/45/90° liegen. */
export const FLOOR_ANGLE_TOLERANCE = 10;

/** Punkt in die Fläche holen (0 … width, 0 … height). */
export function clampPoint(point: FloorPoint, area: FloorArea): FloorPoint {
  return {
    x: Math.min(Math.max(point.x, 0), area.width),
    y: Math.min(Math.max(point.y, 0), area.height),
  };
}

const roundPoint = (point: FloorPoint): FloorPoint => ({ x: Math.round(point.x) + 0, y: Math.round(point.y) + 0 });

/**
 * Einrasten eines Punkts beim Zeichnen: liegt die Richtung vom vorigen
 * Punkt nah an 0°, 45°, 90° … (± `tolerance`), wird sie darauf gezogen —
 * waagerecht/senkrecht bleibt die andere Koordinate des Vorgängers
 * stehen, diagonal sind beide Schritte gleich lang (auf das Raster
 * gerundet). Sonst rastet der Punkt nur auf das Raster ein. Ergebnis
 * ganzzahlig und in der Fläche.
 */
export function snapPoint(
  point: FloorPoint,
  area: FloorArea,
  grid = 0,
  prev: FloorPoint | null = null,
  tolerance = FLOOR_ANGLE_TOLERANCE,
): FloorPoint {
  const p = clampPoint(point, area);
  const plain = () => roundPoint(clampPoint({ x: snapToGrid(p.x, grid), y: snapToGrid(p.y, grid) }, area));
  if (!prev || !(tolerance > 0)) return plain();
  const dx = p.x - prev.x;
  const dy = p.y - prev.y;
  if (dx === 0 && dy === 0) return plain();
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const k = Math.round(angle / 45);
  if (Math.abs(angle - k * 45) > tolerance) return plain();
  const dir = ((k % 8) + 8) % 8; // 0 = rechts, 2 = unten, 4 = links, 6 = oben
  if (dir === 0 || dir === 4) {
    return roundPoint(clampPoint({ x: snapToGrid(p.x, grid), y: prev.y }, area));
  }
  if (dir === 2 || dir === 6) {
    return roundPoint(clampPoint({ x: prev.x, y: snapToGrid(p.y, grid) }, area));
  }
  const sx = dir === 1 || dir === 7 ? 1 : -1;
  const sy = dir === 1 || dir === 3 ? 1 : -1;
  const room = Math.min(sx > 0 ? area.width - prev.x : prev.x, sy > 0 ? area.height - prev.y : prev.y);
  const step = Math.max(0, Math.min(snapToGrid((Math.abs(dx) + Math.abs(dy)) / 2, grid), room));
  return roundPoint({ x: prev.x + sx * step, y: prev.y + sy * step });
}

/** Gleiche Koordinaten? */
export function samePoint(a: FloorPoint | null | undefined, b: FloorPoint | null | undefined): boolean {
  return !!a && !!b && a.x === b.x && a.y === b.y;
}

function onSegment(p: FloorPoint, a: FloorPoint, b: FloorPoint, eps = 1e-9): boolean {
  const cross = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
  if (Math.abs(cross) > eps * Math.max(1, Math.hypot(b.x - a.x, b.y - a.y))) return false;
  return (
    p.x >= Math.min(a.x, b.x) - eps &&
    p.x <= Math.max(a.x, b.x) + eps &&
    p.y >= Math.min(a.y, b.y) - eps &&
    p.y <= Math.max(a.y, b.y) + eps
  );
}

/**
 * Punkt im Polygon (Strahlverfahren, gerade/ungerade). Punkte auf dem
 * Rand zählen als innen. Weniger als 3 Punkte: nie innen.
 */
export function pointInPolygon(point: FloorPoint, polygon: ReadonlyArray<FloorPoint>): boolean {
  const n = polygon.length;
  if (n < 3) return false;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const a = polygon[i]!;
    const b = polygon[j]!;
    if (onSegment(point, a, b)) return true;
    if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/** Vorzeichenbehaftete Fläche (Gaußsche Trapezformel). */
export function polygonArea(polygon: ReadonlyArray<FloorPoint>): number {
  let sum = 0;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j]!;
    const b = polygon[i]!;
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

/**
 * Schwerpunkt eines Polygons — dort steht die Beschriftung einer Zone.
 * Entartete Polygone (Fläche 0) nehmen den Mittelwert der Punkte.
 */
export function polygonCentroid(polygon: ReadonlyArray<FloorPoint>): FloorPoint {
  if (polygon.length === 0) return { x: 0, y: 0 };
  const a = polygonArea(polygon);
  if (Math.abs(a) < 1e-9) {
    const sum = polygon.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: sum.x / polygon.length, y: sum.y / polygon.length };
  }
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const p = polygon[j]!;
    const q = polygon[i]!;
    const f = p.x * q.y - q.x * p.y;
    cx += (p.x + q.x) * f;
    cy += (p.y + q.y) * f;
  }
  return { x: cx / (6 * a), y: cy / (6 * a) };
}

/** Umriss eines Bereichs ohne eigene Form: das Rechteck der ganzen Fläche. */
export function rectOutline(area: FloorArea): FloorPoint[] {
  return [
    { x: 0, y: 0 },
    { x: area.width, y: 0 },
    { x: area.width, y: area.height },
    { x: 0, y: area.height },
  ];
}

/** Ist der Umriss nur das Rechteck der Fläche (also gleichbedeutend mit „kein Umriss“)? */
export function isRectOutline(points: ReadonlyArray<FloorPoint> | null | undefined, area: FloorArea): boolean {
  if (!points || points.length === 0) return true;
  if (points.length !== 4) return false;
  const rect = rectOutline(area);
  // Gleiche Ecken, egal wo der Umlauf beginnt und in welche Richtung.
  return rect.every((corner) => points.some((p) => samePoint(p, corner)));
}

/**
 * Verschiebt alle Punkte um (dx, dy); der Versatz rastet auf das Raster
 * ein und wird so begrenzt, dass alle Punkte in der Fläche bleiben.
 */
export function movePoints(
  points: ReadonlyArray<FloorPoint>,
  dx: number,
  dy: number,
  area: FloorArea,
  grid = 0,
): FloorPoint[] {
  if (points.length === 0) return [];
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const sx = Math.min(Math.max(Math.round(snapToGrid(dx, grid)), -Math.min(...xs)), area.width - Math.max(...xs));
  const sy = Math.min(Math.max(Math.round(snapToGrid(dy, grid)), -Math.min(...ys)), area.height - Math.max(...ys));
  return points.map((p) => ({ x: p.x + sx + 0, y: p.y + sy + 0 }));
}

/** Ersetzt den Punkt an `index` (neue Liste). */
export function replacePoint(points: ReadonlyArray<FloorPoint>, index: number, point: FloorPoint): FloorPoint[] {
  return points.map((p, i) => (i === index ? point : p));
}

/**
 * Fügt hinter `index` einen Punkt ein (neue Liste) — `null`, wenn die
 * Höchstzahl erreicht ist.
 */
export function insertPoint(
  points: ReadonlyArray<FloorPoint>,
  index: number,
  point: FloorPoint,
  max = FLOOR_MAX_POINTS,
): FloorPoint[] | null {
  if (points.length >= max) return null;
  const next = points.slice();
  next.splice(index + 1, 0, point);
  return next;
}

/**
 * Entfernt den Punkt an `index` (neue Liste) — `null`, wenn danach
 * weniger als `min` Punkte blieben.
 */
export function removePoint(points: ReadonlyArray<FloorPoint>, index: number, min: number): FloorPoint[] | null {
  if (points.length - 1 < min || index < 0 || index >= points.length) return null;
  return points.filter((_p, i) => i !== index);
}

/**
 * Mittelpunkte der Kanten — dort sitzen die Griffe „Punkt einfügen“.
 * `closed` (Polygon) schließt die Kante vom letzten zum ersten Punkt ein.
 * `after` ist der Index, hinter dem der neue Punkt eingefügt wird.
 */
export function edgeMidpoints(
  points: ReadonlyArray<FloorPoint>,
  closed: boolean,
): Array<{ after: number; point: FloorPoint }> {
  const out: Array<{ after: number; point: FloorPoint }> = [];
  const n = points.length;
  const edges = closed && n >= 3 ? n : n - 1;
  for (let i = 0; i < edges; i += 1) {
    const a = points[i]!;
    const b = points[(i + 1) % n]!;
    out.push({ after: i, point: { x: Math.round((a.x + b.x) / 2), y: Math.round((a.y + b.y) / 2) } });
  }
  return out;
}

/** Punkte als SVG-Attribut `points` („x,y x,y …“). */
export function pointsAttr(points: ReadonlyArray<FloorPoint>): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

/** Ecken eines (um seine Mitte gedrehten) Rechtecks plus Mittelpunkt. */
export function rectProbePoints(rect: FloorRect & { rotation?: number }): FloorPoint[] {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const rad = ((rect.rotation ?? 0) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const hw = rect.width / 2;
  const hh = rect.height / 2;
  const corners = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ].map(([dx = 0, dy = 0]) => ({ x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos }));
  return [{ x: cx, y: cy }, ...corners];
}

export type FloorTableIssue = 'outside' | 'blocked';

/**
 * Warnung für einen Tisch: `outside`, wenn er (eine Ecke genügt) außerhalb
 * des Umrisses liegt, `blocked`, wenn Mitte oder eine Ecke in einer
 * gesperrten Zone liegt; sonst `null`. Ohne Umriss gilt die ganze Fläche.
 * Nur ein Hinweis — der Tisch bleibt gültig.
 */
export function tableIssue(
  rect: FloorRect & { rotation?: number },
  outline: ReadonlyArray<FloorPoint> | null | undefined,
  blockedZones: ReadonlyArray<ReadonlyArray<FloorPoint>> = [],
): FloorTableIssue | null {
  const probes = rectProbePoints(rect);
  // Kleine Toleranz: Rundung der Drehung soll an der Kante nicht warnen.
  const inside = (p: FloorPoint, poly: ReadonlyArray<FloorPoint>) =>
    pointInPolygon({ x: Math.round(p.x * 1000) / 1000, y: Math.round(p.y * 1000) / 1000 }, poly);
  if (outline && outline.length >= 3 && probes.some((p) => !inside(p, outline))) return 'outside';
  if (blockedZones.some((zone) => zone.length >= 3 && probes.some((p) => inside(p, zone)))) return 'blocked';
  return null;
}
