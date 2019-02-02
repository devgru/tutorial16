import React from 'react';
import PropTypes from 'prop-types';
import TutorialContainer from '../tutorial-container';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loadBase16Palette, setColor } from '../../modules/currentPalette';

import GithubCorner from '../../presentational/GithubCorner';
import PageTitle from '../../presentational/TutorialPages/01-Title';
import PageInteractive from '../../presentational/TutorialPages/02-Interactive';
import SchemeBar from '../../presentational/SchemeBar';
import Favicon from '../../presentational/Favicon';
import Page from '../../presentational/Page';
import Header from '../../presentational/Header';

import './index.css';

class Tutorial extends TutorialContainer {
  constructor(props) {
    super(props);
    props.loadBase16Palette('solarized-light');
  }

  render() {
    const { base, palettes, loadBase16Palette } = this.props;
    if (!base) {
      return null;
    }

    const background = base[0];
    const foreground = base[7];

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
        <PageTitle />
        <PageInteractive base={base} />
        <Page>
          <div className="Tutorial-text">
            <Header hash="structure">Структура</Header>
            <p>
              Статья разделена на странице, каждая состоит из блоков. На каждый
              из заголовков можно сослаться, скопировав ссылку рядом с
              заголовком.
            </p>
            <p>
              Следующая страница — <a href="#/color-spaces">цветовые модели</a>.
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

Tutorial.propTypes = {
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
)(Tutorial);
