import Soundfont from 'soundfont-player';
import React from 'react';
import _ from 'lodash';

class SoundfontProvider extends React.Component {
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

  componentDidMount() { // 최초 마운트 되엇을때 초기화
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps, prevState) { // when instrument changed, initialize
    const prevInstrumentName = prevProps.instrumentName;
    const newInstrumentName = this.props.instrumentName;

    if (prevInstrumentName !== newInstrumentName) {
      this.loadInstrument(newInstrumentName);
    }
  }

  loadInstrument() { //기존 악기를 초기화하고 새 악기 등록
    const { instrumentName, audioContext } = this.props;

    this.setState({
      instrument: null,
      isLoadingInstrument: true
    });

    Soundfont.instrument(audioContext, instrumentName).then(instrument => { // async 악기 설치
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
      stopNote: this.stopNote
    });
  }
}

export default SoundfontProvider;
