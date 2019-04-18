import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { I18n } from 'react-i18next';
import i18n from 'Src/i18n';
import axios from 'axios';
import config from 'Config';
import { setOrder, fetchOrderBook, errorAlert, changeOrderBookValue } from 'Actions/index.js';

import CoinSelector from '../ExchangeWidget/CoinInput/CoinSelector/CoinSelector';
import WalletAddress from '../ExchangeWidget/WalletAddress/WalletAddress';
import OrderDepth from './OrderDepth/OrderDepth';
import LimitOrderForm from './LimitOrderForm/LimitOrderForm';
import DepositModal from './DepositModal/DepositModal';
import MyOrders from './MyOrders/MyOrders';
import OrderModeSwitch from '../OrderModeSwitch/OrderModeSwitch';

import styles from './OrderBookWidget.scss';


class OrderBookWidget extends Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      showDepositModal: false
    };

    this.placeOrder = this.placeOrder.bind(this);
  }

  componentDidMount(){
    if(this.props.selectedCoin){
      this.setState({loading: false});
      this.fetchOrderBook();
      if(this.quantityInputEl) { this.quantityInputEl.focus(); }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if((this.props.selectedCoin && this.props.selectedCoin.receive !== prevProps.selectedCoin.receive) || 
      (this.props.selectedCoin.deposit !== prevProps.selectedCoin.deposit)) {
        clearInterval(this.interval);
        this.fetchOrderBook();
    }
  }


  fetchOrderBook = () => {
    const fetch = () => {
      const pair = `${this.props.selectedCoin.receive}${this.props.selectedCoin.deposit}`;
      const orderBook = this.props.orderBook;
      const payloads = [{
        orderBook,
        pair,
        type: 'SELL',
        status: 'OPEN'
      },{
        orderBook,
        pair,
        type: 'BUY',
        status: 'OPEN'
      },{
        orderBook,
        pair,
        status: 'CLOSED'
      }]
      payloads.forEach((payload) => this.props.fetchOrderBook(payload));
    }

    fetch();
    this.interval = setInterval(() => {
      fetch();
    }, config.ORDER_BOOK_FETCH_INTERVAL);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  openDepositModal = () => this.setState({ showDepositModal: true });
  closeDepositModal = () => this.setState({ showDepositModal: false });

  handleOrderBookOrderTypeChange(type) {
    const orderBook = this.props.orderBook;
    orderBook.order_type = type;
    orderBook.quantity = '';
    orderBook.limit_rate = '';
    this.props.changeOrderBookValue(orderBook);
  }

  placeOrder() {
    if (!this.props.wallet.valid) {
      if (this.props.selectedCoin.receive && this.props.wallet.address === '') {
        window.gtag('event', 'Place order with empty wallet address', {event_category: 'Order Book', event_label: ``});

        this.props.errorAlert({
          show: true,
          message: `${i18n.t('error.providevalid')} ${this.props.selectedCoin.receive} ${i18n.t('generalterms.address')}.`,
        });
      }

      this.walletInputEl.focus();
      return;
    }


    //TO DELETE - HARDCODED
    let pair = `${this.props.selectedCoin.receive}${this.props.selectedCoin.deposit}`;
    if(pair !== 'DOGEETH'){
      this.props.errorAlert({
        show: true,
        message: `Invalid pair. The only avaialable pair for limit order testing is DOGEETH`,
      });
      return;
    }
    let order_type = null;
    let refund_address = null;
    if(this.props.orderBook.order_type === 'BUY'){
      order_type = 1;
      refund_address = '0xbb9bc244d798123fde783fcc1c72d3bb8c189413';
    }
    if(this.props.orderBook.order_type === 'SELL'){
      order_type = 0;
      refund_address = 'DBXu2kgc3xtvCUWFcxFE3r9hEYgmuaaCyD';
    }


    let data = {
      pair: {
        name: pair
      },
      order_type,
      amount_base: parseFloat(this.props.orderBook.quantity),
      amount_quote: 0,
      limit_rate: parseFloat(this.props.orderBook.limit_rate),
      withdraw_address: {
          name: '',
          address: this.props.wallet.address
      },
      refund_address: {
          name: 'REFUND ADDRESS',
          address: refund_address
      }
    };

    axios
      .post(`${config.API_BASE_URL}/limit_order/`, data)
      .then(response => {
        
        this.props.setOrder(response.data);


        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        // bindCrispEmail(this.props.store);

        window.gtag('event', 'Place order', {event_category: 'Order Book', event_label: `${response.data.unique_reference}`});

        //Store limit order history in local storage
        let limitOrderHistory = localStorage['limitOrderHistory'];
        if(!limitOrderHistory){
          limitOrderHistory = response.data.unique_reference;
        }
        else {
          limitOrderHistory += `,${response.data.unique_reference}`;
        }
        localStorage.setItem('limitOrderHistory', limitOrderHistory);

        this.setState({ showDepositModal: true })
      })
      .catch(error => {
        console.log('Error:', error);
        console.log("error.response",error.response);
        

        /* eslint max-len: ['error', { 'code': 200 }] */
        let message = error.response && error.response.data.non_field_errors && 
        error.response.data.non_field_errors.length ? error.response.data.non_field_errors[0] : `${i18n.t('subscription.5')}`;

        this.props.errorAlert({
          message: message,
          show: true,
          type: 'PLACE_ORDER',
        });

        this.setState({ loading: false });
      });
  }


  render() {
    const order_type = this.props.orderBook.order_type;
    return (
      <I18n ns='translations'>
        {t => (
          <div className={styles.container}>
            <div className='container'>
              <div className='row'>
                <div className='col-xs-12'>
                  <div className={styles.widget}>
                      <OrderModeSwitch orderMode={this.props.orderMode} changeOrderMode={this.props.changeOrderMode}/>
                      <div className={`col-xs-12 ${styles['pair-selection']}`}>
                        <CoinSelector type='deposit' orderBook={true}/>
                        <CoinSelector type='receive' orderBook={true}/>
                      </div>
                      <div className='col-xs-12 col-sm-12 col-md-6 col-lg-4'>
                        <ul className='nav nav-tabs'>
                          <li className={`clickable ${order_type === 'BUY' ? 'active' : ''}`}>
                            <a className={`${styles['nav-buy']}`} onClick={() => this.handleOrderBookOrderTypeChange('BUY')}>Buy</a>
                          </li>
                          <li className={`clickable ${order_type === 'SELL' ? 'active' : ''}`}>
                            <a className={`${styles['nav-sell']}`} onClick={() => this.handleOrderBookOrderTypeChange('SELL')}>Sell</a>
                          </li>
                        </ul>
                        <LimitOrderForm 
                          inputRef={el => (this.quantityInputEl = el)}
                          quantity={this.state.quantity}
                          limit_rate={this.state.limit_rate}
                         />
                        <WalletAddress withdraw_coin={`${order_type === 'BUY' ? 'receive' : 'deposit'}`} inputRef={el => (this.walletInputEl = el)} button={this.button} />
                        <button className={`${styles.btn} ${order_type === 'BUY' ? styles['btn-buy'] : styles['btn-sell']} 
                        ${this.props.wallet.valid && !this.state.loading ? null : 'disabled'} btn btn-block btn-primary proceed `}
                        onClick={() => this.placeOrder()} ref={(el) => { this.button = el; }} >
                          {order_type === 'BUY' 
                          ? `Buy ${this.props.selectedCoin.receive} with ${this.props.selectedCoin.deposit}`
                          : `Sell ${this.props.selectedCoin.receive} for ${this.props.selectedCoin.deposit}`
                          }
                        </button>
                      </div>
                      <OrderDepth 
                        selectedCoins={this.props.selectedCoin}
                        sellDepth={this.props.orderBook.sellDepth}
                        buyDepth={this.props.orderBook.buyDepth}
                        />
                      <MyOrders />
                    </div>
                  </div>
              </div>
              <DepositModal show={this.state.showDepositModal} onClose={this.closeDepositModal} />
            </div>
          </div>
        )}
      </I18n>
    );
  }
}

const mapStateToProps = ({ order, selectedCoin, price, error, wallet, orderBook }) => ({ order, selectedCoin, price, error, wallet, orderBook });
const mapDispatchToProps = dispatch => bindActionCreators({ setOrder, fetchOrderBook, changeOrderBookValue, errorAlert }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderBookWidget);
