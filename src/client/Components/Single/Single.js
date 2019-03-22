import React, { Component } from 'react';
import './Single.scss';

class Single extends Component {
  render() {
    return (
      <div className="singleContainer">
        <div className="singleCover">
          <div className="imageBackgroundCover">
            <img className="backgroundImage" src="https://images.unsplash.com/photo-1552186118-22d86b3559b7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2500&fit=max&ixid=eyJhcHBfaWQiOjcwNjZ9" alt=""/>
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
