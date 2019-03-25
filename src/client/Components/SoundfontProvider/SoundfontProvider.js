import Soundfont from 'soundfont-player';
import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

class SoundfontProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeAudioNodes: {},
      instrument: null,
      isLoadingInstrument: true
    };

    this.playNote = this.playNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
    this.loadInstrument = this.loadInstrument.bind(this);
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps, prevState) {
    const prevInstrumentName = prevProps.instrumentName;
    const newInstrumentName = this.props.instrumentName;

    if (prevInstrumentName !== newInstrumentName) {
      this.loadInstrument(newInstrumentName);
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

  playNote(midiNumber) {
    const { audioContext } = this.props;
    const { instrument } = this.state;

    audioContext.resume().then(() => {
      const audioNode = instrument.play(midiNumber);

      this.setState(prevState => {
        return {
          activeAudioNodes: _.assign({}, prevState.activeAudioNodes, { [midiNumber]: audioNode })
        };
      });
    });
  }

  stopNote(midiNumber) {
    const { audioContext } = this.props;
    const { activeAudioNodes } = this.state;

    audioContext.resume().then(() => {
      if (!activeAudioNodes[midiNumber]) {
        return;
      }

      const audioNode = activeAudioNodes[midiNumber];

      audioNode.stop();

      this.setState({
        activeAudioNodes: _.assign({}, activeAudioNodes, { [midiNumber]: null })
      });
    });
  }

  render() {
    const { isLoadingInstrument } = this.state;

    return this.props.render({
      isLoading: isLoadingInstrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      onPlayNoteInput: this.props.onPlayNoteInput
    });
  }
}

export default SoundfontProvider;

SoundfontProvider.propTypes = {
  instrumentName: PropTypes.string.isRequired,
  audioContext: PropTypes.instanceOf(AudioContext).isRequired,
  render: PropTypes.func.isRequired
};
