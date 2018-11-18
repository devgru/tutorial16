import { rgb } from 'd3-color';

const cache = new Map();

export default function rgbCached(color) {
  const key = Object.values(color).join('-');

  let result = cache.get(key);
  if (!result) {
    const { r, g, b } = rgb(color);
    const result1 = [r, g, b];
    cache.set(key, result1);
    result = result1;
  }

  return result;
}
