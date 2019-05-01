import { mean } from 'd3-array';

export default function meanArray(keys, arrays) {
  return (arrays[0] || []).map((e_, index) => mean(arrays, o => o[index]));
}
