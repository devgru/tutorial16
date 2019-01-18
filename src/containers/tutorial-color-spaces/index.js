import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TutorialContainer from '../tutorial-container';
import colorToRgbPoint from '../../utils/colorToRgbPoint';
import colorToHsvPoint from '../../utils/colorToHsvPoint';
import colorToHslPoint from '../../utils/colorToHslPoint';
import { loadBase16Palette } from '../../modules/currentPalette';
import InlineSwatch from '../../presentational/InlineSwatch';
import GithubCorner from '../../presentational/GithubCorner';
import ColorSpace from '../../presentational/ColorSpace';
import Favicon from '../../presentational/Favicon';
import Header from '../../presentational/Header';
import Page from '../../presentational/Page';

import '../tutorial/index.css';
import SchemeBar from '../../presentational/SchemeBar';

class TutorialColorSpaces extends TutorialContainer {
  constructor(props) {
    super(props);
    props.loadBase16Palette('solarized-light');
  }
  componentDidMount() {
    this.updateStyles();
  }

  componentDidUpdate() {
    this.updateStyles();
  }

  updateStyles() {
    const { style } = document.documentElement;
    const { base } = this.props;

    if (!base) {
      return;
    }

    base.forEach((color, i) => {
      style.setProperty('--color' + i, color);
    });
  }

  render() {
    const { all, palettes } = this.props;
    if (!all) {
      return null;
    }

    const background = all[0];
    const foreground = all[7];

    const selectedPalettes = [
      'solarized-light',
      'solarized-dark',
      'solarflare',
      'tutorial-light',
    ].reduce(
      (hash, key) => ({
        ...hash,
        [key]: palettes[key],
      }),
      {}
    );

    return (
      <div className="Tutorial">
        <Favicon background={background} foreground={foreground} />
        <GithubCorner />
        <Page>
          <div className="Tutorial-text">
            <h1>Цветовые модели</h1>
            <Header hash="rgb">RGB</Header>
            <p>
              Цвета хранятся и передаются в формате RGB — по байту на каждую из
              цветовых компонент: красную, зелёную и синию, 256 значений от 0 до
              255.
            </p>
            <p>
              Комбинация трёх таких компонент даёт почти 17 миллионов цветов.
              Это — современный минимум, дисплей любого устройства должен уметь
              корректно отобразить RGB-цвет.
            </p>
            <p>
              Некоторые устройства могут больше, например современные МакБуки
              поддерживают цветовое пространство P3, в нём на четверть больше
              цветов. Такие дисплеи буквально могут показать «более красный»
              цвет, не искажая при этом обычный красный. В этом руководстве я не
              буду развивать тему широких цветовых пространств.
            </p>
            <p>
              RGB идеально подходит чтобы сообщить монитору насколько ярко нужно
              включить каждый из суб-пикселей, но для человека это не лучший
              формат описания цвета. В RGB трудно оценить характеристики цвета —
              яркость, насыщенность, тон. Например,{' '}
              <InlineSwatch color="#080" /> #008800 будет куда ярче чем #000088{' '}
              <InlineSwatch color="#008" />, хотя цифры использованы идентичные.
            </p>
          </div>
        </Page>
        <Page inverse>
          <div className="Tutorial-text">
            <Header hash="derived">Производные модели</Header>
            <p>
              Производные от RGB модели HSL и HSV используют другие
              характеристики для описания цвета: тон (Hue), насыщенность
              (Saturation) и яркость или значение (Lightness, Value). Отличаются
              эти две модели только в последней характеристике: в HSL
              максимальной яркостью обладает только белый цвет, в HSV
              максимальное значение будет у всех цветов, в которых хотя бы один
              из компонентов RGB имеет максимальное значение.
            </p>
            <p>
              Тон может принимать значение от 0° до 360°, остальные параметры —
              от 0 до 100. Важное отличие производных моделей: значения могут
              быть дробными числами.
            </p>
            <p>
              Цвет во всех перечисленных моделях описывается в трёх числах.
              Модель, описываемую тремя характеристиками можно отобразить в
              пространстве. Вот так выглядят RGB, HSL и HSV:
            </p>
          </div>
          {[colorToRgbPoint, colorToHslPoint, colorToHsvPoint].map((fn, i) => (
            <ColorSpace
              key={i}
              width={300}
              height={300}
              background={foreground}
              controlsOptions={{
                enableKeys: false,
                enableZoom: false,
                autoRotate: true,
              }}
              animate
              colorToPoint={a => fn(a, false)}
              gridOpacity={1}
            />
          ))}
          <div className="Tutorial-text">
            <p>
              Видно, что точки, равномерно формировавшие куб RGB распределяются
              совершенно иначе. Если использовать вместо цилиндра конус и
              двойной конус, можно увидеть более равномерное распределение:
            </p>
          </div>
          {[colorToRgbPoint, colorToHslPoint, colorToHsvPoint].map((fn, i) => (
            <ColorSpace
              key={i}
              width={300}
              height={300}
              background={foreground}
              controlsOptions={{
                enableKeys: false,
                enableZoom: false,
                autoRotate: true,
              }}
              animate
              colorToPoint={fn}
              gridOpacity={1}
            />
          ))}
          <div className="Tutorial-text">
            <p>
              Куб RGB можно повернуть по-разному. Я ставлю его на чёрный угол и
              поворачиваю таким образом, чтобы было заметно «сродство» цветовых
              моделей.
            </p>
          </div>
        </Page>
        <Page>
          <div className="Tutorial-text">
            <Header hash="hsl">HSL</Header>
            <p>
              Когда мы подбираем цвета, модель HSL удобнее RGB, она позволяет
              оценивать понятные характеристики цвета.
            </p>
            <p>
              Однако, у неё есть недостатки. Основным я считаю поведение
              параметра «яркость». В HSL вот эти цвета имеют одинаковую яркость
              в 50%: <InlineSwatch color="#F00" /> <InlineSwatch color="#FF0" />{' '}
              <InlineSwatch color="#0F0" /> <InlineSwatch color="#0FF" />{' '}
              <InlineSwatch color="#00F" /> <InlineSwatch color="#F0F" />. Для
              сравнения, в RGB эти цвета находятся в разных углах кубика, имея
              условную яркость (простую сумму значений компонент) 33% (
              <InlineSwatch color="#F00" />, <InlineSwatch color="#0F0" /> и{' '}
              <InlineSwatch color="#00F" />) и 66% (
              <InlineSwatch color="#FF0" />, <InlineSwatch color="#0FF" /> и{' '}
              <InlineSwatch color="#F0F" />
              ).
            </p>
            <p>
              Разумеется, это нонсенс. Яркость <InlineSwatch color="#FF0" /> и{' '}
              <InlineSwatch color="#00F" /> не может быть одинаковой. И даже
              двукратная разница — не похоже на правду, яркость этих цветов
              отличается куда больше.
            </p>
          </div>
        </Page>
        <Page inverse>
          <div className="Tutorial-text">
            <Header hash="lab-hcl">LAB и HCL</Header>
            <p>
              LAB — модель, определённая с учётом того, как наши глаза
              воспринимают свет. Первый параметр — «яркость» (Lightness).
              Параметры A и B не имеют расшифровки, это просто расстояние от
              центральной оси L, на которой лежат цвета от чёрного до белого.
            </p>
            <p>
              В LAB значения яркости для <InlineSwatch color="#FF0" /> и{' '}
              <InlineSwatch color="#00F" /> — 98% и 30%. Это уже больше похоже
              на правду.
            </p>
            <p>
              Чтобы проще ориентироваться в цветовом пространстве LAB
              используйте систему координат HCL (она же LCH). В ней декартовы
              координаты A и B заменяются полярными — углом H (Hue),
              обозначающим тон и радиусом C (Chroma).
            </p>
            <p>
              В трёхмерном пространстве LAB все доступные нам цвета образуют не
              куб или конус, а фигуру сложной формы:
            </p>
          </div>
          <div className="Tutorial-wide">
            <ColorSpace
              width={300}
              height={300}
              background={foreground}
              controlsOptions={{
                enableKeys: false,
                enableZoom: false,
                autoRotate: true,
              }}
              animate
              gridOpacity={1}
            />
          </div>
          <div className="Tutorial-text">
            <p>
              Это и определяет главную сложность использования моделей LAB и
              HCL: асимметричность. Если у вас есть жёлтый цвет{' '}
              <InlineSwatch color="#E4EA00" /> с 90% яркости и 90% насыщенности,
              то синий цвет вы с такими характеристиками не найдёте, т.к. синяя
              цветовая компонента имеет гораздо меньшую яркость. Зато, у чистого
              синего цвета <InlineSwatch color="#00F" /> насыщенность в модели
              HCL — 131%. Странная математика, правда?
            </p>
          </div>
        </Page>
        <Page>
          <div className="Tutorial-text">
            <p>
              Дальше — <a href="#/color-schemes">цветовые схемы</a>.
            </p>
          </div>
        </Page>
        <SchemeBar
          schemes={selectedPalettes}
          onLoadScheme={loadBase16Palette}
        />
      </div>
    );
  }
}

TutorialColorSpaces.propTypes = {
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
  bindActionCreators({ loadBase16Palette }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialColorSpaces);
