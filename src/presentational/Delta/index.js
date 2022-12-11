import React from 'react';

import InlineChip from '../InlineChip';
import delta from '../../utils/delta';

import './index.css';

export default ({ c1, c2 }) => (
  <span className="Delta">
    ΔE(
    <InlineChip color={c1} />, <InlineChip color={c2} />) ={' '}
    {Math.round(delta(c1, c2))}
  </span>
);
