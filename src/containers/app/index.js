import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Tutorial from '../tutorial';
import TutorialMath from '../tutorial-math';
import TutorialColorSpaces from '../tutorial-color-spaces';
import TutorialColorSchemes from '../tutorial-color-schemes';
import TutorialCreateScheme from '../tutorial-create-scheme';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './index.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact={true} path="/" component={Tutorial} />
        <Route exact={true} path="/math" component={TutorialMath} />
        <Route
          exact={true}
          path="/color-spaces"
          component={TutorialColorSpaces}
        />
        <Route
          exact={true}
          path="/color-schemes"
          component={TutorialColorSchemes}
        />
        <Route
          exact={true}
          path="/create-scheme"
          component={TutorialCreateScheme}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log('STATE', state);
  return {};
};
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    pure: false,
  }
)(App);
