import React from 'react';

import './index.css';

export default ({ children, inverse }) =>
  (inverse && (
    <div>
      <div className="Tutorial-page Tutorial-page_inverse_open" />
      <div className="Tutorial-page Tutorial-page_inverse">{children}</div>
      <div className="Tutorial-page Tutorial-page_inverse_close" />
    </div>
  )) || <div className="Tutorial-page">{children}</div>;
