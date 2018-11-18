import React from 'react';

import './index.css';

import { range } from 'd3-array';
import { alea } from 'seedrandom';

const accents = range(8, 16).map(r => `base0${r.toString(16).toUpperCase()}`);

export default ({ id, scheme, onLoadScheme }) => {
  const random = alea(id);
  const int = (from, to) => Math.round(random() * (to - from)) + from;
  return (
    <div
      className="SchemeBlock"
      style={{
        background: '#' + scheme.base00,
        color: '#' + scheme.base07,
      }}
      onClick={() => onLoadScheme(id)}
    >
      {id}
      <div className="SchemeBlockPoints">
        {accents.map((accent, i) => (
          <div
            className="SchemeBlockPoint"
            key={accent}
            style={{
              background: '#' + scheme[accent],
              left: `${i * 15 + int(8, 15)}px`,
              bottom: `${int(3, 6)}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
