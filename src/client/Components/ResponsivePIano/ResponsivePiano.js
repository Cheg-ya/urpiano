import React, { Component, Fragment } from 'react';
import DimensionsProvider from '../DimensionsProvider/DimensionsProvider';
import SoundfontProvider from '../SoundfontProvider/SoundfontProvider';
import { Piano, MidiNumbers, KeyboardShortcuts } from 'react-piano';
import PianoConfig from '../PianoConfig/PianoConfig';
import PropTypes from 'prop-types';

class ResponsivePiano extends Component {
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

    this.audioContext = new AudioContext();
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
      <DimensionsProvider>
        {({ containerWidth }) => (
          <SoundfontProvider
            instrumentName={instrumentName}
            audioContext={this.audioContext}
            render={({ isLoading, playNote, stopNote }) => {
              return (
                <Fragment>
                  <Piano
                    noteRange={noteRange}
                    width={containerWidth}
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
        )}
      </DimensionsProvider>
    );
  }
}

export default ResponsivePiano;

ResponsivePiano.propTypes = {
  className: PropTypes.string
};
