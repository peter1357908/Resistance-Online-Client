import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router';
import {
  setSessionID, setCurrentPlayerID, setCreatorID, setPlayerID,
} from '../actions';
import socket from '../socketConfig';

function isEmptyOrSpaces(str) {
  return str === null || str === undefined || str === '' || str.match(/^ *$/) !== null;
}

class JoinGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionID: '',
      password: '',
      playerID: '',
      failed: false,
      failMessage: '',
    };
  }

  componentDidMount() {
    socket.on('joinGame', (result) => {
      if (result.playerID === null) {
        this.setState({ failed: true, failMessage: result.failMessage });
      } else {
        this.props.setSessionID(result.sessionID);
        this.props.setCurrentPlayerID(result.playerID);
        this.props.setPlayerID(result.playerID);
        this.props.setCreatorID(result.creatorID);
        this.props.history.push('/lobby');
      }
    });
  }

  componentWillUnmount() {
    socket.off('joinGame');
  }

  onChangeSessionID = (event) => {
    this.setState({ sessionID: event.target.value });
  }

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  onChangePlayerID = (event) => {
    this.setState({ playerID: event.target.value });
  }

  onClickJoin = (event) => {
    const sessionInfo = {
      sessionID: this.state.sessionID,
      password: this.state.password,
      playerID: this.state.playerID,
      failed: false,
    };
    socket.emit('joinGame', sessionInfo);
  }

  onClickBack = (event) => {
    this.props.history.push('/');
  }

  renderJoinButton = () => {
    if (isEmptyOrSpaces(this.state.sessionID) || isEmptyOrSpaces(this.state.playerID) || isEmptyOrSpaces(this.state.password)) {
      return (
        <Button variant="primary" onClick={this.onClickJoin} disabled>
          Join
        </Button>
      );
    }
    return (
      <Button variant="primary" onClick={this.onClickJoin}>
        Join
      </Button>
    );
  }

  render() {
    return (
      <div className="vertical-flex join-game-container">
        {/* alert is probably not the best choice for notification of failure here */}
        {this.state.failed ? <Alert variant="danger">{this.state.failMessage}</Alert> : <></>}
        <div className="title-text">
          Join a Game
        </div>
        <div className="input-container">
          <Form.Control type="input" onChange={this.onChangeSessionID} value={this.state.sessionID} placeholder="Session ID" />
          <Form.Control type="input" onChange={this.onChangePassword} value={this.state.password} placeholder="Session Password" />
          <Form.Control type="input" onChange={this.onChangePlayerID} value={this.state.playerID} placeholder="PlayerID (this will be your in-game name)" />
        </div>
        <div className="horizontal-flex-center bottom-navigation">
          {this.renderJoinButton()}
          <Button variant="primary" onClick={this.onClickBack}>
            Back
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, {
  setSessionID, setCurrentPlayerID, setCreatorID, setPlayerID,
})(JoinGame));
