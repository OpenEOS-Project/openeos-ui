// Reine Rechenfunktionen des Tischplans, geprüft gegen den Build (dist).
//   pnpm build && node --test test/floor-plan-math.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  FLOOR_MIN_SIZE,
  FLOOR_MAX_POINTS,
  clampToArea,
  edgeMidpoints,
  insertPoint,
  isRectOutline,
  movePoints,
  pointInPolygon,
  pointsAttr,
  polygonArea,
  polygonCentroid,
  rectOutline,
  removePoint,
  snapPoint,
  tableIssue,
  moveRect,
  pxToUnits,
  resizeRect,
  rotateBy,
  snapToGrid,
  toPercent,
} from '../dist/index.js';

const area = { width: 1200, height: 800 };

test('snapToGrid rundet auf das nächste Vielfache', () => {
  assert.equal(snapToGrid(0, 20), 0);
  assert.equal(snapToGrid(9, 20), 0);
  assert.equal(snapToGrid(10, 20), 20);
  assert.equal(snapToGrid(31, 20), 40);
  assert.equal(snapToGrid(-9, 20), 0);
  assert.equal(Object.is(snapToGrid(-9, 20), -0), false, 'kein -0');
  assert.equal(snapToGrid(-11, 20), -20);
});

test('snapToGrid ohne Raster lässt den Wert stehen', () => {
  assert.equal(snapToGrid(13.7, 0), 13.7);
  assert.equal(snapToGrid(13.7, -5), 13.7);
});

test('clampToArea hält das Rechteck in der Fläche', () => {
  assert.deepEqual(clampToArea({ x: -10, y: -5, width: 80, height: 80 }, area), { x: 0, y: 0, width: 80, height: 80 });
  assert.deepEqual(clampToArea({ x: 1180, y: 790, width: 80, height: 80 }, area), { x: 1120, y: 720, width: 80, height: 80 });
  assert.deepEqual(clampToArea({ x: 100, y: 100, width: 80, height: 80 }, area), { x: 100, y: 100, width: 80, height: 80 });
});

test('clampToArea begrenzt die Größe auf Fläche und Mindestmaß', () => {
  assert.deepEqual(clampToArea({ x: 50, y: 50, width: 2000, height: 900 }, area), { x: 0, y: 0, width: 1200, height: 800 });
  assert.deepEqual(clampToArea({ x: 0, y: 0, width: 10, height: 10 }, area, 40), { x: 0, y: 0, width: 40, height: 40 });
});

test('pxToUnits rechnet mit der Breite der Fläche', () => {
  assert.equal(pxToUnits(300, 1200, 600), 600);
  assert.equal(pxToUnits(-50, 1200, 1200), -50);
  assert.equal(pxToUnits(10, 1200, 0), 0, 'ohne Breite kein NaN/Infinity');
});

test('rotateBy normalisiert auf 0–359', () => {
  assert.equal(rotateBy(0, 15), 15);
  assert.equal(rotateBy(350, 15), 5);
  assert.equal(rotateBy(0, -15), 345);
  assert.equal(rotateBy(90, 270), 0);
  assert.equal(rotateBy(10, -730), 0);
});

test('toPercent liefert gerundete Prozentwerte', () => {
  assert.equal(toPercent(600, 1200), '50%');
  assert.equal(toPercent(20, 1200), '1.6667%');
  assert.equal(toPercent(5, 0), '0%');
});

test('moveRect verschiebt, rastet ein und begrenzt', () => {
  const rect = { x: 100, y: 100, width: 80, height: 80 };
  assert.deepEqual(moveRect(rect, 27, -13, area, 20), { x: 120, y: 80, width: 80, height: 80 });
  assert.deepEqual(moveRect(rect, 27, -13, area, 0), { x: 127, y: 87, width: 80, height: 80 });
  assert.deepEqual(moveRect(rect, 5000, 5000, area, 20), { x: 1120, y: 720, width: 80, height: 80 });
  assert.deepEqual(moveRect(rect, -5000, 0, area, 20), { x: 0, y: 100, width: 80, height: 80 });
});

test('resizeRect hält Mindestgröße und Flächenrand ein', () => {
  const rect = { x: 1000, y: 600, width: 80, height: 80 };
  assert.equal(FLOOR_MIN_SIZE, 40);
  assert.deepEqual(resizeRect(rect, 31, 9, area, 20), { x: 1000, y: 600, width: 120, height: 80 });
  assert.deepEqual(resizeRect(rect, -200, -200, area, 20), { x: 1000, y: 600, width: 40, height: 40 });
  assert.deepEqual(resizeRect(rect, 900, 900, area, 20), { x: 1000, y: 600, width: 200, height: 200 });
});

/* ---------- 0.6.0: Linien und Polygone ---------- */

const square = [
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 300, y: 300 },
  { x: 100, y: 300 },
];
// L-förmiger Raum (Ecke oben rechts fehlt)
const ell = [
  { x: 0, y: 0 },
  { x: 600, y: 0 },
  { x: 600, y: 400 },
  { x: 1200, y: 400 },
  { x: 1200, y: 800 },
  { x: 0, y: 800 },
];

test('pointInPolygon: innen, außen, Rand, konkav', () => {
  assert.equal(pointInPolygon({ x: 200, y: 200 }, square), true);
  assert.equal(pointInPolygon({ x: 50, y: 200 }, square), false);
  assert.equal(pointInPolygon({ x: 100, y: 200 }, square), true, 'Kante zählt als innen');
  assert.equal(pointInPolygon({ x: 300, y: 300 }, square), true, 'Ecke zählt als innen');
  assert.equal(pointInPolygon({ x: 900, y: 200 }, ell), false, 'fehlende Ecke des L');
  assert.equal(pointInPolygon({ x: 900, y: 600 }, ell), true);
  assert.equal(pointInPolygon({ x: 1, y: 1 }, [{ x: 0, y: 0 }, { x: 5, y: 5 }]), false, 'zwei Punkte sind keine Fläche');
});

test('polygonArea und polygonCentroid', () => {
  assert.equal(Math.abs(polygonArea(square)), 40000);
  assert.deepEqual(polygonCentroid(square), { x: 200, y: 200 });
  const flat = polygonCentroid([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 }]);
  assert.deepEqual(flat, { x: 10, y: 0 }, 'entartet: Mittelwert');
});

test('snapPoint: Raster ohne Vorgänger, ganzzahlig, in der Fläche', () => {
  assert.deepEqual(snapPoint({ x: 33, y: 47 }, area, 20), { x: 40, y: 40 });
  assert.deepEqual(snapPoint({ x: 33.4, y: 47.6 }, area, 0), { x: 33, y: 48 });
  assert.deepEqual(snapPoint({ x: -40, y: 900 }, area, 20), { x: 0, y: 800 });
  assert.deepEqual(snapPoint({ x: 1195, y: 5 }, { width: 1190, height: 800 }, 20), { x: 1190, y: 0 }, 'Raster über den Rand hinaus wird begrenzt');
});

test('snapPoint: 0/90° halten die andere Koordinate des Vorgängers', () => {
  const prev = { x: 100, y: 100 };
  assert.deepEqual(snapPoint({ x: 333, y: 112 }, area, 20, prev), { x: 340, y: 100 }, 'fast waagerecht');
  assert.deepEqual(snapPoint({ x: 88, y: 455 }, area, 20, prev), { x: 100, y: 460 }, 'fast senkrecht');
  assert.deepEqual(snapPoint({ x: 0, y: 105 }, area, 20, prev), { x: 0, y: 100 }, 'nach links');
});

test('snapPoint: 45° mit gleich langen Schritten', () => {
  const prev = { x: 100, y: 100 };
  assert.deepEqual(snapPoint({ x: 205, y: 195 }, area, 20, prev), { x: 200, y: 200 });
  assert.deepEqual(snapPoint({ x: 0, y: 3 }, area, 20, { x: 100, y: 100 }), { x: 0, y: 0 }, 'nach links oben');
  // Begrenzung: die Diagonale endet am Rand, bleibt aber 45°
  assert.deepEqual(snapPoint({ x: 1300, y: 900 }, area, 20, { x: 1100, y: 700 }), { x: 1200, y: 800 });
});

test('snapPoint: abseits der Winkel nur Raster', () => {
  assert.deepEqual(snapPoint({ x: 300, y: 185 }, area, 20, { x: 100, y: 100 }), { x: 300, y: 180 });
});

test('rectOutline und isRectOutline', () => {
  assert.deepEqual(rectOutline(area), [{ x: 0, y: 0 }, { x: 1200, y: 0 }, { x: 1200, y: 800 }, { x: 0, y: 800 }]);
  assert.equal(isRectOutline(null, area), true);
  assert.equal(isRectOutline([{ x: 1200, y: 800 }, { x: 0, y: 800 }, { x: 0, y: 0 }, { x: 1200, y: 0 }], area), true);
  assert.equal(isRectOutline(ell, area), false);
});

test('movePoints: Versatz rastet ein und bleibt in der Fläche', () => {
  assert.deepEqual(movePoints(square, 27, -13, area, 20), square.map((p) => ({ x: p.x + 20, y: p.y - 20 })));
  const moved = movePoints(square, -5000, 5000, area, 20);
  assert.deepEqual(moved[0], { x: 0, y: 600 });
  assert.deepEqual(moved[2], { x: 200, y: 800 });
});

test('insertPoint/removePoint mit Grenzen', () => {
  assert.deepEqual(insertPoint(square, 0, { x: 200, y: 100 })[1], { x: 200, y: 100 });
  const full = Array.from({ length: FLOOR_MAX_POINTS }, (_, i) => ({ x: i, y: 0 }));
  assert.equal(insertPoint(full, 3, { x: 1, y: 1 }), null);
  assert.equal(removePoint(square, 1, 3).length, 3);
  assert.equal(removePoint(square.slice(0, 3), 1, 3), null, 'Polygon braucht 3 Punkte');
  assert.equal(removePoint([{ x: 0, y: 0 }, { x: 1, y: 1 }], 0, 2), null, 'Linie braucht 2 Punkte');
});

test('edgeMidpoints: offen und geschlossen', () => {
  assert.equal(edgeMidpoints(square, true).length, 4);
  assert.equal(edgeMidpoints(square, false).length, 3);
  assert.deepEqual(edgeMidpoints(square, true)[3], { after: 3, point: { x: 100, y: 200 } });
});

test('pointsAttr', () => {
  assert.equal(pointsAttr([{ x: 1, y: 2 }, { x: 3, y: 4 }]), '1,2 3,4');
});

test('tableIssue: außerhalb des Umrisses, in gesperrter Zone, sonst null', () => {
  const t = (x, y, rotation = 0) => ({ x, y, width: 80, height: 80, rotation });
  assert.equal(tableIssue(t(100, 100), ell), null);
  assert.equal(tableIssue(t(900, 100), ell), 'outside');
  assert.equal(tableIssue(t(560, 300), ell), 'outside', 'eine Ecke ragt hinaus');
  assert.equal(tableIssue(t(520, 0), ell), null, 'Kante ist noch innen');
  assert.equal(tableIssue(t(100, 100), null, [square]), 'blocked');
  assert.equal(tableIssue(t(400, 400), null, [square]), null);
  assert.equal(tableIssue(t(900, 100), null, []), null, 'ohne Umriss gilt die ganze Fläche');
  // gedreht: 45° lässt die Ecken über den Rand ragen
  assert.equal(tableIssue(t(520, 0, 45), ell), 'outside');
});
