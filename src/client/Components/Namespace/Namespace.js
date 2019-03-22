import React, { Component } from 'react';
import { IoIosWarning } from 'react-icons/io';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import './Namespace.scss';

class Namespace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      namespace: '',
      invalid: false,
      displayConfirm: false,
      copied: false
    };

    this.onClickClose = this.onClickClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.copyInvitationUrl = this.copyInvitationUrl.bind(this);
  }

  onClickClose() {
    this.props.closeModal();
  }

  handleOnSubmit(e) {
    e.preventDefault();

    const { namespace, invalid } = this.state;

    if (namespace.length < 5 && !invalid) {
      return this.setState(() => {
        return {
          invalid: true
        };
      });
    }

    if (namespace.length >= 5){
      this.setState(() => {
        return {
          displayConfirm: true
        };
      });
    }
  }

  handleOnChange(e) {
    const namespace = e.target.value.trim();

    this.setState(() => {
      return {
        namespace
      };
    });
  }

  handleConfirm() {
    const { namespace } = this.state;
    this.props.onConfirm(namespace);
  }

  copyInvitationUrl() {
    this.setState(() => {
      return {
        copied: true
      };
    });
  }

  render() {
    const { namespace, invalid, displayConfirm, copied } = this.state;

    if (displayConfirm) {
      return (
        <div className="confirmContainer">
          <div className="formLogo">UP</div>
          <CopyToClipboard text={`${location.origin}/duo/${namespace}`}>
            <button className="copyBtn" onClick={this.copyInvitationUrl}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </CopyToClipboard>
          <div className="confirmCover">
            <label>Invitation URL:</label>
            <div className="url">
              {`${location.origin}/duo/${namespace}`}
            </div>
            <div className="confirmBtnCover">
              <button className="confirmBtn" onClick={this.handleConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <form className="nameSpaceForm" onSubmit={this.handleOnSubmit}>
        <div className="formLogo">UP</div>
        <i className="closeBtn fas fa-times-circle" onClick={this.onClickClose}></i>
        <div className="inputCover">
          <input
            type="text"
            className="namespaceInput"
            placeholder="Type room name"
            value={namespace}
            onChange={this.handleOnChange}
          />
          {invalid && <label><IoIosWarning />At least 5 letters required</label>}
          <button className="submitBtn" type="submit">Create Room</button>
        </div>
      </form>
    );
  }
}

export default Namespace;

Namespace.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};
