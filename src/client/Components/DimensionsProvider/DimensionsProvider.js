import React, { Component } from 'react';
import Dimensions from 'react-dimensions';

class DimensionsProvider extends Component {
  render() {
    return (
      <div>
        {this.props.children({
          containerWidth: this.props.containerWidth,
          containerHeight: this.props.containerHeight
        })}
      </div>
    );
  }
}

export default Dimensions()(DimensionsProvider);
