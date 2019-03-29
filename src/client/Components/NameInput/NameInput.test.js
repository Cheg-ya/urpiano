import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import NameInput from './NameInput';

describe('NameInput component test', () => {
  const closeModal = jest.fn().mockImplementation(() => 'close');
  const onCreate = jest.fn().mockImplementation(() => 'create');
  const initialState = {
    name: '',
    invalid: false
  };

  describe('render and props check', () => {
    const component = shallow((
      <NameInput closeModal={closeModal} onCreate={onCreate} />
    ));

    it('renders correctly with state', () => {
      const tree = renderer.create((
        <NameInput closeModal={closeModal} onCreate={onCreate} />
      )).toJSON();

      expect(tree).toMatchSnapshot();
      expect(component.exists()).toBe(true);
      expect(component.state()).not.toBeNull();
      expect(component.state()).toEqual(initialState);
      expect(component.state('name')).toBe('');
      expect(component.state('invalid')).toBe(false);
    });

    it('checks props type', () => {
      const component = mount(<NameInput closeModal={closeModal} onCreate={onCreate} />);
      const props = component.props();

      expect(typeof props.closeModal).toBe('function');
      expect(typeof props.onCreate).toBe('function');
    });
  });

  describe('custom methods test', () => {
    const onClickClose = jest.spyOn(NameInput.prototype, 'onClickClose');
    const handleOnChange = jest.spyOn(NameInput.prototype, 'handleOnChange');
    const handleOnSubmit = jest.spyOn(NameInput.prototype, 'handleOnSubmit');
    const component = mount(<NameInput closeModal={closeModal} onCreate={onCreate} />);
    const props = component.props();
    const tree = renderer.create((
      <NameInput closeModal={closeModal} onCreate={onCreate} />
    )).toJSON();

    it('calls onClickClose when click event occurred', () => {
      const closeModal = jest.spyOn(props, 'closeModal');
      component.find('.closeBtn').simulate('click');

      expect(onClickClose).toHaveBeenCalled();
      expect(onClickClose).toHaveBeenCalledTimes(1);
      expect(closeModal).toHaveBeenCalled();
      expect(closeModal).toHaveBeenCalledTimes(1);
      expect(tree).toMatchSnapshot();
    });

    it('calls handleOnChange when change event occurred', () => {
      component.find('.nameInputField').simulate('change', { target: { value: 'string' }});

      expect(handleOnChange).toHaveBeenCalled();
      expect(handleOnChange).toHaveBeenCalledTimes(1);
      expect(component.state('name')).toHaveLength(6);
      expect(tree).toMatchSnapshot();

      component.setState(initialState);
    });

    it('calls handleOnSubmit and changes visibility of label tag when submit event occurred', () => {
      const onCreate = jest.spyOn(props, 'onCreate');

      component.find('.nameInputForm').simulate('submit');

      expect(component.state('name')).toHaveLength(0);
      expect(handleOnSubmit).toHaveBeenCalled();
      expect(handleOnSubmit).toHaveBeenCalledTimes(1);
      expect(component.state('invalid')).toBe(true);
      expect(onCreate).not.toHaveBeenCalled();
      expect(component.find('.inputCover').children()).toHaveLength(3);
      expect(tree).toMatchSnapshot();

      component.setState({ name: 'string', invalid: false });
      component.find('.nameInputForm').simulate('submit');

      expect(handleOnSubmit).toHaveBeenCalled();
      expect(onCreate).toHaveBeenCalled();
      expect(onCreate).toHaveBeenCalledTimes(1);
      expect(component.find('.inputCover').children()).toHaveLength(2);
      expect(tree).toMatchSnapshot();

      component.unmount();
    });
  });
});
