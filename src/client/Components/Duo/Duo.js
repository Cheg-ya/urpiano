import CounterpartPiano from '../CounterpartPiano/CounterpartPiano';
import ResizablePiano from '../ResizablePiano/ResizablePiano';
import DimensionsProvider from '../DimensionsProvider/DimensionsProvider';
import React, { Component, Fragment } from 'react';
import NameInput from '../NameInput/NameInput';
import Modal from '../Modal/Modal';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import './Duo.scss';

const socket = io.connect('http://192.168.0.61:8080');

class Duo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      log: [],
      joined: false
    };

    this.createRoom = this.createRoom.bind(this);
    this.getOutOfRoom = this.getOutOfRoom.bind(this);
    this.displayRoomLog = this.displayRoomLog.bind(this);
    this.onChangeConfig = this.onChangeConfig.bind(this);
    this.onPlayNoteInput = this.onPlayNoteInput.bind(this);
    this.onStopNoteInput = this.onStopNoteInput.bind(this);
    this.connectionHandler = this.connectionHandler.bind(this);
  }

  componentDidMount() {
    this.connectionHandler();
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

  connectionHandler() {
    socket.on('join', result => {
      const { joined, message } = result;

      if (joined) {
        this.setState(prevState => {
          return {
            joined: true,
            log: prevState.log.concat(message)
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

  render() {
    const { joined } = this.state;

    return (
      <div className="duoContainer">
        <div className="connectionLog">
          {this.displayRoomLog()}
        </div>
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
                          onPlayNoteInput={this.onPlayNoteInput}
                          onStopNoteInput={this.onStopNoteInput}
                          onChangeConfig={this.onChangeConfig}
                        />
                      )}
                    </DimensionsProvider>
                  </div>
                  <div className="secondPianoCover">
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
                </Fragment>
              : <Modal closeModal={this.getOutOfRoom}>
                  <NameInput onCreate={this.createRoom} closeModal={this.getOutOfRoom} />
                </Modal>
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
