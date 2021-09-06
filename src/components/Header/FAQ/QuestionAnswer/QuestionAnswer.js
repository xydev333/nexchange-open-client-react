import React, { Component } from 'react';

class QuestionAnswer extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div className="question-answer">
        <h3 onClick={this.onClick}>
          {this.props.question}{' '}
          <i
            className={`fab fa-${this.state.open ? 'minus' : 'plus'}-square-o`}
            aria-hidden="true"
          />
        </h3>
        <div className={this.state.open ? 'answer active' : 'answer'}>
          {this.props.answer}
        </div>
        <hr />
      </div>
    );
  }
}

export default QuestionAnswer;
