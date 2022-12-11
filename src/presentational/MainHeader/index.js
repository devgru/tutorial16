import React from 'react';

import './index.css';

export default ({ children }) => {
  const parts = window.location.hash.split('#');
  const page = parts[1];

  return <h1 className="Header" />;
};
