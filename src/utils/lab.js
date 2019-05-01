import { lab } from 'd3-color';

const cache = new Map();

export default function labCached(color) {
  const key =
    typeof color === 'string' ? color : Object.values(color).join('-');

  let result = cache.get(key);
  if (!result) {
    const { l, a, b } = lab(color);
    const array = [l, a, b];
    cache.set(key, array);
    result = array;
  }

  return result;
}
