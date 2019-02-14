import React from 'react';

import './index.css';
import NavigationItem from '../NavigationItem';

export default () => {
  const hashParts = window.location.hash.split('#');
  const activePage = hashParts[1];
  return (
    <ul className="Navigation">
      <NavigationItem activePage={activePage} page="/">
        Стартовая
      </NavigationItem>
      {/*<NavigationItem activePage={activePage} page="/math">
        Математика RGB
      </NavigationItem>*/}
      <NavigationItem activePage={activePage} page="/color-spaces">
        Цветовые модели
      </NavigationItem>
      <NavigationItem activePage={activePage} page="/color-schemes">
        Цветовые схемы
      </NavigationItem>
      <NavigationItem activePage={activePage} disabled>
        Создание схемы
      </NavigationItem>
    </ul>
  );
};
