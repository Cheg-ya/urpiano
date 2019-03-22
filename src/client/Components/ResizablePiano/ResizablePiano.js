import SoundfontProvider from '../SoundfontProvider/SoundfontProvider';
import PianoConfig from '../PianoConfig/PianoConfig';
import { Piano, MidiNumbers, KeyboardShortcuts } from 'react-piano';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

const audioContext = new AudioContext();

class ResizablePiano extends Component {
  constructor(props) {
    super(props);

    this.state = {
      instrumentName: 'acoustic_grand_piano',
      noteRange: {
        first: MidiNumbers.fromNote('c3'),
        last: MidiNumbers.fromNote('f5')
      },
      keyboardShortcutOffset: 0
    };

    this.setConfig = this.setConfig.bind(this);
  }

  setConfig(config) {
    if (config.instrumentName || config.noteRange) {
      this.props.onChangeConfig(config);
    }

    this.setState(prevState => {
      return _.assign({}, prevState, config);
    });
  }

  render() {
    const { noteRange, keyboardShortcutOffset, instrumentName } = this.state;

    const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: noteRange.first + keyboardShortcutOffset,
      lastNote: noteRange.last + keyboardShortcutOffset,
      keyboardConfig: KeyboardShortcuts.HOME_ROW
    });

    return (
      <SoundfontProvider
          instrumentName={instrumentName}
          audioContext={audioContext}
          onChangeConfig={this.props.onChangeConfig}
          render={({ isLoading, playNote, stopNote }) => {
            return (
              <Fragment>
                <Piano
                  noteRange={noteRange}
                  width={this.props.width}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  keyboardShortcuts={keyboardShortcuts}
                  onPlayNoteInput={this.props.onPlayNoteInput}
                  onStopNoteInput={this.props.onStopNoteInput}
                  className={this.props.className}
                />
                <PianoConfig
                  instrumentName={instrumentName}
                  noteRange={noteRange}
                  keyboardShortcutOffset={keyboardShortcutOffset}
                  setConfig={this.setConfig}
                />
              </Fragment>
            );
          }}
        />
    );
  }
}

export default ResizablePiano;

ResizablePiano.propTypes = {
  width: PropTypes.number.isRequired,
  className: PropTypes.string,
  socket: PropTypes.object.isRequired,
  onPlayNoteInput: PropTypes.func.isRequired,
  onStopNoteInput: PropTypes.func.isRequired,
  onChangeConfig: PropTypes.func.isRequired
};
