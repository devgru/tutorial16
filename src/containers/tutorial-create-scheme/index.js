import React from 'react';
import PropTypes from 'prop-types';
import TutorialContainer from '../tutorial-container';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import { scaleLinear } from 'd3-scale';
import { range } from 'd3-array';
import { interpolateHcl } from 'd3-interpolate';

import { loadBase16Palette, setColor } from '../../modules/currentPalette';
import generateAccents from '../../utils/generateAccents';

import Swatch from '../../presentational/Swatch';
import GithubCorner from '../../presentational/GithubCorner';
import Header from '../../presentational/TutorialHeader';
import InversePage from '../../presentational/InversePage';
import SchemeTable from '../../presentational/SchemeTable';
import Picker from '../../presentational/Picker';
import ColorSpace from '../../presentational/ColorSpace';
import Matrix from '../../presentational/Matrix';

import '../tutorial/index.css';
import delta from '../../utils/delta';

const deltaE = (fg, bg) => Math.round(delta(fg, bg));

class TutorialCreateScheme extends TutorialContainer {
  constructor(props) {
    super(props);
    props.loadBase16Palette('solarized-light');

    this.state = {
      currentColor: null,
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
      this.props.setColor(index, color);
    };

    const editColor = indices => () => {
      this.setState({
        currentColor: indices,
      });
    };

    const colorPicker = indices => {
      const color = currentPalette.slots[indices[0]].colors[indices[1]];
      return (
        <div>
          <Swatch color={color} onClick={editColor(indices)} />
          {isEqual(indices, this.state.currentColor) && (
            <Picker
              color={color}
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
        <GithubCorner />
        <div className="Tutorial-page">
          <div className="Tutorial-text">
            <Header hash="start">Выбор основы</Header>
            <p>
              Выберите заготовку — одну из существующих схем. Это позволит не
              создавать палитру с нуля, а начать с уже работающего сочетания
              цветов и менять цвет за цветом на свой вкус. Если хотите дать
              полёт фантазии — берите одну из схем tutorial, это максимально
              контрастные и простые схемы.
            </p>
          </div>
        </div>
        <div className="Tutorial-page">
          <div className="Tutorial-text">
            <SchemeTable
              schemes={selectedPalettes}
              onLoadScheme={loadBase16Palette}
            />
          </div>
        </div>
        <InversePage>
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
            {colorPicker([1, 3])}
            <p>Давайте посмотрим на промежуточные цвета.</p>
            {interpolatedBase.map(c => (
              <Swatch key={c} color={c} />
            ))}
            <ColorSpace
              width={600}
              height={400}
              colors={interpolatedBase}
              background={base[7]}
              controlsOptions={{
                enableKeys: false,
                enableZoom: false,
              }}
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
              controlsOptions={{
                enableKeys: false,
                enableZoom: false,
              }}
            />
            <ColorSpace
              width={600}
              height={400}
              colors={all}
              background={base[7]}
              controlsOptions={{
                enableKeys: false,
                enableZoom: false,
              }}
            />
            <br />
            <br />
            <br />
            <br />
          </div>
        </InversePage>
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
