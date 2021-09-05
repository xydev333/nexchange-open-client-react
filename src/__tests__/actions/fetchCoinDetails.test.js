import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as types from '../../actions/types';
import * as actions from '../../actions';
import mockData from '../__mocks__/currency';
import _ from 'lodash';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mock = new MockAdapter(axios);

describe('creates an action to fetch order details', () => {
  afterEach(() => {
    mock.reset();
  });

  it('fetches coin details that are not for testing and not only for white labels', async () => {
    const payload = _.filter(mockData, { has_enabled_pairs: true });
    const expectedActions = [{ type: types.COINS_INFO, payload }];
    const store = mockStore();

    mock.onGet('https://api.nexchange.io/en/api/v1/currency/').reply(200, mockData);
    
    await store.dispatch(actions.fetchCoinDetails())
    expect(store.getActions()).toEqual(expectedActions);
  });
});