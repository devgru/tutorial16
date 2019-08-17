import { lab as colorLab } from 'd3-color';

const linear = (a, d) => t => a + t * d;
const constant = x => () => x;

function color(a, b) {
  const d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}

export default function lab(start, end) {
  const l = color((start = colorLab(start)).l, (end = colorLab(end)).l);
  const a = color(start.a, end.a);
  const b = color(start.b, end.b);
  const opacity = color(start.opacity, end.opacity);
  return function(t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start.copy();
  };
}
