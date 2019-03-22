import { Piano, MidiNumbers } from 'react-piano';
import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import SoundPlayer from '../SoundPlayer/SoundPlayer';

const audioContext = new AudioContext();

class CounterpartPiano extends Component { //음향 정보만 받아서 실행
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
  }

  render() {
    const { noteRange, instrumentName } = this.state;

    return (
      <SoundPlayer
        instrumentName={instrumentName}
        audioContext={audioContext}
        socket={this.props.socket}
        render={({ isLoading, playNote, stopNote }) => {
          return (
            <Fragment>
              <Piano
                noteRange={noteRange}
                width={this.props.width}
                playNote={playNote}
                stopNote={stopNote}
                disabled={isLoading}
                {...this.props}
              />
            </Fragment>
          );
        }}
      />
    );
  }
}

export default CounterpartPiano;
