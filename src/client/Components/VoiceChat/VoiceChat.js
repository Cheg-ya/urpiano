import React, { Component, createRef } from 'react';
import { MdRecordVoiceOver } from 'react-icons/md';
import { IoIosMic, IoIosMicOff } from 'react-icons/io';
import PropTypes from 'prop-types';
import './VoiceChat.scss';

class VoiceChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counterpartId: null,
      lastPeerId: null,
      onAir: false
    };

    this.ref = createRef();
    this.call = null;
    this.caller = null;
    this.callee = null;
    this.peer = new Peer(null, { debug: 2 });;
    this.roomName = location.pathname.split('/').slice(-1);
    this.onClickStop = this.onClickStop.bind(this);
    this.onClickStart = this.onClickStart.bind(this);
    this.resetVoice = this.resetVoiceChat.bind(this);
    this.socketEventHandler = this.socketEventHandler.bind(this);
  }

  componentDidMount() {
    this.socketEventHandler();
  }

  componentWillUnmount() {
    this.peer.disconnect();
  }

  resetVoiceChat() {
    if (this.call) {
      this.call.close();
      this.call = null;
    }

    if (this.caller) {
      this.caller.close();
      this.caller = null;
    }

    if (this.callee) {
      this.callee.close();
      this.callee = null;
    }
  }

  socketEventHandler() {
    this.peer.on('open', id => {
      this.props.socket.emit('voice connection', { peerId: id, roomName: this.roomName });

      this.setState(() => {
        return {
          lastPeerId: id
        };
      });
    });

    this.peer.on('call', async call => {
      if (this.call) {
        return;
      }

      this.call = call;

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (this.call === null) {
          return;
        }

        this.callee = new AudioContext();
        const microphone = this.callee.createMediaStreamSource(mediaStream);
        microphone.connect(this.callee.destination);

        call.answer(mediaStream);

        this.call.on('stream', remoteStream => {
          this.ref.current.srcobject = remoteStream;

          this.setState(prevState => {
            return {
              onAir: !prevState.onAir
            };
          });
        });

      } catch (err) {
        return alert(err.message);
      }
    });

    this.props.socket.on('reset', () => {
      this.resetVoiceChat();

      this.setState(() => {
        return {
          counterpartId: null,
          onAir: false
        };
      });
    });

    this.props.socket.on('receive peerId', id => {
      this.setState(() => {
        return {
          counterpartId: id
        };
      });
    });

    this.props.socket.on('hang up', result => {
      if (result) {
        this.resetVoiceChat();

        this.setState(() => {
          return {
            onAir: false
          };
        });
      }
    });
  }

  async onClickStart() {
    if (this.call) {
      return;
    }

    const counterpartId = this.state.counterpartId;

    this.setState(() => {
      return {
        onAir: true
      };
    });

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.caller = new AudioContext();
      const microphone = this.caller.createMediaStreamSource(mediaStream);
      microphone.connect(this.caller.destination);

      this.call = this.peer.call(counterpartId, mediaStream);

    } catch (err) {
      return alert(err.message);
    }

    this.call.on('stream', remoteStream => {
      this.ref.current.srcobject = remoteStream;

      this.setState(() => {
        return {
          stream: remoteStream
        };
      });
    });
  }

  onClickStop() {
    this.resetVoiceChat();

    this.setState(() => {
      return {
        onAir: false
      };
    });

    this.props.socket.emit('voice disconnection', this.roomName);
  }

  render() {
    const { counterpartId, onAir } = this.state;

    return (
      <div className="voiceWrapper">
        <audio autoPlay ref={this.ref} srcobject=""></audio>
        {!onAir && !counterpartId
        ? <div className="voiceBtnCover">
            <span><MdRecordVoiceOver/>Voice</span>
          </div>
        : null
        }
        <div className="btnCover">
          {counterpartId && !onAir ? <button className="startBtn" onClick={this.onClickStart}><IoIosMic />Start</button> : null}
          {onAir && <button className="stopBtn" onClick={this.onClickStop} disabled={!onAir}><IoIosMicOff />Stop</button>}
        </div>
      </div>
    );
  }
}

export default VoiceChat;

VoiceChat.propTypes = {
  socket: PropTypes.object.isRequired
};
