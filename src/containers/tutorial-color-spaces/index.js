import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TutorialContainer from '../tutorial-container';
import colorToRgbPoint from '../../utils/colorToRgbPoint';
import colorToHsvPoint from '../../utils/colorToHsvPoint';
import colorToHslPoint from '../../utils/colorToHslPoint';
import { loadBase16Palette } from '../../modules/currentPalette';
import InlineChip from '../../presentational/InlineChip';
import GithubCorner from '../../presentational/GithubCorner';
import ColorSpace from '../../presentational/ColorSpace';
import Favicon from '../../presentational/Favicon';
import Header from '../../presentational/Header';
import Page from '../../presentational/Page';

import '../tutorial/index.css';
import SchemeBar from '../../presentational/SchemeBar';
import Navigation from '../../presentational/Navigation';
import colorToRotatedRgbPoint from '../../utils/colorToRotatedRgbPoint';

class TutorialColorSpaces extends TutorialContainer {
  render() {
    const { all, palettes, loadBase16Palette } = this.props;
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
          </div>
          <Navigation />
          <div className="Tutorial-text">
            <Header hash="rgb">RGB</Header>
            <p>
              Цвета хранятся и передаются в формате RGB — по байту на каждую из
              цветовых компонент: красную, зелёную и синию, 256 значений от 0 до
              255. Комбинация трёх таких компонент даёт почти 17 миллионов
              цветов. Это — современный минимум, практически любой цветной
              дисплей может корректно отобразить RGB-цвет.
            </p>
            <p>
              Некоторые устройства могут показать больше различных цветов,
              например современные МакБуки поддерживают цветовое пространство
              P3, в нём на четверть больше цветов чем в sRGB. Такие дисплеи
              буквально могут показать «более красный» цвет, не искажая при этом
              обычный красный. В этом руководстве я не буду развивать тему
              широких цветовых пространств.
            </p>
            <p>
              RGB-представление удобно хранить и передавать, но для человека это
              не лучший формат описания цвета, в RGB трудно оценить
              характеристики цвета — яркость, насыщенность, тон. Например, если
              взять три базовых цвета с одинаковой интенсивностью,{' '}
              <InlineChip color="#080" /> зелёный будет ярче{' '}
              <InlineChip color="#800" /> красного , а{' '}
              <InlineChip color="#008" /> синий будет самым тёмным.
            </p>
            <p>
              Отображение цветовой модели в пространстве называют цветовым
              пространством. Если расставить все RGB-цвета по трём осям,
              соответствующим каждой из цветовых компонент, мы получим куб:
            </p>
            <ColorSpace
              width={300}
              height={300}
              cameraPositionZ={250}
              colorToPoint={colorToRgbPoint}
              gridOpacity={1}
              autoRotate
            />
            <p>
              Наглядно показать в таком виде все 16,7 миллионов цветов не
              выйдет. Если из 256 значений каждой цветовой компоненты оставить
              всего 6, мы получим куб из всего 216 точек, на котором можно
              увидеть и границы цветового пространства и заглянуть вглубь.
              Опытные веб-дизайнеры и разработчики знают эти 216 цветов под
              названием «безопасные веб-цвета».
            </p>
          </div>
        </Page>
        <Page inverse>
          <div className="Tutorial-text">
            <Header hash="derived">Производные модели</Header>
            <p>
              Если вместо значений цветовых компонент расположить RGB-цвета в
              пространстве по другим правилам, можно получить производные от RGB
              цветовые модели.
            </p>
            <p>
              Популярные производные модели — HSL и HSV — используют такие
              характеристики для описания цвета:
              <ul>
                <li>тон (Hue),</li>
                <li>насыщенность (Saturation)</li>
                <li>яркость (Lightness) или значение (Value) </li>
              </ul>
              Отличаются эти две модели только в последней характеристике: в HSL
              максимальной яркостью обладает только белый цвет, в HSV
              максимальное значение будет у всех цветов, в которых хотя бы один
              из компонентов RGB имеет максимальное значение.
            </p>
            <p>
              Тон может принимать значение от 0° до 360°, остальные параметры —
              от 0 до 100%. Важное отличие производных моделей от RGB: значения
              могут быть дробными числами.
            </p>
          </div>
        </Page>
        <Page>
          <div className="Tutorial-text">
            <Header hash="derived-3d">Визуализация производных моделей</Header>
            <p>
              При визуализации производных моделей вертикальной осью выбирают
              линию монохромных цветов от чёрного до белого, с нарастающей
              яркостью или значением и нулевой насыщенностью. Насыщенность и тон
              формируют полярную систему координат, в которой угол поворота
              определяется тоном, а расстояние от вертикальной оси —
              насыщенностью.
            </p>
            <p>
              Куб RGB тоже можно повернуть так, чтобы диагональ от чёрного до
              белого цвета совпала с вертикальную осью. В такой конфигурации
              становится заметно «сродство» цветовых моделей. Теперь мы можем
              увидеть, как равномерно распределённые в RGB-пространстве цвета
              отображаются в моделях HSL и HSV:
            </p>
          </div>
          {[colorToRotatedRgbPoint, colorToHslPoint, colorToHsvPoint].map(
            (fn, i) => (
              <ColorSpace
                key={i}
                width={300}
                height={300}
                colorToPoint={a => fn(a, false)}
                gridOpacity={1}
                autoRotate
              />
            )
          )}
          <div className="Tutorial-text">
            <p>
              Вместо насыщенности иногда используют характеристику, называемую
              цветность (Chroma). Она пропорциональна разнице между максимальным
              и минимальным значением цветовых компонент. У монохромных цветов
              она равна нулю, а максимальной будет у чистых насыщенных цветов.
              Замена насыщенности на цветность нагляднее показывает, как отличие
              между яркостью (Lightness) и значением (Value) по-разному
              распределяет цвета в пространстве.
            </p>
            <p>
              Вместо цилиндра мы получаем двойной конус для HSL и обычный конус
              для HSV:
            </p>
          </div>
          {[colorToRotatedRgbPoint, colorToHslPoint, colorToHsvPoint].map(
            (fn, i) => (
              <ColorSpace
                key={i}
                width={300}
                height={300}
                colorToPoint={fn}
                gridOpacity={1}
                autoRotate
              />
            )
          )}
          <p />
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
              в 50%: <InlineChip color="#F00" /> <InlineChip color="#FF0" />{' '}
              <InlineChip color="#0F0" /> <InlineChip color="#0FF" />{' '}
              <InlineChip color="#00F" /> <InlineChip color="#F0F" />. Для
              сравнения, в RGB эти цвета находятся в разных углах кубика, имея
              условную яркость (простую сумму значений компонент) 33% (
              <InlineChip color="#F00" />, <InlineChip color="#0F0" /> и{' '}
              <InlineChip color="#00F" />) и 66% (
              <InlineChip color="#FF0" />, <InlineChip color="#0FF" /> и{' '}
              <InlineChip color="#F0F" />
              ).
            </p>
            <p>
              Разумеется, это нонсенс. Яркость <InlineChip color="#FF0" /> и{' '}
              <InlineChip color="#00F" /> не может быть одинаковой. И даже
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
              воспринимают свет. Первый её параметр — яркость (Lightness), а
              параметры A и B определяют расстояние от центральной оси.
            </p>
            <p>
              В LAB значения яркости для <InlineChip color="#FF0" /> и{' '}
              <InlineChip color="#00F" /> — 98% и 30%. Это гораздо больше
              соответствует восприятию.
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
              gridOpacity={1}
              autoRotate
            />
          </div>
          <div className="Tutorial-text">
            <p>
              Это и определяет главную сложность использования моделей LAB и
              HCL: асимметричность. Если у вас есть жёлтый цвет{' '}
              <InlineChip color="#E4EA00" /> с 90% яркости и 90% насыщенности,
              то синий цвет вы с такими характеристиками не найдёте, т.к. синяя
              цветовая компонента имеет гораздо меньшую яркость. Зато, у чистого
              синего цвета <InlineChip color="#00F" /> насыщенность в модели HCL
              — 131.
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
