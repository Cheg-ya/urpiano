import MusyngNames from 'soundfont-player/names/musyngkite.json';
import React, { Component } from 'react';
import { MidiNumbers } from 'react-piano';
import PropTypes from 'prop-types';
import './PianoConfig.scss';

class PianoConfig extends Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.changeLastNote = this.changeLastNote.bind(this);
    this.changeFirstNote = this.changeFirstNote.bind(this);
    this.changeInstrument = this.changeInstrument.bind(this);
    this.createFirstNoteOptions = this.createFirstNoteOptions.bind(this);
    this.createInstrumentOptions = this.createInstrumentOptions.bind(this);
  }

  static defaultProps = {
    setConfig: () => {}
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    const { keyboardShortcutOffset, noteRange } = this.props;
    const totalKeyboardNum = noteRange.last - noteRange.first + 1;
    const minOffset = 0;
    const maxOffset = totalKeyboardNum - 18;

    if (e.key === 'ArrowLeft') {
      const reducedOffset = keyboardShortcutOffset - 1;
      
      if (reducedOffset >= minOffset) {
        this.props.setConfig({
          keyboardShortcutOffset: reducedOffset
        });
      }
    }

    if (e.key === 'ArrowRight') {
      const increasedOffset = keyboardShortcutOffset + 1;

      if (increasedOffset <= maxOffset) {
        this.props.setConfig({
          keyboardShortcutOffset: increasedOffset
        });
      }
    }
  }

  createInstrumentOptions() {
    return MusyngNames.map((instrumentName, i) => {
      return (<option key={i}>{instrumentName}</option>);
    });
  }

  createFirstNoteOptions() {
    const lastNote = this.props.noteRange.last;

    return MidiNumbers.NATURAL_MIDI_NUMBERS.map(number => {
      return (
        <option key={number} value={number} disabled={number >= (lastNote - 28)}>
          {MidiNumbers.getAttributes(number).note}
        </option>
      );
    });
  }

  createLastNoteOptions() {
    const firstNote = this.props.noteRange.first;

    return MidiNumbers.NATURAL_MIDI_NUMBERS.map(number => {
      return (
        <option key={number} value={number} disabled={number <= (firstNote + 28)}>
          {MidiNumbers.getAttributes(number).note}
        </option>
      );
    });
  }

  changeInstrument(e) {
    const instrumentName = e.target.value;

    this.props.setConfig({
      instrumentName
    });
  }

  changeFirstNote(e) {
    const { noteRange } = this.props;
    const firstNote = parseInt(e.target.value);

    this.props.setConfig({
      noteRange: {
        first: firstNote,
        last: noteRange.last
      }
    });
  }

  changeLastNote(e) {
    const { noteRange } = this.props;
    const lastNote = parseInt(e.target.value);

    this.props.setConfig({
      noteRange: {
        first: noteRange.first,
        last: lastNote
      }
    });
  }

  render() {
    const { instrumentName, noteRange } = this.props;
    const firstNote = noteRange.first;
    const lastNote = noteRange.last;

    return (
      <div className="configContainer">
        <div className="configCover">
          <div className="firstNoteCover">
            <small>First Note</small>
            <select value={firstNote} onChange={this.changeFirstNote}>
              {this.createFirstNoteOptions()}
            </select>
          </div>
          <div className="lastNoteCover">
            <small>Last Note</small>
            <select value={lastNote} onChange={this.changeLastNote}>
              {this.createLastNoteOptions()}
            </select>
          </div>
          <div className="instrumentOptionCover">
            <small>Instrument</small>
            <select onChange={this.changeInstrument} value={instrumentName}>
              {this.createInstrumentOptions()}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default PianoConfig;

PianoConfig.propTypes = {
  instrumentName: PropTypes.string.isRequired,
  keyboardShortcutOffset: PropTypes.number,
  noteRange: PropTypes.object.isRequired,
  setConfig: PropTypes.func.isRequired
};
