import { rgb } from 'd3-color';

export const SET_COLOR = 'wipPalette/SET_COLOR';

const initialState = {
  colors: Array(16).fill(undefined),
  refernceLightness: 0.5,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_COLOR:
      return {
        ...state,
        colors: state.colors.map((oldColor, j) => {
          if (j !== action.index) {
            return oldColor;
          }
          return rgb(action.color).hex();
        }),
      };

    default:
      return state;
  }
};

export const setColor = (index, color) => dispatch => {
  dispatch({
    type: SET_COLOR,
    index,
    color,
  });
};
