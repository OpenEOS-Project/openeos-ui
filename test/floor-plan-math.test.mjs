// Reine Rechenfunktionen des Tischplans, geprüft gegen den Build (dist).
//   pnpm build && node --test test/floor-plan-math.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  FLOOR_MIN_SIZE,
  clampToArea,
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
