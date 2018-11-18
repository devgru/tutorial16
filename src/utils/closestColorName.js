import closestColor from 'closest-color/src/match.js';

const cache = {};
export default function closestColorName({ r, g, b }) {
  const name = `${r}-${g}-${b}`;
  if (!cache[name]) {
    cache[name] = closestColor({ R: r, G: g, B: b }).name;
  }
  return cache[name];
}
