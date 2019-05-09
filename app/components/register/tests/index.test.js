import React from 'react';
import { shallow } from 'enzyme';

import RegistrationForm from '../index';

describe('<RegistrationForm />', () => {
  it('should render a form', () => {
    const renderedComponent = shallow(<RegistrationForm />);
    expect(renderedComponent.length).toEqual(1);
  });
});
