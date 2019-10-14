import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createHashHistory';
import rootReducer from './modules';

import throttle from 'lodash.throttle';

const STATE_KEY = 'state';
export const loadState = defaultState => {
  try {
    const serializedState = localStorage.getItem(STATE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return defaultState;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);

    localStorage.setItem(STATE_KEY, serializedState);
  } catch (e) {
    // ignore write errors
  }
};

export const history = createHistory();

const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const persistedState = loadState({});
console.log('STATE', persistedState);

const store = createStore(rootReducer, persistedState, composedEnhancers);
store.subscribe(
  throttle(() => {
    saveState({
      wipPalette: store.getState().wipPalette,
    });
  }, 1000)
);

export default store;
