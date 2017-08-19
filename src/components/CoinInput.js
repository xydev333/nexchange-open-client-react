import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import axios from 'axios';

import config from '../config';
import { errorAlert, updateAmounts, fetchPrice } from '../actions/index.js';
import CoinSelector from './CoinSelector';


class CoinInput extends Component {
	constructor(props) {
		super(props);

		// this.state = {
		// 	value: this.props.amounts[this.props.type]
		// }

		this.onChange = this.onChange.bind(this);
	}
	
	onChange(event) {
		let value = event.target.value,
			pair = `${this.props.selectedCoin.present.deposit}${this.props.selectedCoin.present.receive}`;

		if (this.props.type == 'receive')
			pair = `${this.props.selectedCoin.present.receive}${this.props.selectedCoin.present.deposit}`

		this.props.updateAmounts({pair: pair, lastEdited: this.props.type, amount: event.target.value, useNewPrice: true});
	}

	validateReceiveAmount(value) {
		let selectedCoin = this.props.selectedCoin.present['receive'],
			minAmount = _.find(this.props.coinsInfo, {ticker: selectedCoin}).min_amount;

		if (value < minAmount || isNaN(value)) {
			this.props.errorAlert({
				message: `Receive amount cannot be less than ${minAmount}`,
				show: true,
				type: 'INVALID_AMOUNT'
			});
		} else {
			this.props.errorAlert({show: false, type: 'INVALID_AMOUNT'});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.type == 'receive' && nextProps.amounts.receive != this.props.amounts[this.props.type])
			this.validateReceiveAmount(nextProps.amounts.receive)
	}

	render() {
		return (
		  <div className="form-group label-floating has-success">
		    <label htmlFor={this.props.type} className="control-label">{this.props.type}</label>
		    <input type="text" className="form-control coin" id={`coin-input-${this.props.type}`} name={this.props.type} value={this.props.amounts[this.props.type]} onChange={this.onChange} />

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
		price: state.price
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		errorAlert: errorAlert,
		updateAmounts: updateAmounts,
	}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CoinInput);
