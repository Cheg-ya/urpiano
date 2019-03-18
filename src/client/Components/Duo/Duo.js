import React, { Component } from 'react';
import './Duo.css';

class Duo extends Component {
  render() {
    console.log(this.props.children);

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default Duo;
