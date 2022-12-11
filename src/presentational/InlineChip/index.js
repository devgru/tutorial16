import React from 'react';
import Chip from '../Chip';
import './index.css';

const InlineChip = ({ color }, { base }) => {
  return (
    <span
      className="InlineChip"
      style={{
        background: color,
      }}
      tabIndex="0"
    >
      {JSON.stringify(base)}
      <span className="InlineChip-hover">
        <Chip color={color} />
      </span>
    </span>
  );
};

export default InlineChip;
