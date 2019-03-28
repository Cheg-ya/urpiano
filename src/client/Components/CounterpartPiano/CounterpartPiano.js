import { Piano, MidiNumbers } from 'react-piano';
import React, { Component, Fragment } from 'react';
import SoundPlayer from '../SoundPlayer/SoundPlayer';
import PianoConfig from '../PianoConfig/PianoConfig';
import PropTypes from 'prop-types';

class CounterpartPiano extends Component {
  constructor(props) {
    super(props);

    this.state = {
      instrumentName: 'acoustic_grand_piano',
      noteRange: {
        first: MidiNumbers.fromNote('c3'),
        last: MidiNumbers.fromNote('f5')
      }
    };

    this.audioContext = new AudioContext();
    this.setConfig = this.setConfig.bind(this);
  }

  setConfig({ noteRange, instrumentName }) {
    this.setState(prevState => {
      return {
        instrumentName: !instrumentName ? prevState.instrumentName : instrumentName,
        noteRange: !noteRange ? prevState.noteRange : noteRange
      };
    });
  }

  render() {
    const { noteRange, instrumentName } = this.state;

    return (
      <SoundPlayer
        instrumentName={instrumentName}
        audioContext={this.audioContext}
        socket={this.props.socket}
        setConfig={this.setConfig}
        render={({ isLoading, playNote, stopNote }) => (
          <Fragment>
            <Piano
              noteRange={noteRange}
              width={this.props.width}
              playNote={playNote}
              stopNote={stopNote}
              disabled={isLoading}
              className={this.props.className ? this.props.className : null}
            />
            <PianoConfig 
              instrumentName={instrumentName}
              noteRange={noteRange}
            />
          </Fragment>
        )}
      />
    );
  }
}

export default CounterpartPiano;

CounterpartPiano.propTypes = {
  width: PropTypes.number,
  className: PropTypes.string,
  socket: PropTypes.object
};
