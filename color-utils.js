export const toHex = (value) => Math.round(value).toString(16).padStart(2, '0').toUpperCase();

export const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export const mixColors = (base, target, amount) => base.map((value, index) => value + (target[index] - value) * amount);

export const rgbToHsv = ([red, green, blue]) => {
  const values = [red, green, blue].map((value) => value / 255);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const delta = max - min;
  let hue = 0;

  if (delta) {
    if (max === values[0]) hue = 60 * (((values[1] - values[2]) / delta) % 6);
    if (max === values[1]) hue = 60 * ((values[2] - values[0]) / delta + 2);
    if (max === values[2]) hue = 60 * ((values[0] - values[1]) / delta + 4);
  }

  return [(hue + 360) % 360, max ? delta / max : 0, max];
};

export const hsvToRgb = ([hue, saturation, value]) => {
  const chroma = value * saturation;
  const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
  const match = value - chroma;
  const sectors = hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x] : hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
  return sectors.map((channel) => Math.round((channel + match) * 255));
};

export const rgbToHsl = (rgb) => {
  const [red, green, blue] = rgb.map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  const hue = rgbToHsv(rgb)[0];
  return [hue, saturation, lightness];
};

const srgbToLinear = (channel) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

export const rgbToOklch = (rgb) => {
  const [red, green, blue] = rgb.map(srgbToLinear);
  const l = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue;
  const m = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue;
  const s = 0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);
  const lightness = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const b = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
  const chroma = Math.sqrt(a ** 2 + b ** 2);
  const hue = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
  return [lightness, chroma, hue];
};
