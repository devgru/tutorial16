import React from 'react';
import PropTypes from 'prop-types';
import TutorialContainer from '../tutorial-container';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';
import { range } from 'd3-array';
import { gray } from 'd3-color';

import { loadBase16Palette } from '../../modules/currentPalette';
import { setColor, setReferenceLightness } from '../../modules/wipPalette';
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
    const {
      base,
      accents,
      all,
      wipPalette,
      setReferenceLightness,
    } = this.props;
    if (!base) {
      return null;
    }

    const { colors, referenceLightness } = wipPalette;

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
          <Swatch interactive color={color} onClick={editColor(index)} />
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
          <div className="Tutorial-text">
            <Header>Работа с редактором</Header>
            <p>
              Создание палитры идёт по шагам. Каждый этап открывает доступ к
              следующему.
            </p>
          </div>
          <div className="Tutorial-text">
            <Header>1. Выбор цвета фона</Header>
            <p>
              Создание палитры можно начать с выбора основного цвета фона. Клик
              на плашку ведёт на выбор цвета.
            </p>
            {colorPicker(0)}
          </div>
          {colors[0] ? (
            <div className="Tutorial-text">
              <Header>2. Общая яркость палитры</Header>
              <p />
              <p>
                Попробуйте поиграть с общей яркостью палитры:{' '}
                <input
                  type="number"
                  min="25"
                  max="75"
                  defaultValue={(referenceLightness || 0.5) * 100}
                  onChange={({ target }) =>
                    setReferenceLightness(target.value / 100)
                  }
                />
                %
              </p>
            </div>
          ) : null}
          {colors[0] && referenceLightness ? (
            <div className="Tutorial-text">
              <Header>3. Основной цвет текста</Header>
              <p>
                Теперь цвет текста. По-умолчанию он выбирается на
                противоположном конце цветового пространства: выбрали тёплый фон
                — текст будет холодного оттенка, фон был ярким — текст будет
                тёмным. Самое время выбрать его на свой вкус:
              </p>
              {colorPicker(7, 0)}
            </div>
          ) : null}
        </Page>
        {colors[7] && referenceLightness ? (
          <Page inverse>
            <div className="Tutorial-text">
              <Header>4. Промежуточные цвета последовательности</Header>
              <p>
                Давайте посмотрим на промежуточные цвета. Они размещены на
                определённом расстоянии между основными цветами фона и текста:
              </p>
              {base.map(c => (
                <Swatch key={c} color={c} />
              ))}
              <ColorSpace
                width={600}
                height={400}
                colors={base}
                background={base[7]}
              />
              <Matrix colors={base} fn={deltaE} />
            </div>
          </Page>
        ) : null}
        {colors[7] && referenceLightness ? (
          <Page>
            <div className="Tutorial-text">
              <Header>5. Акценты</Header>
              <p>
                Последний шаг в создании палитры — выбор акцентов. По умолчанию
                цвета выбираются так, чтобы «окружить» линию основной
                последовательности
              </p>
              {accents.map(c => (
                <Swatch key={c} color={c} />
              ))}
              <ColorSpace
                width={600}
                height={400}
                colors={all}
                background={base[7]}
              />
              <ColorSpace
                width={600}
                height={400}
                colors={all}
                background={base[7]}
              />
              <Matrix colors={all} fn={deltaE} />
              <br />
              <br />
            </div>
          </Page>
        ) : null}
      </div>
    );
  }
}

TutorialCreateScheme.propTypes = {
  all: PropTypes.arrayOf(PropTypes.string),
};

const overrideWithWipPalette = (wipPalette, base, accents) => {
  const wipColors = [...wipPalette.colors];
  const wipLightness = (wipPalette.referenceLightness || 0.5) * 100;

  console.log('WC!', wipColors);
  if (!wipColors[0]) {
    return;
  }
  base[0] = wipColors[0];
  if (!wipColors[7]) {
    wipColors[7] = findOpposite(wipColors[0], gray(wipLightness)).formatHex();
  }

  const baseScale = scaleLinear()
    .range([wipColors[0], wipColors[7]])
    .interpolate(interpolateLab);

  const vs = [0, 0.07, 0.41, 0.47, 0.53, 0.59, 0.93, 1];
  range(1, 7).forEach(i => {
    if (wipColors[i]) {
      return;
    }
    wipColors[i] = baseScale(vs[i]);
  });

  const midRange = 0.5;
  const midColor = gray(wipLightness);
  const getAccent = color =>
    scaleLinear()
      .range([midColor, color])
      .interpolate(interpolateLab)(midRange);
  let suggestedAccents = [
    getAccent('#F00'),
    getAccent('#F80'),
    getAccent('#FF0'),
    getAccent('#0F0'),
    getAccent('#0FF'),
    getAccent('#00F'),
    getAccent('#80F'),
    getAccent('#F0F'),
  ];

  range(8, 16).forEach(i => {
    if (wipColors[i]) {
      return;
    }
    wipColors[i] = suggestedAccents[i - 8];
  });

  range(8).forEach(i => {
    base[i] = wipColors[i].toString();
    accents[i] = wipColors[i + 8];
  });
};

const mapStateToProps = state => {
  const { currentPalette, wipPalette } = state;

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
    wipPalette,
    all,
    accents,
    base,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadBase16Palette,
      setColor,
      setReferenceLightness,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialCreateScheme);
