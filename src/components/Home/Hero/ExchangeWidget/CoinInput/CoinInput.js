import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'Utils/debounce';
import { fetchPrice } from 'Actions/index.js';
import CoinSelector from './CoinSelector/CoinSelector';
import styles from './CoinInput.scss';

class CoinInput extends PureComponent {
  state = {
    value: '...',
  };

  handleFocus = event => {
    if (event.target.value === '...') {
      this.setState({ value: '' });
    }
  };

  handleBlur = event => {
    if (event.target.value === '') {
      this.setState({ value: '...' });
    }
  };

  handleChange = event => {
    let { value } = event.target;
    const re = /^[0-9.,\b]+$/;
    if (!re.test(value) && value !== '') return;

    value = value.replace(/,/g, '.');
    this.setState({ value });
    this.fetchAmounts(value);

    ga('send', 'event', 'Order', 'change amount');
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit();
  };

  fetchAmounts = debounce(value => {
    const pair = `${this.props.selectedCoin.receive}${this.props.selectedCoin.deposit}`;
    const data = {
      pair,
      lastEdited: this.props.type,
    };

    data[this.props.type] = value;

    if (value.length) {
      this.props.fetchPrice(data);
    }
  }, 600);

  focus = () => {
    this.nameInput.focus();
  };

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.price.fetching) {
      console.log('FETCHING PRICE');

      return;
    }

    if (nextProps.type === 'receive') {
      this.setState({ value: nextProps.price.receive });
    } else if (nextProps.type === 'deposit') {
      this.setState({ value: nextProps.price.deposit });
    }
  };

  render() {
    return (
      <div className="col-xs-12 col-sm-6">
        <form className="form-group" onSubmit={this.handleSubmit}>
          <label htmlFor={this.props.type} className={styles.label}>
            {this.props.type}
          </label>
          <input
            type="text"
            className={`form-control ${styles.input}`}
            id={`coin-input-${this.props.type}`}
            name={this.props.type}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.value}
            ref={input => {
              this.nameInput = input;
            }}
          />
        </form>

        <CoinSelector type={this.props.type} onSelect={this.focus} />
      </div>
    );
  }
}

const mapStateToProps = ({ selectedCoin, price }) => ({ selectedCoin, price });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchPrice }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinInput);
