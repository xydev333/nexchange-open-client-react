import React, { Component } from 'react';
import moment from 'moment';
import config from '../config';
import _ from 'lodash';

import CountDown from './CountDown';


class OrderPayment extends Component {
	constructor(props) {
		super(props);

		this.state = {estimate: 0};

		this.coin = props.order.pair.quote;
		this.minConfirmations = this.coin.min_confirmations;
		this.tx = _.find(props.order.transactions, {type: 'D'});
		this.txId = this.tx.tx_id;

		if (this.coin.code == 'ETH') this.blockchainUrl = `https://etherscan.io/tx/${this.txId}`;
		else if (this.coin.code == 'LTC') this.blockchainUrl = `https://live.blockcypher.com/ltc/tx/${this.txId}/`;
		else if (this.coin.code == 'BTC') this.blockchainUrl = `https://blockchain.info/tx/${this.txId}`;
	}

	componentWillReceiveProps(nextProps) {
		if (_.find(this.props.order.transactions, {type: 'D'}).confirmations != _.find(nextProps.order, {type: 'D'}).confirmations) {
			let coin = nextProps.order.pair.quote;
			this.minConfirmations = this.coin.min_confirmations;
		}
	}

	render() {
		if (this.txId == '' || this.txId == null) {
			return (
				<div className="col-xs-12 text-center order-status-section">
					<h2 style={{margin: "0"}}>Waiting for transaction deposit...</h2>

					<a href={`${config.API_BASE_URL}/orders/${this.props.orderRef}`} target="_blank"><h4 style={{margin: "25px 0 0px", "fontWeight": "500"}}>See your order details on our API</h4></a>
				</div>
			)
		}

		return (
			<div className="col-xs-12 text-center order-status-section">
				<h2 style={{margin: "0"}}>Transaction detected, awaiting confirmations</h2>
				<h5>Transaction ID: <a href={this.blockchainUrl} target="_blank" style={{color: "#2cb4a0"}}>{this.tx.tx_id}</a></h5>

				<a href={`${config.API_BASE_URL}/orders/${this.props.orderRef}`} target="_blank"><h4 style={{margin: "25px 0 0px", "fontWeight": "500"}}>See your order details on our API</h4></a>
				<a href={this.blockchainUrl} target="_blank"><h4 style={{margin: "5px 0 18px", "fontWeight": "500"}}>See your order details on blockchain</h4></a>
			</div>
		)
	}

};

export default OrderPayment;
