import { Vector3 } from 'three';
import { svd } from 'numeric';
import { lab } from 'd3-color';
import labCached from './lab';
import colorToLabPoint from './colorToLabPoint';
import meanObject from './meanObject';
import meanArray from './meanArray';

export default function fitPlane(accents) {
  if (!accents) {
    return;
  }

  const labs = accents.map(labCached);
  const color = lab(...meanArray(labs));

  const colorPoints = accents.map(colorToLabPoint);
  const centroidObject = meanObject(['x', 'y', 'z'], colorPoints);
  const centroid = new Vector3(
    centroidObject.x,
    centroidObject.y,
    centroidObject.z
  );
  const relativePoints = colorPoints.map(({ x, y, z }) => [
    x - centroid.x,
    y - centroid.y,
    z - centroid.z,
  ]);

  // using SVD is suggested here https://math.stackexchange.com/a/99317
  // they suggest using 3 × N matrix, but numeric library supports only N × 3
  // so instead of U (left singular vector) we refer to V (right one)
  const { V } = svd(relativePoints);
  const thirdColumn = ([_a, _b, c]) => c;
  const normal = new Vector3(...V.map(thirdColumn));

  return {
    centroid,
    normal,
    color,
  };
}
