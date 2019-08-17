import { scaleLinear } from 'd3-scale';
import delta from './delta';
import interpolateLabObject from './interpolateLabObject';

const FIND_EPSILON = 1 / 1024;
const EPSILON = 1 / 16;
const MIN_DELTA = 1;

const bisectFind = (scale, searchValue, l, r) => {
  const diff = r - l;
  if (diff <= FIND_EPSILON) {
    console.log('EPSILON REACHED');
    return l;
  }

  const mid = (l + r) / 2;
  const lColor = scale(l);
  const rColor = scale(r);
  const lDelta = delta(searchValue, lColor);
  const rDelta = delta(searchValue, rColor);
  if (lDelta < rDelta) {
    if (lDelta < MIN_DELTA) {
      return l;
    }
    return bisectFind(scale, searchValue, l, mid);
  }
  if (rDelta < MIN_DELTA) {
    return r;
  }
  return bisectFind(scale, searchValue, mid, r);
};

const bisect = (scale, init, step) => {
  const color = scale(init + step);
  if (color.displayable()) {
    if (step <= EPSILON) {
      return color.hex();
    }
    return bisect(scale, init + step, step / 2);
  } else {
    return bisect(scale, init, step / 2);
  }
};

const findOpposite = (currentColor, midColor = '#808080') => {
  const scale = scaleLinear()
    .range([currentColor, midColor])
    .interpolate(interpolateLabObject);

  const currentColorEdge = bisect(scale, 1, +16);
  const oppositeColorEdge = bisect(scale, 1, -16);

  const edgeScale = scaleLinear()
    .range([currentColorEdge, midColor, oppositeColorEdge])
    .interpolate(interpolateLabObject);
  const colorPosition = bisectFind(edgeScale, currentColor, 1, 2);
  return edgeScale(2 - colorPosition);
};

export default findOpposite;
