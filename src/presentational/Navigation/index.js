import React from 'react';

import './index.css';

export default () => (
  <ul className="Navigation">
    <li className="Navigation-item">
      <a href="#/">Стартовая</a>
    </li>
    <li className="Navigation-item inactive">
      <a>Математика RGB</a>
    </li>
    <li className="Navigation-item">
      <a href="#/color-spaces">Цветовые модели</a>
    </li>
    <li className="Navigation-item">
      <a href="#/color-schemes">Цветовые схемы</a>
    </li>
    <li className="Navigation-item inactive">
      <a>Создание схемы</a>
    </li>
  </ul>
);
