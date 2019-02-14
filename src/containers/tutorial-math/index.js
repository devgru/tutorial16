import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TutorialContainer from '../tutorial-container';
import colorToRgbPoint from '../../utils/colorToRgbPoint';
import { loadBase16Palette } from '../../modules/currentPalette';
import InlineSwatch from '../../presentational/InlineSwatch';
import GithubCorner from '../../presentational/GithubCorner';
import ColorSpace from '../../presentational/ColorSpace';
import Favicon from '../../presentational/Favicon';
import Header from '../../presentational/Header';
import Page from '../../presentational/Page';

import '../tutorial/index.css';
import SchemeBar from '../../presentational/SchemeBar';
import Navigation from '../../presentational/Navigation';

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
            <h1>Математика RGB</h1>
          </div>
          <Navigation />
          <div className="Tutorial-text">
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
          </div>
        </Page>
        <Page inverse>
          <ColorSpace
            width={300}
            height={300}
            background={foreground}
            colorToPoint={colorToRgbPoint}
            gridOpacity={1}
            autoRotate
          />
          <p>
            RGB идеально подходит чтобы сообщить монитору насколько ярко нужно
            включить каждый из суб-пикселей, но для человека это не лучший
            формат описания цвета. В RGB трудно оценить характеристики цвета —
            яркость, насыщенность, тон. Например, <InlineSwatch color="#080" />{' '}
            #008800 будет куда ярче чем #000088 <InlineSwatch color="#008" />,
            хотя цифры использованы идентичные.
          </p>
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
