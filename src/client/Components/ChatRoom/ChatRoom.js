import React, { Component, createRef, Fragment } from 'react';
import { IoIosChatbubbles } from 'react-icons/io';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import './ChatRoom.scss';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChatRoomOpen: false,
      message: '',
      alertMessage: false
    };

    this.ref = createRef();
    this.roomName = location.pathname.split('/').slice(-1);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
  }

  componentDidMount() {
    if (this.ref.current) {
      this.ref.current.scrollTop = this.ref.current.scrollHeight;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.ref.current) {
      this.ref.current.scrollTop = this.ref.current.scrollHeight;
    }

    const { isChatRoomOpen, alertMessage } = this.state;

    if (!isChatRoomOpen && !alertMessage) {
      const prevMessages = prevProps.messages;
      const currentMessages = this.props.messages;

      if (prevMessages.length < currentMessages.length) {
        this.setState(() => {
          return {
            alertMessage: true
          };
        });
      }
    }
  }

  handleOnClick() {
    this.props.changeMode();

    this.setState(prevState => {
      return {
        isChatRoomOpen: !prevState.isChatRoomOpen,
        alertMessage: false
      };
    });
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

  onSendMessage(e) {
    e.preventDefault();

    const message = this.state.message;
    const roomName = this.roomName;

    if (!message.length) return;

    this.props.socket.emit('send message', {
      roomName,
      message
    });

    this.setState(() => {
      return {
        message: ''
      };
    });
  }

  render() {
    const { message, isChatRoomOpen, alertMessage } = this.state;

    if (!isChatRoomOpen) {
      const latestMsg = this.props.messages.slice(-1)[0];

      return (
        <Fragment>
          {alertMessage
          ? <div className="messageAlert" onClick={this.handleOnClick}>
              <small>Message Alert</small>
              <div>{!latestMsg.userName ? latestMsg.message : 'You\'ve got new messages'}</div>
            </div>
          :
            <div className="chatBtn" onClick={this.handleOnClick}>
              <IoIosChatbubbles /><span>Chat</span>
            </div>
          }
        </Fragment>
      );
    }

    return (
      <Modal closeModal={this.handleOnClick}>
        <div className="chatRoomWrapper">
          <div className="roomHeader">
            <IoIosChatbubbles /><span>Chat Room</span>
          </div>
          <ul className="messageCover" ref={this.ref}>
            {this.displayMessage()}
          </ul>
          <form className="messageForm" onSubmit={this.onSendMessage}>
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

ChatRoom.propTypes = {
  socket: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  changeMode: PropTypes.func.isRequired
};
