import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Menu.scss';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e) {
    if (e.target === e.currentTarget) {
      this.props.onClickClose();
    }
  }

  render() {
    return (
      <div className="menuWrapper" onClick={this.handleOnClick}>
        <div id="menu" className="menuContainer">
          <div className="menuBtnCover">
            <button className="menuBtn home"><Link to="/">Home</Link></button>
            <Link className="menuBtn duo" to="/duo">Duo</Link>
            <button className="menuBtn login">Login</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
