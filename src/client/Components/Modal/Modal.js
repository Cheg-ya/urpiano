import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
  }

  onClickClose(e) {
    if(e.target === e.currentTarget) {
      this.props.closeModal();
    }
  }

  render() {
    return (
      <div className="modalCover" onClick={this.onClickClose}>
        {this.props.children}
      </div>
    );
  }
}

export default Modal;

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.element
};
