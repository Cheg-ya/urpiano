import React, { Component } from 'react';
import './Single.css';

class Single extends Component {
  render() {
    return (
      <div className="singleContainer">
        <div className="singleCover">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Single;
