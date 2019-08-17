import React from 'react';
import PropTypes from 'prop-types';
import TutorialContainer from '../tutorial-container';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';
import { range } from 'd3-array';

import { loadBase16Palette } from '../../modules/currentPalette';
import { setColor } from '../../modules/wipPalette';
import generateAccents from '../../utils/generateAccents';
import logColors from '../../utils/logColors';

import Swatch from '../../presentational/Swatch';
import GithubCorner from '../../presentational/GithubCorner';
import Header from '../../presentational/Header';
import Page from '../../presentational/Page';
import Picker from '../../presentational/Picker';
import ColorSpace from '../../presentational/ColorSpace';
import Matrix from '../../presentational/Matrix';
import Favicon from '../../presentational/Favicon';
import Navigation from '../../presentational/Navigation';

import '../tutorial/index.css';
import delta from '../../utils/delta';
import findOpposite from '../../utils/findOpposite';

const deltaE = (fg, bg) => Math.round(delta(fg, bg));

class TutorialCreateScheme extends TutorialContainer {
  constructor(props) {
    super(props);

    this.state = {
      currentColor: null,
    };
  }

  render() {
    const { base, all } = this.props;
    if (!base) {
      return null;
    }

    const baseScale = scaleLinear()
      .range([base[0], base[7]])
      .interpolate(interpolateLab);

    const vs = [0, 0.07, 0.41, 0.47, 0.53, 0.59, 0.93, 1];
    // const vs = range(0, 1, 0.1);
    const interpolatedBase = vs.map(baseScale);

    logColors(...interpolatedBase);
    const suggestedAccents = generateAccents(base);
    logColors(...suggestedAccents);

    const colorPicked = index => color => {
      this.props.setColor(index, color);
    };

    const editColor = indices => () => {
      this.setState({
        currentColor: indices,
      });
    };

    const colorPicker = (index, avoidIndex) => {
      const color = all[index];
      const avoidColor = avoidIndex && all[avoidIndex];
      return (
        <div>
          <Swatch color={color} onClick={editColor(index)} />
          {isEqual(index, this.state.currentColor) && (
            <Picker
              color={color}
              avoidColor={avoidColor}
              avoidDelta={50}
              onColorPicked={colorPicked(index)}
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
            {colorPicker(0)}
            <p>Теперь цвет текста.</p>
            {colorPicker(7, 0)}
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
};

const overrideWithWipPalette = (wipPalette, base, accents) => {
  const wipColors = [...wipPalette.colors];
  if (wipColors[0] === undefined) {
    return;
  }
  base[0] = wipColors[0];
  if (wipColors[7] === undefined) {
    wipColors[7] = findOpposite(wipColors[0]);
  }

  const baseScale = scaleLinear()
    .range([wipColors[0], wipColors[7]])
    .interpolate(interpolateLab);

  range(1, 7).forEach(i => {
    if (wipColors[i] === undefined) {
      wipColors[i] = baseScale(0.25 + Math.random() * 0.5);
    }
  });

  range(8).forEach(i => {
    base[i] = wipColors[i].toString();
    // accents[i] = wipColors[i + 8];
  });
  console.log('OVERRIDEN', base, accents);
};

const mapStateToProps = ({ currentPalette, wipPalette }) => {
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

  overrideWithWipPalette(wipPalette, base, accents);

  const all = base.concat(accents);

  return {
    all,
    accents,
    base,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loadBase16Palette, setColor }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialCreateScheme);
