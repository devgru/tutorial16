import { Vector3 } from 'three';
import colorToRgbPoint from './colorToRgbPoint';

const axisX = new Vector3(1, 0, 0);
const axisY = new Vector3(0, 1, 0);
const axisZ = new Vector3(0, 0, 1);
const angleX = -Math.PI / 4;
const angleY = -Math.PI / 4;
const angleZ = Math.atan(1 / Math.sqrt(2));

export default function colorToRotatedRgbPoint(color) {
  return colorToRgbPoint(color)
    .applyAxisAngle(axisX, angleX)
    .applyAxisAngle(axisZ, angleZ)
    .applyAxisAngle(axisY, angleY);
}
