import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setUserEmail } from 'Actions';
import OrderNotifications from './OrderNotifications/OrderNotifications';
import OrderReferrals from './OrderReferrals/OrderReferrals';
import config from 'Config';

class OrderCta extends Component {
  state = {
    email: '',
    message: {
      text: '',
      error: false,
    },
    show: false,
  };

  componentDidMount() {
    console.log('yo');

    axios
      .get(`${config.API_BASE_URL}/users/me/orders/${this.props.order.unique_reference}`)
      .then(data => {
        this.setState({ show: true });
      })
      .catch(error => {
        this.setState({ show: false });
      });

    if (this.props.email.value) {
      this.setState({
        email: this.props.email.value,
        emailFetched: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.email !== this.props.email) {
      if (this.props.email.message) {
        this.setState({ message: this.props.email.message });
      }

      if (this.props.email.value) {
        this.setState({
          email: this.props.email.value,
          emailFetched: true,
        });
      }
    }
  }

  handleChange = event => {
    this.setState({
      email: event.target.value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.setUserEmail(this.state.email);
  };

  render() {
    console.log(!this.props.email.value, this.state.show);

    return (
      <div>
        {!this.props.email.value &&
          this.state.show && (
            <OrderNotifications
              order={this.props.order}
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange}
              email={this.state.email}
              message={this.state.message}
            />
          )}

        {this.props.email.value && this.state.show && <OrderReferrals order={this.props.order} />}
      </div>
    );
  }
}

const mapStateToProps = ({ email }) => ({ email });
const mapDistachToProps = dispatch => bindActionCreators({ setUserEmail }, dispatch);

export default connect(
  mapStateToProps,
  mapDistachToProps
)(OrderCta);
