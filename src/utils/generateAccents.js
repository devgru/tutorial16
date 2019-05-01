import { lab, hcl } from 'd3-color';
import { range, sum, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';
import delta from './delta';

export default function generateAccents(base) {
  const baseScale = scaleLinear()
    .range([base[0], base[7]])
    .interpolate(interpolateHcl);

  const midColor = baseScale(0.5);
  const { l, a, b } = lab(midColor);

  const sin = h => Math.sin((h * Math.PI) / 180);
  const cos = h => Math.cos((h * Math.PI) / 180);

  const hues = [25, 45, 70, 120, 160, 200, 270, 340];
  let bestAccents = [];
  let bestAccentsRank = -Infinity;

  const edgeDelta = a => Math.min(delta(a, base[0]), delta(a, base[7]));
  const getAccentsRank = accents =>
    min(accents, edgeDelta) > 35 ? sum(accents, edgeDelta) : 0;
  const hueDiff = s => h =>
    Math.min(Math.abs(h - s), Math.abs(h - s - 360), Math.abs(h - s + 360));

  range(0.1, 1.01, 0.2).forEach(hueDiffImpact => {
    range(0, 360.0001, 10).forEach(lH => {
      range(10, 100, 2).some(r => {
        const newAccents = hues.map(h =>
          lab(
            l + (hueDiff(lH)(h) - 90) * hueDiffImpact,
            a + r * cos(h),
            b + r * sin(h)
          )
        );

        const goodAccents = newAccents.every(c => c.displayable());
        if (goodAccents) {
          const rank = getAccentsRank(newAccents);
          if (rank > bestAccentsRank) {
            bestAccents = newAccents;
            bestAccentsRank = rank;
          }
        }
        return !goodAccents;
      });
    });
  });
  console.log(bestAccentsRank);

  return bestAccents;
}
