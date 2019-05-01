import React, { Component } from 'react';
import { hcl, rgb } from 'd3-color';
import rgbCached from '../../utils/rgb';
import Swatch from '../Swatch';
import { range } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import delta from '../../utils/delta';

import './index.css';

class Single2DPicker extends Component {
  constructor(props) {
    super(props);
    const { width, height, scale = 1 } = props;
    const ratio = 1;
    const rs = ratio * scale;

    this.state = {
      rs,
      scaledWidth: width * ratio,
      scaledHeight: height * ratio,
      limitX: scaleLinear()
        .domain([0, width])
        .range([0, width])
        .clamp(true),
      limitY: scaleLinear()
        .domain([0, height])
        .range([0, height])
        .clamp(true),
    };
  }

  getNewColor = ({ clientX, clientY, target }) => {
    const { scale = 1, height, dimensions, color, model } = this.props;
    const { limitX, limitY } = this.state;
    const { top, left } = target.getBoundingClientRect();

    const x = limitX(clientX - left - 5) / scale;
    const y = limitY(height - clientY + top + 5) / scale;
    const newColor = model(color);
    newColor[dimensions[0]] = x;
    newColor[dimensions[1]] = y;

    if (newColor.displayable()) {
      return newColor;
    }
    return null;
  };

  onMouseDown = () => {
    this.isMouseDown = true;
  };

  onMouseUp = () => {
    this.isMouseDown = false;

    const { newColor } = this.state;
    if (newColor) {
      this.props.setColor(newColor);
    }
  };

  componentWillReceiveProps() {
    this.setState({ newColor: null });
  }

  onMouseMove = e => {
    if (!this.isMouseDown) {
      return;
    }
    const newColor = this.getNewColor(e);
    if (newColor) {
      this.setState({ newColor });
    }
  };

  draw = () => {
    const { color, dimensions, model, avoidDelta, avoidColor } = this.props;
    if (color === this.drawnColor) {
      return;
    }
    this.drawnColor = color;

    const { newColor, rs, scaledWidth, scaledHeight } = this.state;

    const colorToDisplay = model(newColor || color);

    const imageData = this.context2d.createImageData(scaledWidth, scaledHeight);
    let position = 0;
    range(0, scaledHeight).forEach(y => {
      range(0, scaledWidth).forEach(x => {
        colorToDisplay[dimensions[0]] = x / rs;
        colorToDisplay[dimensions[1]] = (scaledHeight - y) / rs;
        const tooClose =
          avoidColor && delta(avoidColor, colorToDisplay) < avoidDelta;
        const displayable = colorToDisplay.displayable();
        if (!displayable) {
          // position += 4;
          // return;
        }
        let r, g, b;
        if (model === rgb) {
          r = colorToDisplay.r;
          g = colorToDisplay.g;
          b = colorToDisplay.b;
        } else {
          [r, g, b] = rgbCached(colorToDisplay);
        }
        imageData.data[position] = r;
        imageData.data[position + 1] = g;
        imageData.data[position + 2] = b;
        imageData.data[position + 3] = displayable && !tooClose ? 255 : 25;
        position += 4;
      });
    });
    this.context2d.putImageData(imageData, 0, 0);
  };

  ref = canvas => {
    if (!canvas) {
      return;
    }

    this.context2d = canvas.getContext('2d');
    this.draw();
  };

  render() {
    const { model, color, dimensions, height, scale = 1 } = this.props;
    const { newColor } = this.state;

    if (this.context2d) {
      this.draw();
    }
    const style = {
      width: this.props.width + 10 + 'px',
      height: this.props.height + 10 + 'px',
      position: 'relative',
    };
    const styleInner = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      left: '0px',
      top: '0px',
      position: 'absolute',
    };
    const styleSvg = {
      width: this.props.width + 10 + 'px',
      height: this.props.height + 10 + 'px',
      left: '0px',
      top: '0px',
      position: 'absolute',
    };
    const effectiveColor = newColor || color;
    const colorToDisplay = model(effectiveColor);
    const cx = colorToDisplay[dimensions[0]] * scale;
    const cy = height - colorToDisplay[dimensions[1]] * scale;
    return (
      <div style={style}>
        <canvas
          className="Picker-canvas"
          width={this.state.scaledWidth}
          height={this.state.scaledHeight}
          style={styleInner}
          ref={this.ref}
        />
        <svg
          className="Picker-svg"
          style={styleSvg}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseOut={this.onMouseUp}
        >
          <g transform="translate(5,5)">
            <circle
              fill={effectiveColor}
              strokeWidth={0.75}
              stroke="black"
              r="5"
              cx={cx}
              cy={cy}
            />
            <circle
              fill="transparent"
              strokeWidth={0.75}
              stroke="white"
              r="4"
              cx={cx}
              cy={cy}
            />
          </g>
        </svg>
      </div>
    );
  }
}

class Picker extends Component {
  setColor = color => {
    this.props.onColorPicked(color);
  };

  render() {
    const { color, onClose, avoidColor, avoidDelta } = this.props;
    const { setColor } = this;
    const style = {
      background: color,
    };
    return (
      <div className="Picker" style={style}>
        <div className="Picker-left">
          <Single2DPicker
            width={360}
            height={132}
            setColor={setColor}
            color={color}
            dimensions={['h', 'c']}
            model={hcl}
            avoidColor={avoidColor}
            avoidDelta={avoidDelta}
          />
          <br />
          <Single2DPicker
            width={360}
            height={100}
            setColor={setColor}
            color={color}
            dimensions={['h', 'l']}
            model={hcl}
            avoidColor={avoidColor}
            avoidDelta={avoidDelta}
          />
        </div>
        <div className="Picker-right">
          <Single2DPicker
            width={264}
            height={200}
            setColor={setColor}
            color={color}
            dimensions={['c', 'l']}
            scale={2}
            model={hcl}
            avoidColor={avoidColor}
            avoidDelta={avoidDelta}
          />
        </div>
        <div className="Picker-right">
          <Swatch color={color} onClick={onClose} />
        </div>
        <div className="Picker-left">
          <div className="Picker-right">
            <Single2DPicker
              width={256}
              height={256}
              setColor={setColor}
              color={color}
              dimensions={['r', 'g']}
              model={rgb}
              avoidColor={avoidColor}
              avoidDelta={avoidDelta}
            />
          </div>
          <div className="Picker-right">
            <Single2DPicker
              width={256}
              height={256}
              setColor={setColor}
              color={color}
              dimensions={['g', 'b']}
              model={rgb}
              avoidColor={avoidColor}
              avoidDelta={avoidDelta}
            />
          </div>
          <div className="Picker-right">
            <Single2DPicker
              width={256}
              height={256}
              setColor={setColor}
              color={color}
              dimensions={['b', 'r']}
              model={rgb}
              avoidColor={avoidColor}
              avoidDelta={avoidDelta}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Picker;
