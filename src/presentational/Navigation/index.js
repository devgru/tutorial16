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
        Модели
      </NavigationItem>
      <NavigationItem activePage={activePage} page="/color-schemes">
        Схемы
      </NavigationItem>
      <NavigationItem activePage={activePage} page="/create-scheme">
        Создание схемы
      </NavigationItem>
    </ul>
  );
};
