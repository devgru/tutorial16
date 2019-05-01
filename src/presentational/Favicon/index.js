import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactFavicon from 'react-favicon';
import { alea } from 'seedrandom';

const SIZE = 32;

class Favicon extends Component {
  ref = canvas => {
    if (!canvas) {
      return;
    }

    this.canvas = canvas;
    this.draw(canvas.getContext('2d'));
    this.forceUpdate();
  };

  draw = ctx => {
    const step = SIZE / 8;

    ctx.clearRect(0, 0, SIZE, SIZE);

    const { base, accents } = this.context;
    base.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, index * step, SIZE, step);
    });
    accents.forEach((color, index) => {
      const random = alea(color + index);
      ctx.fillStyle = color;
      const x = index * step;
      const y = Math.round(random() * ((SIZE - 1) / 2)) * 2;
      console.log(x, y, color);
      ctx.fillRect(x, y, 2, 2);
    });
  };

  render() {
    if (this.canvas) {
      this.draw(this.canvas.getContext('2d'));
    }
    return (
      <div style={{ display: 'none' }}>
        <canvas width={SIZE} height={SIZE} ref={this.ref} />
        {this.canvas && <ReactFavicon url={this.canvas.toDataURL()} />}
      </div>
    );
  }
}

Favicon.contextTypes = {
  base: PropTypes.arrayOf(PropTypes.string),
  accents: PropTypes.arrayOf(PropTypes.string),
};

export default Favicon;
