import Soundfont from 'soundfont-player';
import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

class SoundPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeAudioNodes: {},
      instrument: null,
      isLoadingInstrument: true
    };

    this.playNote = this.playNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
    this.eventHandler = this.eventHandler.bind(this);
    this.loadInstrument = this.loadInstrument.bind(this);
  }

  componentDidMount() {
    this.loadInstrument();
    this.eventHandler(); 
  }

  componentDidUpdate(prevProps, prevState) {
    const prevInstrumentName = prevProps.instrumentName;
    const newInstrumentName = this.props.instrumentName;

    if (prevInstrumentName !== newInstrumentName) {
      this.loadInstrument();
    }
  }

  loadInstrument() {
    const { instrumentName, audioContext } = this.props;

    this.setState({
      instrument: null,
      isLoadingInstrument: true
    });

    Soundfont.instrument(audioContext, instrumentName).then(instrument => {
      this.setState(() => {
        return {
          instrument,
          isLoadingInstrument: false
        };
      });
    });
  }

  playNote(keyNumber) {
    const { audioContext } = this.props;
    const { instrument } = this.state;

    audioContext.resume().then(() => {
      const audioNode = instrument.play(keyNumber);

      this.setState(prevState => {
        return {
          activeAudioNodes: _.assign({}, prevState.activeAudioNodes, { [keyNumber]: audioNode })
        };
      });
    });
  }

  stopNote(keyNumber) {
    const { audioContext } = this.props;
    const { activeAudioNodes } = this.state;

    audioContext.resume().then(() => {
      if (!activeAudioNodes[keyNumber]) {
        return;
      }

      const audioNode = activeAudioNodes[keyNumber];

      audioNode.stop();

      this.setState({
        activeAudioNodes: _.assign({}, activeAudioNodes, { [keyNumber]: null })
      });
    });
  }

  eventHandler() {
    this.props.socket.on('play', keyNumber =>{
      this.playNote(keyNumber);
    });

    this.props.socket.on('stop', keyNumber => {
      this.stopNote(keyNumber);
    });

    this.props.socket.on('change', newInstrumentName => {
      this.props.setConfig(newInstrumentName);
    });
  }

  render() {
    const { isLoadingInstrument } = this.state;

    return this.props.render({
      isLoading: isLoadingInstrument,
      playNote: this.playNote,
      stopNote: this.stopNote
    });
  }
}

export default SoundPlayer;

SoundPlayer.propTypes = {
  instrumentName: PropTypes.string.isRequired,
  setConfig: PropTypes.func.isRequired,
  audioContext: PropTypes.instanceOf(AudioContext).isRequired,
  socket: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired
};
