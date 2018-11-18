import React from 'react';
import PropTypes from 'prop-types';
import objectMap from 'object-map';
import { rgb, hcl } from 'd3-color';
import ColorDescriptor from 'color-descriptor';

import closestColorName from '../../utils/closestColorName';

import './index.css';
import farthestOf from '../../utils/farthestOf';

const descriptor = new ColorDescriptor('ru');

const noop = () => {};

const Swatch = ({ color, onClick = noop }, { base }) => {
  const textColors = [base[0], base[base.length - 1]];
  const textColor = farthestOf(color, textColors);
  const rgbColor = rgb(color);
  const { r, g, b } = rgbColor;
  const name = closestColorName(rgbColor);

  const hclColor = objectMap(hcl(color), Math.round);
  if (hclColor.c === 0) hclColor.h = 'any';
  const { h, c, l } = hclColor;
  const description = descriptor.describe(color).join(', ');

  return (
    <span
      onClick={onClick}
      className="Swatch"
      style={{
        background: color,
        color: textColor,
      }}
    >
      <span className="SwatchProperties">{name}</span>
      <span className="SwatchProperties">{description}</span>
      <span className="SwatchProperties">{rgbColor.hex().toUpperCase()}</span>
      <span className="SwatchProperties">
        R: {Math.round(r)}, G: {Math.round(g)}, B: {Math.round(b)}
      </span>
      <span className="SwatchProperties">
        H: {h}, C: {c}, L: {l}
      </span>
    </span>
  );
};

Swatch.contextTypes = {
  base: PropTypes.arrayOf(PropTypes.string),
};

export default Swatch;
