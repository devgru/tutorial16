import React, { Component } from 'react';
import { hcl, rgb } from 'd3-color';
import rgbCached from '../../utils/rgb';
import Chip from '../Chip';
import { range } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import './index.css';

class Picker extends Component {
  setColor = color => {
    this.props.onColorPicked(color);
  };

  render() {
    const { color, onClose } = this.props;
    const { setColor } = this;
    const style = {
      background: color,
    };
    return (
      <div
        className="
      Picker2"
        style={style}
      >
        <svg className="PickerHex">
          <defs>
            <polygon
              id="hexagon"
              points="300,130 225,260 75,260 0,130 75,0 225,0"
            />
          </defs>
          <use
            xlinkHref="#hexagon"
            transform="translate(75) scale(0.333) translate(0, 260)"
            fill="green"
          />
          <use
            xlinkHref="#hexagon"
            transform="translate(75) scale(0.333)"
            fill="blue"
          />
          <use
            xlinkHref="#hexagon"
            transform="translate(75) scale(0.333) translate(0, 520)"
            fill="coral"
          />
          <use
            xlinkHref="#hexagon"
            transform="scale(0.333) translate(0, 130)"
            fill="red"
          />
          <use
            xlinkHref="#hexagon"
            transform="scale(0.333) translate(0, 390)"
            fill="violet"
          />
          <use
            xlinkHref="#hexagon"
            transform="translate(150) scale(0.333) translate(0, 130)"
            fill="coral"
          />
          <use
            xlinkHref="#hexagon"
            transform="translate(150) scale(0.333) translate(0, 390)"
            fill="yellow"
          />
        </svg>
      </div>
    );
  }
}

export default Picker;
