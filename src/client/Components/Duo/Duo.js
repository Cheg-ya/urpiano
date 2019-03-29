import DimensionsProvider from '../DimensionsProvider/DimensionsProvider';
import CounterpartPiano from '../CounterpartPiano/CounterpartPiano';
import ResizablePiano from '../ResizablePiano/ResizablePiano';
import NameInput from '../NameInput/NameInput';
import VoiceChat from '../VoiceChat/VoiceChat';
import ChatRoom from '../ChatRoom/ChatRoom';
import Loader from 'react-loader-spinner'
import Modal from '../Modal/Modal';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import './Duo.scss';

class Duo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      log: [],
      joined: false,
      partnerJoined: false,
      isChatMode: false
    };

    this.socket = io.connect('https://192.168.0.61:8080');
    // this.socket = io.connect('https://192.168.55.84:8080'); //artisee
    this.roomName = this.props.match.params.room_name;
    this.createRoom = this.createRoom.bind(this);
    this.getOutOfRoom = this.getOutOfRoom.bind(this);
    this.openChatRoom = this.openChatRoom.bind(this);
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
      this.socket.close();

      this.setState(() => {
        return {
          joined: false,
          log: []
        };
      });
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  createRoom(userName) {
    const roomName = this.roomName;

    this.socket.open();

    this.socket.emit('join', {
      roomName,
      userName
    });
  }

  socketEventHandler() {
    this.socket.on('join', result => {
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
        this.socket.close();
        this.props.history.replace('/');
        alert(message);
      }
    });

    this.socket.on('disconnect', ({ userName }) => {
      this.setState(prevState => {
        return {
          partnerJoined: false,
          log: prevState.log.concat({ message: `${userName} has left the room` })
        };
      });
    });

    this.socket.on('receive message', message => {
      this.setState(prevState => {
        return {
          log: prevState.log.concat(message)
        };
      });
    });
  }

  getOutOfRoom() {
    this.socket.close();
    this.props.history.replace('/');
  }

  onChangeConfig(newConfig) {
    const roomName = this.roomName;

    this.socket.emit('change config', {
      roomName,
      instrumentName: newConfig.instrumentName,
      noteRange: newConfig.noteRange
    });
  }

  onPlayNoteInput(keyNumber) {
    const roomName = this.roomName;

    this.socket.emit('play note', {
      roomName,
      keyNumber
    });
  }

  onStopNoteInput(keyNumber, { prevActiveNotes }) {
    if (!prevActiveNotes.length) {
      return;
    }

    const roomName = this.roomName;

    this.socket.emit('stop note', {
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

  render() {
    const { joined, isChatMode, log, partnerJoined } = this.state;

    return (
      <div className="duoContainer">
        {joined &&
          <Fragment>
            <ChatRoom
              socket={this.socket}
              messages={log}
              changeMode={this.openChatRoom}
            />
            <VoiceChat
              socket={this.socket}
            />
          </Fragment>
        }
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
                          socket={this.socket}
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
                        socket={this.socket}
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
