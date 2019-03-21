import React, { Component } from 'react';

class Vspace extends Component {
  render() {
    return (
      <div style={{ padding: `${this.props.padding}px` }}></div>
    );
  }
}

export default Vspace;
