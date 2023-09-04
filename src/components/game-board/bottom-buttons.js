import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router';
import socket from '../../socketConfig';
import { Phase } from '../../resources/phase';
import { setActed } from '../../actions';

function mapStateToProps(reduxState) {
  return {
    playerID: reduxState.inGame.playerID,
    currentLeader: reduxState.inGame.currentLeader,
    selectedPlayers: reduxState.inGame.selectedPlayers,
    numSelectedPlayers: reduxState.inGame.numSelectedPlayers, // I'm using this to force a refresh when selectedPlayers changes (ask Will for details)
    missionSize: reduxState.inGame.missionSize,
    gamePhase: reduxState.inGame.gamePhase,
    acted: reduxState.inGame.acted,
  };
}

class BottomButtons extends Component {
  submitSelectedTeam = () => {
    socket.emit('inGame', { action: 'proposeTeam', proposedTeam: this.props.selectedPlayers });
  }

  submitVote = (voteType) => {
    this.props.setActed(true);
    socket.emit('inGame', { action: 'voteOnTeamProposal', voteType });
  }

  submitVotesViewed = () => {
    this.props.setActed(true);
    socket.emit('inGame', { action: 'votesViewed' });
  }

  submitMissionVote = (voteType) => {
    this.props.setActed(true);
    socket.emit('inGame', { action: 'voteOnMissionOutcome', voteType });
  }

  renderEmptyButtons = () => {
    return (
      <div className="horizontal-flex-center bottom-navigation">
        <Button variant="primary" className="hidden" onClick={this.thisMethodDoesNotExist} />
      </div>
    );
  }

  renderButtonsForSelectingTeam = () => {
    if (this.props.selectedPlayers.length === this.props.missionSize && this.props.currentLeader === this.props.playerID) {
      return (
        <div className="horizontal-flex-center bottom-navigation">
          <Button variant="primary" onClick={this.submitSelectedTeam}>
            Done
          </Button>
        </div>
      );
    } else {
      return this.renderEmptyButtons();
    }
  }

  renderButtonsForVotingOnTeam = () => {
    if (this.props.acted === true) {
      return (
        <div className="horizontal-flex-center bottom-navigation">
          <Button variant="primary" className="hidden" onClick={this.thisMethodDoesNotExist} />
        </div>
      );
    }
    return (
      <div className="horizontal-flex-center bottom-navigation">
        <Button variant="primary" onClick={() => this.submitVote('APPROVE')}>
          Yes
        </Button>
        <Button variant="danger" className="negative" onClick={() => this.submitVote('REJECT')}>
          No
        </Button>
      </div>
    );
  }

  renderButtonsForViewingVotes = () => {
    if (this.props.acted === false) {
      return (
        <div className="horizontal-flex-center bottom-navigation">
          <Button variant="primary" onClick={this.submitVotesViewed}>
            Ok
          </Button>
        </div>
      );
    } else {
      return this.renderEmptyButtons();
    }
  }

  renderButtonsForMission = () => {
    if (this.props.selectedPlayers.includes(this.props.playerID) && this.props.acted === false) {
      return (
        <div className="horizontal-flex-center bottom-navigation">
          <Button variant="primary" onClick={() => this.submitMissionVote('SUCCEED')}>
            Succeed
          </Button>
          <Button variant="danger" className="negative" onClick={() => this.submitMissionVote('FAIL')}>
            Fail
          </Button>
        </div>
      );
    } else {
      return this.renderEmptyButtons();
    }
  }

  render() {
    switch (this.props.gamePhase) {
      case Phase.SELECTING_TEAM:
        return this.renderButtonsForSelectingTeam();
      case Phase.VOTING_ON_TEAM:
        return this.renderButtonsForVotingOnTeam();
      case Phase.VIEWING_VOTES:
        return this.renderButtonsForViewingVotes();
      case Phase.MISSION:
        return this.renderButtonsForMission();
      default:
        return this.renderEmptyButtons();
    }
  }
}

export default withRouter(connect(mapStateToProps, { setActed })(BottomButtons));
