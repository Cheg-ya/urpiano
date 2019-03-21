import React, { Component } from 'react';
import cover from '../../../../public/images/piano.svg';
import './Duo.scss';

class Duo extends Component {
  render() {
    return (
      <div className="duoContainer">
        <div className="duoCover">
          <div className="imageBackgroundCover">
            <div className="transparent"></div>
            <img className="backgroundImage" src={cover} alt=""/>
          </div>
          <div className="firstPianoCover">
            {this.props.children[0]}
          </div>
          <div className="secondPianoCover">
            {this.props.children[1]}
          </div>
        </div>
      </div>
    );
  }
}

export default Duo;
