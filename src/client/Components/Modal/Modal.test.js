import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Modal from './Modal';

describe('Modal component test', () => {
  const closeModal = jest.fn().mockImplementation(() => true);
  const component = shallow(<Modal closeModal={closeModal}/>);
  const instance = component.instance();

  it('renders correctly', () => {
    const tree = renderer.create((
      <Modal closeModal={closeModal} />
    )).toJSON();

    expect(tree).toMatchSnapshot();
    expect(component.exists()).toBe(true);
    expect(component.state()).toBeNull();
  });

  it('checks props type', () => {
    expect(typeof instance.props.closeModal).toBe('function');
  });

  it('renders children node when passed in', () => {
    const tree = renderer.create((
      <Modal closeModal={closeModal}>
        <div>Modal Component</div>
      </Modal>
    )).toJSON();

    const component = shallow((
      <Modal closeModal={closeModal}>
        <div>Modal Component</div>
      </Modal>
    ));

    expect(tree).toMatchSnapshot();
    expect(component.contains(<div>Modal Component</div>)).toBe(true);
  });

  it('calls onClickClose method when click event occurred', () => {
    const spy = jest.spyOn(Modal.prototype, 'onClickClose');
    const component = mount(<Modal closeModal={closeModal}></Modal>);

    component.find('.modalCover').simulate('click', { target: true, currentTarget: true });
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    component.unmount();
  });

  it('calls props function after onClickClose invoked', () => {
    const component = mount(<Modal closeModal={closeModal}></Modal>);
    const props = component.props();
    const spy = jest.spyOn(props, 'closeModal');

    component.instance().onClickClose({ target: true, currentTarget: true });
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    component.unmount();
  });
});
