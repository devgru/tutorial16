import React from 'react';

import './index.css';

export default ({ children, hash }) => {
  const parts = window.location.hash.split('#');
  const page = parts[1];

  if (!hash) {
    return <h2 className="Header">{children}</h2>;
  }

  return (
    <h2 className="Header">
      <a className="Header-hash" href={'#' + page + '#' + hash}>
        #
      </a>
      <a id={hash}>{children}</a>
    </h2>
  );
};
