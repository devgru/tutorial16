import { getDeltaE00 } from 'delta-e';
import labCached from './lab';

const cache = {};

export default function delta(c1, c2) {
  const k1 = typeof c1 === 'string' ? c1 : c1.hex();
  const k2 = typeof c2 === 'string' ? c2 : c2.hex();
  const key = k1 + k2;
  if (!cache[key]) {
    cache[key] = cache[k2 + k1] = getDeltaE00(toLab(c1), toLab(c2));
  }
  return cache[key];
}

function toLab(color) {
  const [l, a, b] = labCached(color);
  return {
    L: l,
    A: a,
    B: b,
  };
}
