import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { errorAlert, setWallet } from 'Actions/index.js';
import validateWalletAddress from 'Utils/validateWalletAddress';
import i18n from '../i18n';

class WalletAddress extends Component {
  constructor(props) {
    super(props);

    this.state = { address: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let address = event.target.value.replace(new RegExp(/ /g, 'g'), '');
    const valid = validateWalletAddress(
      address,
      this.props.selectedCoin.receive,
      () =>
        this.props.errorAlert({
          show: true,
          message: `${address} ${i18n.t('error.novalid')} ${
            this.props.selectedCoin.receive
          } ${i18n.t('generalterms.address')}.`,
        }),
      () => this.props.errorAlert({ show: false })
    );

    this.setState({ address });

    this.props.setWallet({
      address: address,
      valid: valid,
      show: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  UNSAFE_componentWillMount() {
    this.props.setWallet({ address: '', valid: false, show: false });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.wallet.address !== null && nextProps.wallet.address !== this.state.address) {
      this.setState({ address: nextProps.wallet.address });
    }
  }

  render() {
    return (
	<I18n ns="translations">
	{(t) => (
      <div id="wallet-address" className={this.props.wallet.show ? 'col-xs-12 active' : 'col-xs-12'}>
        <form className="form-group label-floating has-warning" onSubmit={this.handleSubmit}>
          <label htmlFor="withdraw-addr" className="control-label text-green">
            <Interpolate i18nKey="generalterms.youraddress" selectedCoin={this.props.selectedCoin.receive} />
            {/* 
             =>
               Your selectedCoin Address
            */}
          </label>

          <input
            type="text"
            ref={this.props.inputRef}
            className="form-control addr"
            id="withdraw-addr"
            onChange={this.handleChange}
            value={this.state.address}
          />
        </form>
      </div>
	)}
	</I18n>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedCoin: state.selectedCoin,
    wallet: state.wallet,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      errorAlert: errorAlert,
      setWallet: setWallet,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletAddress);
