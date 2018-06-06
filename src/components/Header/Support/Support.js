import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setUserEmail } from 'Actions';
import config from 'Config';

class Support extends Component {
  state = {
    loading: false,
    success: null,
    showForm: true,
  };

  componentDidMount() {
    if (this.props.email.value) {
      this.setState({
        email: this.props.email.value,
        emailFetched: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.show !== this.props.show) {
      this.setState({
        show: this.props.show,
      });
    }

    if (prevProps.email !== this.props.email) {
      if (this.props.email.value) {
        this.setState({
          email: this.props.email.value,
          emailFetched: true,
        });
      }
    }
  }

  handleSubmit = event => {
    event.preventDefault();

    this.setState({ loading: true });

    this.props.setUserEmail(this.state.email);

    axios({
      method: 'post',
      contentType: 'application/json',
      url: `${config.API_BASE_URL}/support/`,
      headers: { Authorization: 'Bearer ' + localStorage.token },
      data: {
        email: this.state.email,
        name: this.state.name,
        telephone: this.state.telephone,
        message: this.state.message,
        subject: this.state.subject,
      },
    })
      .then(response => {
        this.setState({ loading: false, showForm: false, success: true });
      })
      .catch(error => {
        this.setState({ loading: false, showForm: false, success: false });
      });
  };

  close = () => {
    this.setState({ success: null, showForm: true });
    this.props.onClose();
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <Modal id="support" show={this.state.show} onHide={this.close}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={this.close}>
              <i className="material-icons">clear</i>
            </button>
            <h4 className="modal-title">Support</h4>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <h3>Phone</h3>
                <p onClick={() => ga('send', 'event', 'General', 'click support number')}>
                  +442081442192<br />
                  +16464612858 (US)
                </p>
              </div>

              <div className="col-xs-12 col-sm-6">
                <h3>Email</h3>
                <p>
                  <a href="mailto:support@nexchange.io">support@nexchange.io</a>
                </p>
              </div>
            </div>

            <form id="support-form" onSubmit={this.handleSubmit}>
              {this.state.success === true ? (
                <h4 className="text-success">Your form has been successfully submitted. We'll get back to you shortly!</h4>
              ) : null}
              {this.state.success === false ? (
                <h4 className="text-danger">Something went wrong during the form submission, please try again later.</h4>
              ) : null}

              {this.state.showForm ? (
                <div>
                  <div className="form-group is-empty">
                    <input
                      type="name"
                      name="name"
                      className="form-control"
                      placeholder="Name"
                      onChange={this.handleInputChange}
                      value={this.state.name}
                      required
                    />
                  </div>

                  <div className="form-group is-empty">
                    <input
                      type="telephone"
                      name="telephone"
                      className="form-control"
                      placeholder="Telephone"
                      onChange={this.handleInputChange}
                      value={this.state.telephone}
                    />
                  </div>

                  <div className="form-group is-empty">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      onChange={this.handleInputChange}
                      value={this.state.email}
                      disabled={this.state.emailFetched}
                      required
                    />
                  </div>

                  <div className="form-group is-empty">
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder="Subject"
                      onChange={this.handleInputChange}
                      value={this.state.subject}
                    />
                  </div>

                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Message"
                    rows="2"
                    onChange={this.handleInputChange}
                    value={this.state.message}
                    required
                  />

                  <button type="submit" className="btn btn-themed btn-md" disabled={this.state.loading ? 'disabled' : null}>
                    Send
                    {this.state.loading ? <i className="fab fa-spinner fa-spin" style={{ marginLeft: '10px' }} /> : null}
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-simple"
                    data-dismiss="modal"
                    onClick={this.close}
                    style={{ float: 'right', padding: '15px 0 0 0' }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger btn-simple"
                  data-dismiss="modal"
                  onClick={this.close}
                  style={{ padding: '0' }}
                >
                  Close
                </button>
              )}
            </form>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = ({ email }) => ({ email });
const mapDistachToProps = dispatch => bindActionCreators({ setUserEmail }, dispatch);

export default connect(
  mapStateToProps,
  mapDistachToProps
)(Support);
