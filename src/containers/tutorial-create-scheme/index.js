import React from 'react';
import PropTypes from 'prop-types';
import TutorialContainer from '../tutorial-container';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';

import { loadBase16Palette, setColor } from '../../modules/currentPalette';
import generateAccents from '../../utils/generateAccents';

import Swatch from '../../presentational/Swatch';
import GithubCorner from '../../presentational/GithubCorner';
import Header from '../../presentational/Header';
import Page from '../../presentational/Page';
import SchemeTable from '../../presentational/SchemeTable';
import Picker from '../../presentational/Picker';
import ColorSpace from '../../presentational/ColorSpace';
import Matrix from '../../presentational/Matrix';
import Favicon from '../../presentational/Favicon';
import Navigation from '../../presentational/Navigation';

import '../tutorial/index.css';
import delta from '../../utils/delta';

const deltaE = (fg, bg) => Math.round(delta(fg, bg));

class TutorialCreateScheme extends TutorialContainer {
  constructor(props) {
    super(props);

    this.state = {
      currentColor: null,
      overriddenForeground: null,
      overriddenSteps: null,
    };
  }

  render() {
    const {
      base,
      all,
      palettes,
      loadBase16Palette,
      currentPalette,
    } = this.props;
    if (!base) {
      return null;
    }

    const baseScale = scaleLinear()
      .range([base[0], base[7]])
      .interpolate(interpolateHcl);

    const vs = [0, 0.07, 0.41, 0.47, 0.53, 0.59, 0.93, 1];
    // const vs = range(0, 1, 0.1);
    const interpolatedBase = vs.map(baseScale);
    interpolatedBase.forEach(z => {
      console.log(`%c ${z}`, `background: ${z}`);
    });

    const suggestedAccents = generateAccents(base);

    const selectedPalettes = [
      'solarized-light',
      'solarized-dark',
      'tutorial-light',
      'tutorial-dark',

      'summerfruit-dark',
      'summerfruit-light',
      'solarflare',
      'dracula',

      'atelier-cave',
      'atelier-cave-light',
      'atelier-forest',
      'atelier-forest-light',

      'atelier-heath-light',
      'atelier-heath',
      'atelier-estuary-light',
      'atelier-estuary',

      'atelier-lakeside',
      'atelier-lakeside-light',
      'atelier-seaside',
      'atelier-seaside-light',

      'atelier-dune-light',
      'atelier-dune',
      'atelier-savanna-light',
      'atelier-savanna',
    ].reduce(
      (hash, key) => ({
        ...hash,
        [key]: palettes[key],
      }),
      {}
    );

    const colorPicked = index => color => {
      if (isEqual(index, [1, 3])) {
        this.setState({
          overriddenForeground: true,
        });
      }
      this.props.setColor(index, color);
    };

    const editColor = indices => () => {
      this.setState({
        currentColor: indices,
      });
    };

    const colorPicker = (indices, avoidIndices) => {
      const { slots } = currentPalette;
      const color = slots[indices[0]].colors[indices[1]];
      const avoidColor =
        avoidIndices && slots[avoidIndices[0]].colors[avoidIndices[1]];
      return (
        <div>
          <Swatch color={color} onClick={editColor(indices)} />
          {isEqual(indices, this.state.currentColor) && (
            <Picker
              color={color}
              avoidColor={avoidColor}
              avoidDelta={50}
              onColorPicked={colorPicked(indices)}
              onClose={editColor(null)}
            />
          )}
        </div>
      );
    };

    const allColors = interpolatedBase.concat(suggestedAccents);
    return (
      <div className="Tutorial">
        <Favicon />
        <GithubCorner />
        <Page>
          <div className="Tutorial-text">
            <h1>Создание цветовой схемы</h1>
            <p>
              <a href="https://devg.ru">Дима Семьюшкин</a>,
              2018&thinsp;–&thinsp;2019, лицензия MIT
            </p>
          </div>
          <Navigation />
        </Page>
        <Page>
          <div className="Tutorial-text">
            <Header hash="select-base-colors">
              Выбор цветов основной последовательности
            </Header>
            <p>
              Начнём с основного цвета фона. Клик на плашку ведёт на выбор
              цвета.
            </p>
            {colorPicker([0, 0])}
            <p>Теперь цвет текста.</p>
            {colorPicker([1, 3], [0, 0])}
            <p>Давайте посмотрим на промежуточные цвета.</p>
            {interpolatedBase.map(c => (
              <Swatch key={c} color={c} />
            ))}
            <ColorSpace
              width={600}
              height={400}
              colors={interpolatedBase}
              background={base[7]}
            />
            {/*<Matrix colors={base} fn={deltaE} />*/}
            <Matrix colors={allColors} fn={deltaE} />
            <br />
            <p>И на акценты</p>
            {suggestedAccents.map(c => (
              <Swatch key={c} color={c} />
            ))}
            <ColorSpace
              width={600}
              height={400}
              colors={allColors}
              background={base[7]}
            />
            <ColorSpace
              width={600}
              height={400}
              colors={all}
              background={base[7]}
            />
            <br />
            <br />
            <br />
            <br />
          </div>
        </Page>
      </div>
    );
  }
}

TutorialCreateScheme.propTypes = {
  all: PropTypes.arrayOf(PropTypes.string),
  currentPalette: PropTypes.shape({
    palette: PropTypes.shape({
      base: PropTypes.arrayOf(PropTypes.string),
      accents: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

const mapStateToProps = ({ currentPalette, paletteList }) => {
  const { palettes } = paletteList;
  const base = [];
  const accents = [];
  if (!currentPalette.slots) {
    return {};
  }
  currentPalette.slots.forEach(slot => {
    if (slot.role === 'accent') {
      accents.push(...slot.colors);
    } else {
      base.push(...slot.colors);
    }
  });

  const all = base.concat(accents);

  return {
    currentPalette,
    all,
    accents,
    base,
    palettes,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loadBase16Palette, setColor }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialCreateScheme);
