import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import currentPalette from './currentPalette';
import paletteList from './paletteList';
import wipPalette from './wipPalette';

export default combineReducers({
  router: routerReducer,
  currentPalette,
  paletteList,
  wipPalette,
});
