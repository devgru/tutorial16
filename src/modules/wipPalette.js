import { rgb } from 'd3-color';

export const SET_COLOR = 'wipPalette/SET_COLOR';
export const SET_REFERENCE_LIGHTNESS = 'wipPalette/SET_REFERENCE_LIGHTNESS';

const initialState = {
  colors: Array(16).fill(undefined),
  referenceLightness: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_REFERENCE_LIGHTNESS:
      return {
        ...state,
        referenceLightness: action.value,
      };
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

export const setReferenceLightness = value => dispatch => {
  dispatch({
    type: SET_REFERENCE_LIGHTNESS,
    value,
  });
};
