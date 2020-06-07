import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Phase } from '../../resources/phase';

function mapStateToProps(reduxState) {
  return {
    gamePhase: reduxState.inGame.gamePhase,
    numSelectedPlayers: reduxState.inGame.numSelectedPlayers, // I'm using this to force a refresh when selectedPlayers changes (ask Will for details)
    playerID: reduxState.inGame.playerID,
    currentLeader: reduxState.inGame.currentLeader,
    missionSize: reduxState.inGame.missionSize,
    acted: reduxState.inGame.acted,
    waitingFor: reduxState.inGame.waitingFor,
    selected: reduxState.inGame.selectedPlayers,
    roundOutcome: reduxState.inGame.roundOutcome,
  };
}

class TopText extends Component {
  getWaitingFor = () => {
    const num = this.props.waitingFor.length;
    if (num === 0) {
      return '';
    } else if (num > 3) {
      return `${num} players`;
    }
    let concat = this.props.waitingFor[0].toString();
    for (let i = 1; i < num; i += 1) {
      concat = concat.concat(', ');
      concat += this.props.waitingFor[i];
    }
    return concat;
  }

  getText = () => {
    switch (this.props.gamePhase) {
      case Phase.SELECTING_TEAM:
        if (this.props.playerID === this.props.currentLeader) {
          return `Select ${this.props.missionSize} players to be on the mission`;
        }
        return `${this.props.currentLeader} is selecting ${this.props.missionSize} players to be on the mission`;
      case Phase.VOTING_ON_TEAM:
        if (this.props.acted === false) {
          return 'Do you approve this team?';
        }
        return `Waiting for ${this.getWaitingFor()}`;
      case Phase.VIEWING_VOTES:
        if (this.props.acted) {
          return `Waiting for ${this.getWaitingFor()}`;
        } else {
          return `The team was ${this.props.roundOutcome}`;
        }
      case Phase.MISSION:
        if (this.props.selected.includes(this.props.playerID) && this.props.acted === false) {
          return 'Choose how you want to act on the mission';
        }
        return `Mission is ongoing. Waiting for ${this.getWaitingFor()}`;
      default:
        return 'We don\'t really know what\'s happening right now';
    }
  }

  render() {
    return (
      <div className="top-text">
        {this.getText()}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, null)(TopText));
