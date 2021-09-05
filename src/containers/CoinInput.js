import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment'

import config from '../config';
import { errorAlert, updateAmounts, fetchPrice } from '../actions/index.js';
import CoinSelector from './CoinSelector';


class CoinInput extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange(event) {
		let pair = `${this.props.selectedCoin.receive}${this.props.selectedCoin.deposit}`;

		if (this.props.price.pair !== pair || new moment().diff(this.props.price.lastFetched) > config.PRICE_FETCH_INTERVAL)
			this.props.fetchPrice({pair: pair, amount: event.target.value, lastEdited: this.props.type});
		else
			this.props.updateAmounts({amount: event.target.value, lastEdited: this.props.type, price: this.props.price.price});

		ga('send', 'event', 'Order', 'change amount');
	}

	validateAmounts(selectedCoins, coinsInfo, depositValue, receiveValue) {
		let selectedReceiveCoin = selectedCoins['receive'],
			selectedDepositCoin = selectedCoins['deposit'],
			minAmount = parseFloat(_.find(coinsInfo, {code: selectedReceiveCoin}).minimal_amount),
			maxAmount = _.find(coinsInfo, {code: selectedDepositCoin});

		if (maxAmount) maxAmount = parseFloat(maxAmount.maximal_amount);

		depositValue = parseFloat(depositValue);
		receiveValue = parseFloat(receiveValue);

		if (isNaN(depositValue) || isNaN(receiveValue)) {
			this.props.errorAlert({
				message: `Amount values cannot be empty`,
				show: true,
				type: 'INVALID_AMOUNT'
			});
		} else if (depositValue > maxAmount) {
			this.props.errorAlert({
				message: `Deposit amount for ${selectedDepositCoin} cannot be more than ${maxAmount}`,
				show: true,
				type: 'INVALID_AMOUNT'
			});
		} else if (receiveValue < minAmount) {
			this.props.errorAlert({
				message: `Receive amount for ${selectedReceiveCoin} cannot be less than ${minAmount}`,
				show: true,
				type: 'INVALID_AMOUNT'
			});
		} else {
			this.props.errorAlert({show: false, type: 'INVALID_AMOUNT'});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.pair !== nextProps.pair) {
			this.props.fetchPrice({pair: nextProps.pair, lastEdited: this.props.amounts.lastEdited, amount: this.props.amounts[this.props.amounts.lastEdited]});
		}

		// console.log(
		// 	nextProps.type === 'receive',
		// 	nextProps.amounts.receive !== this.props.amounts[this.props.type],
		// 	nextProps.selectedCoin !== null,
		// 	nextProps.coinsInfo.length,
		// )
    //
		// console.log(
		// 	nextProps.type,
		// 	nextProps.amounts.receive, this.props.amounts[this.props.type],
		// 	nextProps.selectedCoin,
		// 	nextProps.coinsInfo
		// )

		if (nextProps.type === 'receive' &&
				nextProps.amounts.receive !== this.props.amounts[this.props.type] &&
				nextProps.selectedCoin !== null &&
				nextProps.coinsInfo.length) {
			this.validateAmounts(nextProps.selectedCoin, nextProps.coinsInfo, nextProps.amounts.deposit, nextProps.amounts.receive);
		}
	}

	render() {
		return (
		  <div className="form-group label-floating has-success is-focused">
		    <label htmlFor={this.props.type} className="control-label text-green">{this.props.type}</label>
		    <input type="number" className="form-control coin" id={`coin-input-${this.props.type}`} name={this.props.type} onChange={this.onChange} value={this.props.amounts[this.props.type]} />

		    <CoinSelector type={this.props.type} />
		  </div>
		);
	}
}


function mapStateToProps(state) {
	return {
		selectedCoin: state.selectedCoin,
		coinsInfo: state.coinsInfo,
		amounts: state.amounts,
		price: state.price,
		error: state.error
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		errorAlert: errorAlert,
		updateAmounts: updateAmounts,
		fetchPrice: fetchPrice,
	}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CoinInput);
