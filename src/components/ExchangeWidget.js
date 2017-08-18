import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

import config from '../config';

import CoinInput from './CoinInput';
import WalletAddress from './WalletAddress';


class ExchangeWidget extends Component {
	
	constructor(props) {
		super();
		
		this.state = {
			exchangeProceeded: false,
			orderPlaced: false,
			isConfirmEnabled: false,
			loading: false,
			depositAmount: 1,
			receiveAmount: '...',
			depositCoin: 'BTC',
			receiveCoin: 'ETH',
			depositCoinPrevious: 'BTC',
			receiveCoinPrevious: 'ETH',
			lastEdited: 'deposit',
			receiveAddress: null,
			minDepositAmount: {
				'BTC': 0,
				'ETH': 0,
				'LTC': 0
			}
	  	};

	  	this.handleChange = this.handleChange.bind(this);
	  	this.setNewCoin = this.setNewCoin.bind(this);	  	
	  	this.updatePrices = this.updatePrices.bind(this);	  	  	
	  	this.toggleConfirm = this.toggleConfirm.bind(this);	  	
	  	this.placeOrder = this.placeOrder.bind(this);	
	  	this.fetchMinDeposit = this.fetchMinDeposit.bind(this);	

	  	this.fetchMinDeposit();
	}

	componentDidMount() {
		let apiUrl = `${config.API_BASE_URL}/price/${this.state.depositCoin}${this.state.receiveCoin}/latest/`;
		this.updatePrices(apiUrl);
	}

	componentDidUpdate() {
		if (this.state.depositCoin != this.state.depositCoinPrevious ||
			this.state.receiveCoin != this.state.receiveCoinPrevious) {
			let apiUrl = `${config.API_BASE_URL}/price/${this.state.depositCoin}${this.state.receiveCoin}/latest/`;
			this.setState({
				lastEdited: 'deposit',
				receiveCoinPrevious: this.state.receiveCoin,
				depositCoinPrevious: this.state.depositCoin
			}, () => {
				this.updatePrices(apiUrl);
			});
		}
	}

	fetchMinDeposit() {
		axios.get(`${config.API_BASE_URL}/currency`)
			.then(response => {
				let BTC = _.find(response.data, {code: 'BTC'}),
					ETH = _.find(response.data, {code: 'ETH'}),
					LTC = _.find(response.data, {code: 'LTC'}),
					minBTC = parseFloat(BTC.minimal_amount),
					minETH = parseFloat(ETH.minimal_amount),
					minLTC = parseFloat(LTC.minimal_amount);

				this.setState({
					minDepositAmount: {
						'BTC': minBTC,
						'ETH': minETH,
						'LTC': minLTC
					}
				})
			})
			.catch(error => {

			});
	}

	updatePrices(apiUrl) {
		axios.get(apiUrl)
		.then((response) => {
			let basePrice = response.data[0].ticker.ask;

			if (this.state.lastEdited == 'deposit') {
				let newAmount = parseFloat(this.state.depositAmount) * basePrice;

				if (isNaN(newAmount))
					newAmount = '...'

				this.setState({receiveAmount: newAmount});
			} else {
				let newAmount = parseFloat(this.state.receiveAmount) * basePrice;

				if (isNaN(newAmount))
					newAmount = '...'

				this.setState({depositAmount: newAmount});
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}

	placeOrder() {
		this.setState({loading: true});

		axios({
			method: 'post',
			url: `${config.API_BASE_URL}/orders/`,
			data: {
				"amount_base": this.state.receiveAmount,
				"is_default_rule": true,
				"pair": {
					"name": `${this.state.receiveCoin}${this.state.depositCoin}`
				},
				"withdraw_address": {
					"address": this.state.receiveAddress,
					"name": ""
				}
			},
	        contentType : "application/json"
		})
		.then((response) => {
			this.setState({
				orderRef: response.data.unique_reference,
				orderPlaced: true,
				loading: false
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}
	
	handleChange(event) {
	    let lastEdited = event.target.name,
	    	apiUrl = config.API_BASE_URL,
	    	newState = {lastEdited: lastEdited};

	    newState[`${lastEdited}Amount`] = event.target.value;

	    if (lastEdited == 'receive')
	    	apiUrl += `/price/${this.state.receiveCoin}${this.state.depositCoin}/latest/`;
	    else
	    	apiUrl += `/price/${this.state.depositCoin}${this.state.receiveCoin}/latest/`;

		this.setState(newState, () => {
			this.updatePrices(apiUrl);
		});
	}

	setNewCoin(type, coin) {
		if ((type == 'deposit' && coin == this.state.receiveCoin) ||
			(type == 'receive' && coin == this.state.depositCoin)) {
			this.setState({
				depositCoin: this.state.receiveCoin,
				receiveCoin: this.state.depositCoin
			})
		} else {
			let newState = {};
			newState[`${type}Coin`] = coin;
			this.setState(newState);
		}
	}

	toggleConfirm(address, isConfirmEnabled) {
		// TODO: this should be refactored to Redux as now
		// isConfirmEnabled is passed from child
		this.setState({isConfirmEnabled: isConfirmEnabled, receiveAddress: address});
	}

	render() {
		if (this.state.orderPlaced)
			return <Redirect to={`/order/${this.state.orderRef}`} />

		return (
			<div>
				<div className="col-xs-12 col-sm-6">
					<CoinInput type="deposit" onChange={this.handleChange} onCoinSelect={this.setNewCoin} selectedCoin={this.state.depositCoin} value={this.state.depositAmount} />
				</div>

				<div className="col-xs-12 col-sm-6">
					<CoinInput type="receive" onChange={this.handleChange} onCoinSelect={this.setNewCoin} selectedCoin={this.state.receiveCoin} value={this.state.receiveAmount} />
				</div>

				{this.state.exchangeProceeded ?
					<div className="col-xs-12">
						<WalletAddress coin={this.state.receiveCoin} toggleConfirm={this.toggleConfirm} />
					</div> : null
				}

				<div className="col-xs-12 text-center">
					{!this.state.exchangeProceeded ? (
						<button className="btn btn-block btn-success" onClick={() => this.setState({exchangeProceeded: true})}>
							Get Started !
						</button>
					) : (
						<button className="btn btn-block btn-warning" onClick={this.placeOrder} disabled={(this.state.isConfirmEnabled && !this.state.loading) ? null : 'disabled'}>
							Confirm & Place Order

							{this.state.loading ? <i className="fa fa-spinner fa-spin" style={{marginLeft: "10px"}}></i> : null}
						</button>
					)}
				</div>
			</div>
		);
	}
}

export default ExchangeWidget;