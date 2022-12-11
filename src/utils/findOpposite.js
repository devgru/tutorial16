import { scaleLinear } from 'd3-scale';
import delta from './delta';
import interpolateLabObject from './interpolateLabObject';

const DIFF_EPSILON = 1 / 1024;
const SCALE_EPSILON = 1 / 1024;
const MIN_DELTA = 1;

const bisectFind = (scale, searchValue, l, r) => {
  const diff = r - l;
  if (diff <= DIFF_EPSILON) {
    return l;
  }

  const mid = (l + r) / 2;
  const lDelta = delta(searchValue, scale(l));
  const rDelta = delta(searchValue, scale(r));
  if (lDelta < rDelta) {
    if (lDelta < MIN_DELTA) {
      return l;
    }
    return bisectFind(scale, searchValue, l, mid);
  } else {
    if (rDelta < MIN_DELTA) {
      return r;
    }
    return bisectFind(scale, searchValue, mid, r);
  }
};

const bisectGamutEdge = (scale, init, step) => {
  const color = scale(init + step);
  if (color.displayable()) {
    if (step <= SCALE_EPSILON) {
      return color.hex();
    }
    return bisectGamutEdge(scale, init + step, step * 2);
  } else {
    return bisectGamutEdge(scale, init, step / 2);
  }
};

const findOpposite = (currentColor, midColor = '#808080') => {
  const scale = scaleLinear()
    .range([currentColor, midColor])
    .domain([-1, 1])
    .interpolate(interpolateLabObject);

  const currentColorEdge = bisectGamutEdge(scale, 0, -1);
  const oppositeColorEdge = bisectGamutEdge(scale, 0, +1);

  const edgeScale = scaleLinear()
    .range([currentColorEdge, oppositeColorEdge])
    .domain([-1, 1])
    .interpolate(interpolateLabObject);
  const colorPosition = bisectFind(edgeScale, currentColor, -1, 1);
  return edgeScale(-colorPosition);
};

export default findOpposite;
