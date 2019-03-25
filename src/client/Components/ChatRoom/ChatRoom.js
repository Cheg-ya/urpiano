import React, { Component } from 'react';
import { IoIosChatbubbles } from 'react-icons/io';
import Modal from '../Modal/Modal';
import './ChatRoom.scss';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  handleOnClick() {
    this.props.onClickChange();
  }

  displayMessage() {
    const { messages } = this.props;

    return messages.map((log, i) => {
      const { userName, message } = log;

      if (!userName) {
        return (
          <li className="announcement" key={i}>
            <span>{message}</span>
          </li>
        );
      }

      return (
        <li className="textMessage" key={i}>
          <span className="userName">{userName}:</span>
          <span className="message">{message}</span>
        </li>
      );
    });
  }

  handleMessage(e) {
    const message = e.target.value;

    this.setState(() => {
      return {
        message
      };
    });
  }

  handleOnSubmit(e) {
    e.preventDefault();

    const message = this.state.message;

    if (!message.length) return;

    this.props.onSubmitMessage(this.state.message);

    this.setState(() => {
      return {
        message: ''
      };
    });
  }

  render() {
    const { isChatMode } = this.props;
    const { message } = this.state;

    if (!isChatMode) {
      return (
        <div className="chatBtn" onClick={this.handleOnClick}>
          <IoIosChatbubbles /><span>Chat</span>
        </div>
      );
    }

    return (
      <Modal closeModal={this.handleOnClick}>
        <div className="chatRoomWrapper">
          <div className="roomHeader">
            <IoIosChatbubbles /><span>Chat Room</span>
          </div>
          <ul className="messageCover">
            {this.displayMessage()}
          </ul>
          <form className="messageForm" onSubmit={this.handleOnSubmit}>
            <input type="text" placeholder="Type message" value={message} onChange={this.handleMessage} />
            <div className="sendBtnCover">
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

export default ChatRoom;
