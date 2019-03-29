import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import PianoConfig from './PianoConfig';

describe('PianoConfig component test', () => {
  const instrument = 'acoustic_grand_piano';
  const keyboardShortcutOffset = 0;
  const noteRange = {
    first: 1,
    last: 30
  };

  const setConfig = jest.fn().mockImplementation(() => true);

  describe('render and props test', () => {
    const component = shallow(
      <PianoConfig 
        instrumentName={instrument}
        noteRange={noteRange}
        keyboardShortcutOffset={keyboardShortcutOffset}
        setConfig={setConfig}
      />
    );
  
    const instance = component.instance();
  
    it('renders correctly and check if state exists', () => {
      const tree = renderer.create(
        <PianoConfig 
          instrumentName={instrument}
          noteRange={noteRange}
          keyboardShortcutOffset={keyboardShortcutOffset}
          setConfig={setConfig}
        />
      ).toJSON();
  
      expect(tree).toMatchSnapshot();
      expect(instance).toBeInstanceOf(PianoConfig);
      expect(component.exists()).toBe(true);
      expect(component.exists('.configContainer')).toBe(true);
      expect(component.type()).toEqual('div');
      expect(component.state()).toBeNull();
    });
  
    it('checks props object\'s properties', () => {
      expect(instance.props).toHaveProperty('noteRange');
      expect(instance.props).toHaveProperty('setConfig');
      expect(instance.props).toHaveProperty('instrumentName');
      expect(instance.props).toHaveProperty('keyboardShortcutOffset');
      expect(instance.props.setConfig).toBe(setConfig);
      expect(instance.props.noteRange).toBe(noteRange);
      expect(instance.props.instrumentName).toBe(instrument);
      expect(instance.props.keyboardShortcutOffset).toBe(keyboardShortcutOffset);
    });

    it('checks props type', () => {
      expect(typeof instance.props.noteRange).toBe('object');
      expect(typeof instance.props.setConfig).toBe('function');
      expect(typeof instance.props.instrumentName).toBe('string');
      expect(typeof instance.props.keyboardShortcutOffset).toBe('number');
    });
  });

  describe('life-cycle method test', () => {
    it('calls componentDidMount & componentWillUnmount correctly', () => {
      const didMount = jest.spyOn(PianoConfig.prototype, 'componentDidMount');
      const eventCallback = jest.spyOn(PianoConfig.prototype, 'handleKeyDown');
      const addEventListener = window.addEventListener;
      const removeEventListener = window.removeEventListener;

      window.addEventListener = jest.fn().mockImplementation((e, cb) => cb(e));
      window.removeEventListener = jest.fn().mockImplementation((e, cb) => cb(e));

      const component = mount(<PianoConfig
        instrumentName={instrument}
        noteRange={noteRange}
        keyboardShortcutOffset={keyboardShortcutOffset}
        setConfig={setConfig}
      />);

      expect(didMount).toHaveBeenCalled();
      expect(didMount).toHaveBeenCalledTimes(1);
      expect(window.addEventListener).toHaveBeenCalled();
      expect(eventCallback).toHaveBeenCalled();
      expect(eventCallback).toHaveBeenCalledTimes(1);

      const unmount = jest.spyOn(PianoConfig.prototype, 'componentWillUnmount');
      component.unmount();

      expect(unmount).toHaveBeenCalled();
      expect(unmount).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalled();
      expect(eventCallback).toHaveBeenCalled();
      expect(eventCallback).toHaveBeenCalledTimes(2);

      window.addEventListener = addEventListener;
      window.removeEventListener = removeEventListener;
    });
  });

  describe('component custom methods test', () => {
    it('tests methods that call right after render', () => {
      const createFirstNoteOptions = jest.spyOn(PianoConfig.prototype, 'createFirstNoteOptions');
      const createLastNoteOptions = jest.spyOn(PianoConfig.prototype, 'createLastNoteOptions');
      const createInstrumentOptions = jest.spyOn(PianoConfig.prototype, 'createInstrumentOptions');

      const component = mount(<PianoConfig
        instrumentName={instrument}
        noteRange={noteRange}
        keyboardShortcutOffset={keyboardShortcutOffset}
        setConfig={setConfig}
      />);
  
      expect(createFirstNoteOptions).toHaveBeenCalled();
      expect(createFirstNoteOptions).toHaveReturned();
      expect(createLastNoteOptions).toHaveBeenCalled();
      expect(createLastNoteOptions).toHaveReturned();
      expect(createInstrumentOptions).toHaveBeenCalled();
      expect(createInstrumentOptions).toHaveReturned();

      component.unmount();
    });

    it('calls props function when relative functions called', () => {
      const component = mount(<PianoConfig
        instrumentName={instrument}
        noteRange={noteRange}
        keyboardShortcutOffset={keyboardShortcutOffset}
        setConfig={setConfig}
      />);
  
      const props = component.props();
      const spy = jest.spyOn(props, 'setConfig');
  
      component.instance().changeFirstNote({ target: { value: 10 } });
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturned();
  
      component.instance().changeLastNote({ target: { value: 10 } });
      expect(spy).toHaveBeenCalledTimes(2);
  
      component.instance().changeInstrument({ target: { value: 10 } });
      expect(spy).toHaveBeenCalledTimes(3);

      component.unmount();
    });

    it('calls methods when keydown event occurred', () => {
      const addEventListener = window.addEventListener;
      const removeEventListener = window.removeEventListener;

      const eventAndCallback = {};

      window.addEventListener = jest.fn(((e, cb) => eventAndCallback[e] = cb));
      window.removeEventListener = jest.fn(((e, cb) => eventAndCallback[e] = cb));

      const setConfig = jest.fn().mockImplementation(() => true);
      const component = mount(<PianoConfig
        instrumentName={instrument}
        noteRange={noteRange}
        keyboardShortcutOffset={keyboardShortcutOffset}
        setConfig={setConfig}
      />);

      eventAndCallback.keydown({ key: 'ArrowRight' });
      expect(setConfig).toHaveBeenCalled();
      eventAndCallback.keydown({ key: 'ArrowLeft' });
      expect(setConfig).toHaveBeenCalled();

      component.unmount();

      window.addEventListener = addEventListener;
      window.removeEventListener = removeEventListener;
    });
  });
});

