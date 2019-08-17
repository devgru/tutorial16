import { range } from 'd3-array';
import { rgb } from 'd3-color';

export const PALETTE_LOADING_STARTED = 'currentPalette/PALETTE_LOADING_STARTED';
export const PALETTE_LOADED = 'currentPalette/PALETTE_LOADED';
export const SET_COLOR = 'currentPalette/SET_COLOR';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_COLOR:
      return {
        ...state,
        slots: state.slots.map((slot, i) => {
          if (i !== action.index[0]) {
            return slot;
          }

          return {
            ...slot,
            colors: slot.colors.map((oldColor, j) => {
              if (j !== action.index[1]) {
                return oldColor;
              }
              return rgb(action.color).hex();
            }),
          };
        }),
      };

    case PALETTE_LOADING_STARTED:
      return {};

    case PALETTE_LOADED:
      const { name, slots } = action;

      return {
        ...state,
        name,
        slots,
      };

    default:
      return state;
  }
};

const BACKGROUND_COLORS_COUNT = 4;
const FOREGROUND_COLORS_COUNT = 4;
const BASE_COLORS_COUNT = BACKGROUND_COLORS_COUNT + FOREGROUND_COLORS_COUNT;
const ACCENT_COLORS_COUNT = 8;
const ALL_COLORS_COUNT = BASE_COLORS_COUNT + ACCENT_COLORS_COUNT;

export const group16ColorsToSlots = all => {
  const bg = all.slice(0, BACKGROUND_COLORS_COUNT);
  const fg = all.slice(BACKGROUND_COLORS_COUNT, BASE_COLORS_COUNT);
  const accents = all.slice(BASE_COLORS_COUNT, ALL_COLORS_COUNT);

  const slots = [];

  slots.push({
    role: 'background',
    colors: bg,
  });

  slots.push({
    role: 'foreground',
    colors: fg,
  });

  accents.forEach(a =>
    slots.push({
      role: 'accent',
      colors: [a],
    })
  );

  return slots;
};

export const extractColorsFromPalette = palette =>
  range(0, ALL_COLORS_COUNT).map(
    n => '#' + palette['base0' + n.toString(16).toUpperCase()]
  );

export const loadBase16Palette = paletteKey => async (dispatch, getState) => {
  dispatch({
    type: PALETTE_LOADING_STARTED,
  });
  const name = paletteKey;

  const palette = getState().paletteList.palettes[paletteKey];
  if (!palette) return;

  const all = extractColorsFromPalette(palette);
  const slots = group16ColorsToSlots(all);

  dispatch({
    type: PALETTE_LOADED,
    name,
    slots,
  });
};

export const setColor = (index, color) => dispatch => {
  dispatch({
    type: SET_COLOR,
    index,
    color,
  });
};
