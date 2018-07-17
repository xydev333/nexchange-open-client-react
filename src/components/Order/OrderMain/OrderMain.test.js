import React from 'react';
import { shallow } from 'enzyme';
import OrderMain from './OrderMain';
import order from 'Mocks/order';

describe('OrderMain', () => {
  it('renders correctly', () => {
    expect(shallow(<OrderMain order={order} />)).toMatchSnapshot();
  });
});
