import React, { Component, createRef } from 'react';
import { MdRecordVoiceOver } from 'react-icons/md';
import './VoiceChat.scss';

class VoiceChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openOptions: false,
      lastPeerId: null,
      counterpartId: null,
      onAir: false
    };

    this.ref = createRef();
    this.caller = null;
    this.callee = null;
    this.peer = new Peer(null, { debug: 3 });;
    this.call = null;
    this.roomName = location.pathname.split('/').slice(-1);
    this.showOptions = this.showOptions.bind(this);
    this.onClickStart = this.onClickStart.bind(this);
    this.onClickStop = this.onClickStop.bind(this);
    this.initializeVoiceChat = this.initializeVoiceChat.bind(this);
  }

  componentDidMount() {
    this.initializeVoiceChat();
  }

  componentWillUnmount() {
    this.peer.disconnect();
  }

  initializeVoiceChat() {
    this.peer.on('open', id => {
      this.props.socket.emit('voice connection', { peerId: id, roomName: this.roomName });

      this.setState(() => {
        return {
          lastPeerId: id
        };
      });
    });

    this.peer.on('disconnected', () => { // when user out of the page
      if (this.call) { // during the call
        this.call.close();
      }
    });

    this.peer.on('call', async call => {
      if (this.call) { // reject extra incoming call
        alert('Already connected');
        call.close();
      }

      this.call = call;

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true }); // get mic

        this.callee = new AudioContext();
        const microphone = this.callee.createMediaStreamSource(mediaStream);
        microphone.connect(this.callee.destination);

        call.answer(mediaStream); // answer the call

      } catch (err) {
        return alert(err.message);
      }

      this.call.on('stream', remoteStream => { // incoming call from counterpart
        this.ref.current.srcObject = remoteStream;
      });

      this.setState(prevState => {
        return {
          onAir: !prevState.onAir
        };
      });
    });

    this.props.socket.on('receive peerId', id => { // store counterpart id
      this.setState(() => {
        return {
          counterpartId: id
        };
      });
    });

    this.props.socket.on('hang up', result => {
      if (result) {
        this.call.close();
        this.call = null;

        if (this.caller) {
          this.caller.close();
          this.caller = null;
        }

        if (this.callee) {
          this.callee.close();
          this.callee = null;
        }

        this.setState(() => {
          return {
            onAir: false
          };
        });
      }
    });
  }

  async onClickStart() {
    if (this.call) { // reject extra incoming calls
      this.call.close();
    }

    const id = this.state.counterpartId;

    this.setState(prevState => {
      return {
        onAir: !prevState.onAir
      };
    });

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.caller = new AudioContext();
      const microphone = this.caller.createMediaStreamSource(mediaStream);
      microphone.connect(this.caller.destination);

      this.call = this.peer.call(id, mediaStream);

      this.call.on('stream', remoteStream => { // received counterpart mic stream
        this.ref.current.srcObject = remoteStream;

        this.setState(() => {
          return {
            stream: remoteStream
          };
        });
      });

    } catch (err) {
      return alert(err.message);
    }
  }

  onClickStop() {
    this.call.close();
    this.call = null;

    if (this.caller) {
      this.caller.close();
      this.caller = null;
    }

    if (this.callee) {
      this.callee.close();
      this.callee = null;
    }

    this.setState(prevState => {
      return {
        onAir: !prevState.onAir
      };
    });

    this.props.socket.emit('voice disconnection', this.roomName);
  }

  showOptions() {
    this.setState(prevState => {
      return {
        openOptions: !prevState.openOptions
      };
    });
  }

  render() {
    const { openOptions, counterpartId, onAir } = this.state;

    return (
      <div className="voiceWrapper">
        <audio autoPlay ref={this.ref} srcObject=""></audio>
        <div className="voiceBtnCover" onClick={this.showOptions}>
          <span><MdRecordVoiceOver/>Voice</span>
        </div>
        {openOptions &&
          <div className="btnCover">
            <button className="startBtn" onClick={this.onClickStart} disabled={!counterpartId || onAir}>Start</button>
            <button className="stopBtn" onClick={this.onClickStop} disabled={!onAir}>Stop</button>
          </div>
        }
      </div>
    );
  }
}

export default VoiceChat;
