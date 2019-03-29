import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Single from './Single';

describe('Single component test', () => {
  it('render correctly', () => {
    const component = shallow(<Single />);
    const tree = renderer.create(<Single />).toJSON();

    expect(component.exists()).toBe(true);
    expect(component.state()).toBeNull();
    expect(tree).toMatchSnapshot();
  });

  it('renders its children DOM node', () => {
    const tree = renderer.create(
      <Single>
        <div className="target">Hello</div>
      </Single>
    ).toJSON();

    const component = shallow((
      <Single>
        <div className="target">Hello</div>
      </Single>
    ));

    expect(component.contains(<div className="target">Hello</div>)).toBe(true);
    expect(tree).toMatchSnapshot();
  });
});
