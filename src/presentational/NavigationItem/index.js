import React from 'react';

import './index.css';

export default ({ disabled, page, children, activePage }) => {
  const isActive = activePage === page;
  const className = [
    `Navigation-item`,
    `${disabled ? 'disabled' : ''}`,
    `${isActive ? 'active' : ''}`,
  ].join(' ');
  return (
    <li className={className}>
      {isActive || disabled ? (
        <span>{children}</span>
      ) : (
        <a href={`#${page}`}>{children}</a>
      )}
    </li>
  );
};
