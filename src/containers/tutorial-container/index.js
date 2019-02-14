import { Component } from 'react';
import PropTypes from 'prop-types';

let setScrollRestoration = function(mode) {
  const { history } = window;
  if ('scrollRestoration' in history) {
    history.scrollRestoration = mode;
  }
};
const scrollToAnchor = initial => {
  setScrollRestoration('manual');
  const hashParts = window.location.hash.split('#');
  if (hashParts.length <= 2) {
    if (initial) {
      window.scrollTo(0, 0);
    }
    return;
  }
  const hash = hashParts.slice(-1)[0];
  const target = document.querySelector(`#${hash}`);
  if (!target) {
    return;
  }
  target.scrollIntoView();
};

class TutorialContainer extends Component {
  constructor(props) {
    super(props);

    if (!TutorialContainer.initialized) {
      TutorialContainer.initialized = true;
      props.loadBase16Palette('solarized-light');
    }
  }

  componentDidMount() {
    this.updateStyles();

    scrollToAnchor(true);
    window.onhashchange = scrollToAnchor;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.base && this.props.base) {
      scrollToAnchor();
      // Decode entities in the URL
      // Sometimes a URL like #/foo#bar will be encoded as #/foo%23bar
      // window.location.hash = window.decodeURIComponent(window.location.hash);
    }
    this.updateStyles();
  }

  updateStyles() {
    const { base } = this.props;

    if (!base) {
      return;
    }

    const { style } = document.documentElement;
    base.forEach((color, i) => {
      style.setProperty('--color' + i, color);
    });
  }

  getChildContext() {
    const { base } = this.props;
    return {
      base,
    };
  }
}

TutorialContainer.childContextTypes = {
  base: PropTypes.arrayOf(PropTypes.string),
};
TutorialContainer.propTypes = {
  all: PropTypes.arrayOf(PropTypes.string),
  currentPalette: PropTypes.shape({
    palette: PropTypes.shape({
      base: PropTypes.arrayOf(PropTypes.string),
      accents: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

export default TutorialContainer;
