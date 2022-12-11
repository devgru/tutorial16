import { Vector3 } from 'three';
import { rgb } from 'd3-color';

function rgbTransform(x) {
  return 0.466 * x - 59.5;
}
export default function colorToRgbPoint(color) {
  const { r, g, b } = rgb(color);
  return new Vector3(rgbTransform(r), rgbTransform(g), rgbTransform(b));
}
