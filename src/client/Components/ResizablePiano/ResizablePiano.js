import SoundfontProvider from '../SoundfontProvider/SoundfontProvider';
import { Piano, MidiNumbers, KeyboardShortcuts } from 'react-piano';
import PianoConfig from '../PianoConfig/PianoConfig';
import React, { Component, Fragment } from 'react';

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
                  {...this.props}
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
