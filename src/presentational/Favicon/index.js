import React, { Component } from 'react';
import ReactFavicon from 'react-favicon';

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

  draw = c => {
    const { background, foreground } = this.props;

    const skew = SIZE / 16;

    c.clearRect(0, 0, SIZE, SIZE);
    c.fillStyle = foreground;
    c.fillRect(0, 0, SIZE, SIZE);

    c.fillStyle = background;
    c.lineWidth = 0;
    c.beginPath();
    c.lineTo(0, 0);
    c.lineTo(SIZE, 0);
    c.lineTo(SIZE, SIZE / 2 - skew);
    c.lineTo(0, SIZE / 2 + skew);
    c.closePath();
    c.fill();
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

export default Favicon;
