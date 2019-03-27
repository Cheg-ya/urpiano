import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Menu.scss';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.duoBtnClick = this.duoBtnClick.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e) {
    if (e.target === e.currentTarget) {
      this.props.onClickClose();
    }
  }

 duoBtnClick(e) {
  if (e.target === e.currentTarget) {
    this.props.onClickOpen();
  }
 }

  render() {
    return (
      <div className="menuWrapper" onClick={this.handleOnClick}>
        <div id="menu" className="menuContainer">
          <div className="menuBtnCover">
            <button className="menuBtn home"><Link to="/">Home</Link></button>
            <button className="menuBtn duo" onClick={this.duoBtnClick}>Duo</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;

Menu.propTypes = {
  onClickClose: PropTypes.func.isRequired,
  onClickOpen: PropTypes.func.isRequired
};
