import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchOrder } from 'Actions';

import isFiatOrder from 'Utils/isFiatOrder';
import config from 'Config';

import OrderMain from './OrderMain/OrderMain';
import OrderTop from './OrderTop/OrderTop';

import NotFound from 'Components/NotFound/NotFound';
import OrderLoading from './OrderLoading/OrderLoading';
import OrderCoinsProcessed from './OrderCoinsProcessed/OrderCoinsProcessed';
import OrderNotifications from './OrderNotifications/OrderNotifications';
import OrderRefundAddress from './OrderRefundAddress/OrderRefundAddress';

class Order extends Component {
  constructor(props) {
    super(props);

    if (this.props.order && this.props.match.params.orderRef === this.props.order.unique_reference) {
      this.state = { order: this.props.order };
    } else {
      this.state = {};
    }
  }

  componentDidMount() {
    this.props.fetchOrder(this.props.match.params.orderRef);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      clearTimeout(this.timeout);
      clearInterval(this.interval);
      this.props.fetchOrder(this.props.match.params.orderRef);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ order: nextProps.order });

    this.timeout = setTimeout(() => {
      this.props.fetchOrder(this.props.match.params.orderRef);
    }, config.ORDER_DETAILS_FETCH_INTERVAL);

    if (nextProps.order !== 429) {
      this.setState({ order: nextProps.order });

      if (
        this.props.order &&
        this.props.order.status_name.length > 0 &&
        this.props.order.status_name[0][0] === 11 &&
        nextProps.order.status_name[0][0] === 12
      ) {
        window.ga('send', 'event', 'Order', 'order paid', nextProps.unique_reference);
      }
    }
  }

  render() {
    if (this.state.order == null) {
      return <OrderLoading />;
    } else if (this.state.order === 404) {
      return <NotFound />;
    } else if (typeof this.state.order === 'object') {
      return (
        <div id="order" className={isFiatOrder(this.state.order) ? 'order-fiat' : 'order-crypto'}>
          <div className="container">
            <OrderTop order={this.state.order} />

            <div className="row">
              <OrderCoinsProcessed order={this.state.order} />

              <OrderMain order={this.state.order} />
              <OrderNotifications order={this.state.order} />

              {!isFiatOrder(this.state.order) && <OrderRefundAddress order={this.state.order} />}
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = ({ order }) => ({ order });

export default connect(
  mapStateToProps,
  { fetchOrder }
)(Order);
