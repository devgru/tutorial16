import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sensor from 'react-visibility-sensor';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import OrbitControls from '../../vendor/threejs-orbit-controls';
import { rgb } from 'd3-color';
import { easeSinInOut } from 'd3-ease';
import { select } from 'd3-selection';
import { interrupt } from 'd3-transition';
import uniqBy from 'lodash.uniqby';
import debounce from 'lodash.debounce';

import generatePoints from '../../utils/generatePoints';
import createPlaneMesh from '../../utils/createPlaneMesh';
import createPointMesh from '../../utils/createPointMesh';
import colorToLabPoint from '../../utils/colorToLabPoint';

class ColorSpace extends Component {
  constructor(props, context) {
    super(props, context);

    const cameraPositionZ = props.cameraPositionZ || 400;
    this.cameraPosition = new THREE.Vector3(0, 0, cameraPositionZ);

    const colorToPoint = props.colorToPoint || colorToLabPoint;
    const gridOpacity = props.gridOpacity || 0.1;
    const gridSteps = props.gridSteps || 5;
    const gridPoints = generatePoints(colorToPoint, gridSteps, gridOpacity);
    this.lastPosition = 0;
    this.state = {
      colorToPoint,
      gridPoints,
      renderScene: () => {},
    };
  }

  componentDidMount() {
    const Controls = OrbitControls(THREE);
    this.controls = new Controls(this.refs.camera, this.divRef);
    this.controls.enableKeys = false;
    this.controls.enableZoom = false;
    this.controls.autoRotate = this.props.autoRotate;

    this.renderScene = () => {
      this.state.renderScene();
    };
    this.controls.addEventListener('start', this.renderScene);
    this.controls.addEventListener('change', this.renderScene);
    this.controls.addEventListener('end', this.renderScene);

    if (this.props.autoTilt) {
      window.addEventListener('scroll', this.tilt);
    }
  }

  tilt = debounce(() => {
    if (!this.isVisible) {
      return;
    }

    const r = this.divRef.getBoundingClientRect();
    const position = r.bottom + r.top - window.innerHeight;

    const { lastPosition } = this;
    this.lastPosition = position;

    const deltaPx = position - lastPosition;
    const deltaDegree = deltaPx / (6 * 100);

    interrupt(this);
    select(this)
      .transition()
      .duration(600)
      .ease(easeSinInOut)
      .tween('', () => {
        let lastP = 0;
        return progress => {
          const delta = (progress - lastP) * deltaDegree;
          lastP = progress;

          this.controls.rotateUp(delta);
          this.controls.rotateLeft(Math.abs(delta));
          this.controls.update();
          this.state.renderScene();
        };
      });
    // .on('start', () => {console.log('start')})
    // .on('interrupt', () => {console.log('interrupt')})
    // .on('end', () => {console.log('end')})
  }, 30);

  animationStep() {
    if (!this.isVisible) {
      return;
    }
    if (this.controls) {
      this.controls.update();
    }
    requestAnimationFrame(() => this.animationStep());
  }

  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
    if (this.props.autoTilt) {
      window.removeEventListener('scroll', this.tilt);
    }
  }

  onManualRenderTriggerCreated = renderScene => {
    this.setState({ renderScene });
    renderScene();
  };

  componentDidUpdate() {
    this.state.renderScene();
  }

  render() {
    const { gridPoints } = this.state;
    const {
      colors,
      background,
      plane,
      accents = [],
      width,
      height,
      autoRotate,
      autoTilt,
    } = this.props;
    const { base } = this.context;

    const palettePoints = colors.map(color =>
      createPointMesh(this.state.colorToPoint, rgb(color), 1)
    );
    const projectedPoints = accents.map(color =>
      createPointMesh(this.state.colorToPoint, rgb(color), 0.7, plane)
    );
    const uniqPoints = uniqBy(palettePoints, a => a.key);
    const uniqProjectedPoints = uniqBy(projectedPoints, a => a.key);

    const onVisibilityChange = isVisible => {
      this.isVisible = isVisible;
      isVisible && this.animationStep();
    };

    const react3 = (
      <React3
        mainCamera="camera"
        width={width}
        height={height}
        clearColor={background || base[0]}
        forceManualRender
        onManualRenderTriggerCreated={this.onManualRenderTriggerCreated}
      >
        <scene>
          <perspectiveCamera
            name="camera"
            ref="camera"
            fov={50}
            aspect={width / height}
            near={10}
            far={1000}
            position={this.cameraPosition}
          />
          {createPlaneMesh(plane)}
          {gridPoints}
          {uniqPoints}
          {uniqProjectedPoints}
        </scene>
      </React3>
    );

    const wrapped =
      autoRotate || autoTilt ? (
        <Sensor
          partialVisibility
          intervalCheck={false}
          scrollCheck
          onChange={onVisibilityChange}
        >
          {react3}
        </Sensor>
      ) : (
        react3
      );

    return (
      <div
        className="ColorSpace"
        ref={ref => (this.divRef = ref)}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {wrapped}
      </div>
    );
  }
}

ColorSpace.contextTypes = {
  base: PropTypes.arrayOf(PropTypes.string),
};

ColorSpace.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
};

ColorSpace.defaultProps = {
  colors: [],
};

export default ColorSpace;
