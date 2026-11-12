import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hexToRgb,
  hsvToRgb,
  mixColors,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
  toHex,
} from '../color-utils.js';

const closeTo = (actual, expected, tolerance = 0.01) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);
};

test('converts RGB channels to uppercase hexadecimal', () => {
  assert.equal(toHex(0), '00');
  assert.equal(toHex(110), '6E');
  assert.equal(toHex(255), 'FF');
});

test('converts a six-digit HEX value to RGB', () => {
  assert.deepEqual(hexToRgb('#6E4CFF'), [110, 76, 255]);
  assert.deepEqual(hexToRgb('#000000'), [0, 0, 0]);
  assert.deepEqual(hexToRgb('#FFFFFF'), [255, 255, 255]);
});

test('converts RGB to HSL', () => {
  const [hue, saturation, lightness] = rgbToHsl([255, 0, 0]);
  closeTo(hue, 0);
  closeTo(saturation, 1);
  closeTo(lightness, 0.5);
});

test('converts RGB to HSV and back without losing channels', () => {
  const rgb = [110, 76, 255];
  const hsv = rgbToHsv(rgb);
  assert.deepEqual(hsvToRgb(hsv), rgb);
});

test('converts black and white to expected OKLCH lightness', () => {
  closeTo(rgbToOklch([0, 0, 0])[0], 0);
  closeTo(rgbToOklch([255, 255, 255])[0], 1);
  closeTo(rgbToOklch([0, 0, 0])[1], 0);
  closeTo(rgbToOklch([255, 255, 255])[1], 0);
});

test('mixes two RGB colors by a ratio', () => {
  assert.deepEqual(mixColors([0, 0, 0], [255, 255, 255], 0.5), [127.5, 127.5, 127.5]);
});
