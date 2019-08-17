import { hcl as colorHcl } from 'd3-color';

const linear = (a, d) => t => a + t * d;
const constant = x => () => x;

function hue(a, b) {
  const d = b - a;
  return d
    ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d)
    : constant(isNaN(a) ? b : a);
}

function color(a, b) {
  const d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}

export default function hcl(start, end) {
  const h = hue((start = colorHcl(start)).h, (end = colorHcl(end)).h);
  const c = color(start.c, end.c);
  const l = color(start.l, end.l);
  const opacity = color(start.opacity, end.opacity);
  return function(t) {
    start.h = h(t);
    start.c = c(t);
    start.l = l(t);
    start.opacity = opacity(t);
    return start.copy();
  };
}
