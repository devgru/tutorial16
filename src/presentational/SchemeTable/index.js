import React from 'react';
import SchemeBlock from '../SchemeBlock';

import './index.css';

export default ({ schemes, onLoadScheme }) => (
  <div className="SchemeTable">
    {Object.keys(schemes).map(key => (
      <SchemeBlock
        key={key}
        id={key}
        scheme={schemes[key]}
        onLoadScheme={onLoadScheme}
      />
    ))}
  </div>
);
