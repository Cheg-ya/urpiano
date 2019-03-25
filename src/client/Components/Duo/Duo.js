import CounterpartPiano from '../CounterpartPiano/CounterpartPiano';
import ResizablePiano from '../ResizablePiano/ResizablePiano';
import DimensionsProvider from '../DimensionsProvider/DimensionsProvider';
import React, { Component, Fragment } from 'react';
import NameInput from '../NameInput/NameInput';
import Modal from '../Modal/Modal';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import './Duo.scss';
import ChatRoom from '../ChatRoom/ChatRoom';
import Loader from 'react-loader-spinner'

const socket = io.connect('http://192.168.0.61:8080');

class Duo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      log: [],
      joined: false,
      isChatMode: false,
      partnerJoined: false
    };

    this.createRoom = this.createRoom.bind(this);
    this.getOutOfRoom = this.getOutOfRoom.bind(this);
    this.openChatRoom = this.openChatRoom.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.displayRoomLog = this.displayRoomLog.bind(this);
    this.onChangeConfig = this.onChangeConfig.bind(this);
    this.onPlayNoteInput = this.onPlayNoteInput.bind(this);
    this.onStopNoteInput = this.onStopNoteInput.bind(this);
    this.socketEventHandler = this.socketEventHandler.bind(this);
  }

  componentDidMount() {
    this.socketEventHandler();
  }

  componentDidUpdate(prevProps) {
    const prevRoomName = prevProps.match.params.room_name;
    const currentRoomName = this.props.match.params.room_name;

    if (prevRoomName !== currentRoomName) {
      socket.close();

      this.setState(() => {
        return {
          joined: false,
          log: []
        };
      });
    }
  }

  componentWillUnmount() {
    socket.close();
  }

  createRoom(userName) {
    const roomName = this.props.match.params.room_name;

    socket.open();

    socket.emit('join', {
      roomName,
      userName
    });
  }

  socketEventHandler() {
    socket.on('join', result => {
      const { joined, message, partnerJoined } = result;

      if (joined && !partnerJoined) {
        return this.setState(prevState => {
          return {
            joined,
            log: prevState.log.concat({ message })
          };
        });

      } if (joined && partnerJoined) {
        return this.setState(prevState => {
          return {
            joined,
            partnerJoined,
            log: prevState.log.concat({ message })
          };
        });

      } else {
        socket.close();
        this.props.history.replace('/');
        alert(message);
      }
    });

    socket.on('disconnect', message => {
      this.setState(prevState => {
        return {
          partnerJoined: false,
          log: prevState.log.concat(message)
        };
      });
    });

    socket.on('receive', message => {
      this.setState(prevState => {
        return {
          log: prevState.log.concat(message)
        };
      });
    });
  }

  displayRoomLog() {
    const { log } = this.state;

    return log.slice(-3).map(message => {
      return (
        <div key={Math.random()}>{message}</div>
      );
    });
  }

  getOutOfRoom() {
    socket.close();
    this.props.history.replace('/');
  }

  onChangeConfig(newConfig) {
    const roomName = this.props.match.params.room_name;

    socket.emit('change', {
      roomName,
      instrumentName: newConfig.instrumentName,
      noteRange: newConfig.noteRange
    });
  }

  onPlayNoteInput(keyNumber) {
    const roomName = this.props.match.params.room_name;

    socket.emit('play', {
      roomName,
      keyNumber
    });
  }

  onStopNoteInput(keyNumber) {
    const roomName = this.props.match.params.room_name;

    socket.emit('stop', {
      roomName,
      keyNumber
    });
  }

  openChatRoom() {
    this.setState(prevState => {
      return {
        isChatMode: !prevState.isChatMode
      };
    });
  }

  onSendMessage(message) {
    const roomName = this.props.match.params.room_name;

    socket.emit('send', {
      roomName,
      message
    });
  }

  render() {
    const { joined, isChatMode, log, partnerJoined } = this.state;

    return (
      <div className="duoContainer">
        <ChatRoom
          messages={log}
          isChatMode={isChatMode}
          onClickChange={this.openChatRoom}
          onSubmitMessage={this.onSendMessage}
        />
        <div className="duoCover">
          <div className="imageBackgroundCover">
            <img className="backgroundImage" src="https://images.unsplash.com/photo-1552186118-22d86b3559b7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2500&fit=max&ixid=eyJhcHBfaWQiOjcwNjZ9" alt=""/>
          </div>
            {joined
              ? <Fragment>
                  <div className="firstPianoCover">
                    <DimensionsProvider>
                      {({ containerWidth }) => (
                        <ResizablePiano
                          className="theme"
                          socket={socket}
                          width={containerWidth}
                          isChatMode={isChatMode}
                          onPlayNoteInput={this.onPlayNoteInput}
                          onStopNoteInput={this.onStopNoteInput}
                          onChangeConfig={this.onChangeConfig}
                        />
                      )}
                    </DimensionsProvider>
                  </div>
                </Fragment>
              : <Modal closeModal={this.getOutOfRoom}>
                  <NameInput onCreate={this.createRoom} closeModal={this.getOutOfRoom} />
                </Modal>
            }
            {partnerJoined
              ? <div className="secondPianoCover">
                  <DimensionsProvider>
                    {({ containerWidth }) => (
                      <CounterpartPiano
                        className="theme"
                        socket={socket}
                        width={containerWidth}
                      />
                    )}
                  </DimensionsProvider>
                </div>
              : <div className="secondPianoCover">
                  <Loader type="Rings" height="100" width="100" color="#e5474b" />
                  <div className="waitingMessage">Waiting for connection</div>
                </div>
            }
        </div>
      </div>
    );
  }
}

export default Duo;

Duo.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
