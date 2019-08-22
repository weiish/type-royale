import React, { Component } from "react";
import { connect } from "react-redux";
import coinImg from "./images/coin-sprite-animation.png";

class CanvasComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            mouse: {
                x: 0,
                y: 0,
            }
        }
        this.fitCanvas = this.fitCanvas.bind(this);
        this.updateMousePosition = this.updateMousePosition.bind(this);
        this.showCoin = this.showCoin.bind(this);
        this.hideCoin = this.hideCoin.bind(this);
    }

  componentDidMount() {
      const canvas = this.refs.canvas
    const context = canvas.getContext("2d");
    var coinImage = new Image();
    coinImage.src = coinImg;

    this.setState({
      context: context,
      coin: sprite({
          canvas: canvas,
        context: context,
        width: 1000,
        height: 100,
        image: coinImage,
        numberOfFrames: 10,
        ticksPerFrame: 4,
        loop: true,
      }),
      showCoin: true
    });
    this.fitCanvas();
    window.addEventListener("resize", this.fitCanvas);
    requestAnimationFrame(() => {
      this.update();
    });
  }

  updateMousePosition(evt) {
    const canvas = this.refs.canvas;
    var rect = canvas.getBoundingClientRect();
    this.setState({mouse: {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }})
  }

  fitCanvas() {
      const canvas = this.refs.canvas;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
  }

  updateCanvas() {
    const canvas = this.refs.canvas;
    
    const ctx = canvas.getContext("2d");

    ctx.fillRect(0, 0, 100, 100);
  }

  update() {
    const canvas = this.refs.canvas
    this.state.coin.update();
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    if (this.state.showCoin) {
        this.state.coin.render(this.state.mouse);
    }
    
    requestAnimationFrame(() => {
      this.update();
    });
  }

  hideCoin() {
    this.setState({
        showCoin: false
    })
  }
  showCoin() {
      this.setState({
          showCoin: true
      })
  }

  render() {
    return (
      <div>
        <canvas onMouseEnter={this.showCoin} onMouseLeave={this.hideCoin} onMouseMove={this.updateMousePosition} className="game-overlay-canvas" ref="canvas" />
      </div>
    );
  }
}

function sprite(options) {
  var that = {},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1;
            that.canvas = options.canvas;
		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		
		that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

				tickCount = 0;
				
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {	
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
        };
		
		that.render = function (pos) {
		  // Clear the canvas
		  
		  
		  // Draw the animation
		  that.context.drawImage(
		    that.image,
		    frameIndex * that.width / numberOfFrames,
		    0,
		    that.width / numberOfFrames,
		    that.height,
		    pos.x - that.width/numberOfFrames/2,
		    pos.y - that.height/2,
		    that.width / numberOfFrames,
		    that.height);
		};
		
		return that;
}

export default connect(null)(CanvasComponent);
