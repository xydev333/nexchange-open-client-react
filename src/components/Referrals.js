import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import Helpers from '../helpers';
import config from '../config';


class Referrals extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		axios.interceptors.request.use(function (requestConfig) {
			let referral = (config.REFERRAL_CODE ? config.REFERRAL_CODE : localStorage.getItem('referral'));

		    if (referral && requestConfig.url && requestConfig.url.indexOf(config.NAME.toLowerCase()) > -1)
			    requestConfig.headers['HTTP_X_REFERRAL_TOKEN'] = referral;

		    return requestConfig;
		  }, function (error) {
		    return Promise.reject(error);
		  });
	}

	isRef() {
		let url = window.location.search.substring(1),
			params = url.split('&');

		for (let i = 0; i < params.length; i++) {
			let param = params[i].split('=');

			if (param[0] == 'ref') {
				localStorage.setItem('referral', param[1]);
				return true;
			}
		}

		return false;
	}

	redirectRef() {
		let urlWithoutRef = window.location.pathname + window.location.search + window.location.hash;
		urlWithoutRef = urlWithoutRef.substring(0, urlWithoutRef.indexOf('?'));

		return <Redirect to={urlWithoutRef} />
	}

	render() {
		let params = Helpers.urlParams();
		if (params != null && params.hasOwnProperty('ref')) {
			localStorage.setItem('referral', params['ref']);
			return this.redirectRef();
		}

	    return null;
	}
}

export default Referrals;
