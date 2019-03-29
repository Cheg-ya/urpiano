import React, { Component } from 'react';
import { IoIosWarning } from 'react-icons/io';
import PropTypes from 'prop-types';
import './NameInput.scss';

class NameInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      invalid: false
    };

    this.onClickClose = this.onClickClose.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  onClickClose() {
    this.props.closeModal();
  }

  handleOnSubmit(e) {
    e.preventDefault();

    const { name } = this.state;

    if (name.length < 2) {
      return this.setState(() => {
        return {
          invalid: true
        };
      });
    }

    this.props.onCreate(name);
  }

  handleOnChange(e) {
    const name = e.target.value;

    this.setState(() => {
      return {
        name
      };
    });
  }

  render() {
    const { name, invalid } = this.state;

    return (
      <form className="nameInputForm" onSubmit={this.handleOnSubmit}>
        <div className="formLogo">UP</div>
        <i className="closeBtn fas fa-times-circle" onClick={this.onClickClose}></i>
        <div className="inputCover">
          <input
            type="text"
            className="nameInputField"
            placeholder="Type your name"
            value={name}
            onChange={this.handleOnChange}
          />
          {invalid && <label><IoIosWarning />At least 2 letters required</label>}
          <button className="submitBtn" type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default NameInput;

NameInput.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};
