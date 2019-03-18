import React, { Component } from 'react';
import './Single.css';

class Single extends Component {
  render() {
    return (
      <div className="singleContainer">
        <div className="singleCover">
          <div className="imageBackgroundCover">
            <div className="transparent"></div>
            <img className="backgroundImage" src="https://images.unsplash.com/photo-1507417869387-f868beebf2f6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1200&fit=max&ixid=eyJhcHBfaWQiOjcwNjZ9" alt=""/>
          </div>
          <div className="pianoCover">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Single;
