import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProgress, tabDestination } from '../src/domain/interaction.ts';
test('progress clamps negative and over-completion values', () => {
  assert.deepEqual(normalizeProgress(-3, 40), { value: 0, max: 40, percent: 0 });
  assert.deepEqual(normalizeProgress(90, 40), { value: 40, max: 40, percent: 100 });
  assert.deepEqual(normalizeProgress(1, 3), { value: 1, max: 3, percent: 33 });
});
test('invalid numbers cannot leak into native progress attributes', () => {
  for (const invalid of [0, -1, NaN, Infinity, -Infinity])
    assert.deepEqual(normalizeProgress(30, invalid), { value: 30, max: 100, percent: 30 });
  for (const invalid of [NaN, Infinity, -Infinity])
    assert.deepEqual(normalizeProgress(invalid, 60), { value: 0, max: 60, percent: 0 });
});
test('tab navigation wraps, supports boundaries and ignores editing keys', () => {
  assert.equal(tabDestination('ArrowRight', 2, 3), 0);
  assert.equal(tabDestination('ArrowLeft', 0, 3), 2);
  assert.equal(tabDestination('Home', 2, 3), 0);
  assert.equal(tabDestination('End', 0, 3), 2);
  assert.equal(tabDestination('Tab', 1, 3), null);
  assert.equal(tabDestination('Enter', 1, 3), null);
  assert.equal(tabDestination('ArrowLeft', 0, 1), 0);
  assert.equal(tabDestination('End', 0, 0), null);
});
