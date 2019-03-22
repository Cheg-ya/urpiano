import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import PropTypes from 'prop-types';

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

DimensionsProvider.propTypes = {
  containerWidth: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired
};
