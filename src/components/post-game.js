/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import SideBar from './sidebar';
import socket from '../socketConfig';
import { setActed } from '../actions';

function mapStateToProps(reduxState) {
  return {
    waitingFor: reduxState.inGame.waitingFor,
    acted: reduxState.inGame.acted,
    spies: reduxState.inGame.spies,
    victoriousFaction: reduxState.postGame.victoriousFaction,
    gameHistory: reduxState.postGame.gameHistory,
  };
}

class PostGame extends Component {
  renderHeader = () => {
    if (this.props.victoriousFaction === 'RESISTANCE') {
      return (
        <div className="post-game-header">
          <div className="icon-resistance" />
          <div className="victorious-faction resistance">
            Resistance won
          </div>
          <div className="icon-resistance" />
        </div>
      );
    }
    return (
      <div className="post-game-header">
        <div className="icon-spy" />
        <div className="victorious-faction spy">
          Spies won
        </div>
        <div className="icon-spy" />
      </div>
    );
  }

  stringifySpies = () => {
    const num = this.props.spies.length;
    switch (num) {
      case 2:
        return `${this.props.spies[0]} and ${this.props.spies[1]}`;
      case 3:
        return `${this.props.spies[0]}, ${this.props.spies[1]}, and ${this.props.spies[2]}`;
      case 4:
        return `${this.props.spies[0]}, ${this.props.spies[1]}, ${this.props.spies[2]}, and ${this.props.spies[3]}`;
      default:
        return 'uh-oh, an error occured';
    }
  }

  renderSpies = () => {
    return (
      <div className="spies-listing">
        Spies: {this.stringifySpies()}
      </div>
    );
  }

  renderRoundPlayerAndVote = (playerID, vote, round) => {
    const leader = playerID === round.roundLeader ? 'leader' : '';
    const onMission = round.proposedTeam.includes(playerID) ? 'on-mission' : '';
    const playerClassName = `player ${leader} ${onMission}`;
    const shortVote = vote === 'APPROVE' ? 'yes'
      : vote === 'REJECT' ? 'no' : 'unclear';
    return (
      <div className="player-and-round-vote" key={playerID}>
        <div className={playerClassName}>
          {playerID}
        </div>
        <div>
          -
        </div>
        <div className={shortVote}>
          {shortVote},
        </div>
      </div>
    );
  }

  renderRoundReport = (round, roundIndex) => {
    const key = roundIndex + 1;
    return (
      <div className="round-report" key={key}>
        <div className="round-report-number">
          Round {roundIndex + 1}
        </div>
        {Object.entries(round.roundVoteComposition).map((pair) => this.renderRoundPlayerAndVote(pair[0], pair[1], round))}
      </div>
    );
  }

  renderMissionPlayerAndVote = (playerID, vote, mission) => {
    return (
      <div className="mission-and-player-vote" key={playerID}>
        <div>
          {playerID}-
        </div>
        <div className={vote}>
          {vote}
        </div>
      </div>
    );
  }

  renderMissionVotes = (mission) => {
    return (
      <div className="mission-vote-report">
        <div className="header-text">
          Mission Actions
        </div>
        {Object.entries(mission.missionVoteComposition).map((pair) => this.renderMissionPlayerAndVote(pair[0], pair[1], mission))}
      </div>
    );
  }

  renderMissionReport = (mission, missionIndex) => {
    const missionOutcomeClass = mission.missionOutcome === 'SUCCEEDED' ? 'mission-outcome resistance'
      : mission.missionOutcome === 'FAILED' ? 'mission-outcome spy' : 'unclear';

    const key = missionIndex + 1;
    return (
      <div className="mission-report" key={key}>
        <div className="mission-number-and-outcome">
          <div className="mission-number">
            Mission {missionIndex + 1} -
          </div>
          <div className={missionOutcomeClass}>
            {mission.missionOutcome}
          </div>
        </div>
        {mission.rounds.map((round, index) => this.renderRoundReport(round, index))}
        {this.renderMissionVotes(mission)}
      </div>
    );
  }

  renderMissionReports = () => {
    return (
      <div className="mission-reports">
        <div className="legend">
          (Note: leaders are <span className="italicized">italicized</span> and players on the proposed team are <span className="circled">circled</span>)
        </div>
        {this.props.gameHistory.missions.map((mission, index) => this.renderMissionReport(mission, index))}
      </div>
    );
  }

  doneButtonClick = () => {
    socket.emit('postGame', { action: 'finishViewingGameHistory' });
    this.props.setActed(true);
  }

  getWaitingFor = () => {
    const n = this.props.waitingFor.length;
    switch (n) {
      case 0:
        return 'nobody';
      case 1:
        return `${this.props.waitingFor[0]}`;
      case 2:
        return `${this.props.waitingFor[0]} and ${this.props.waitingFor[1]}`;
      case 3:
        return `${this.props.waitingFor[0]}, ${this.props.waitingFor[1]}, and ${this.props.waitingFor[2]}`;
      default:
        return `${n} players`;
    }
  }

  renderDoneButton = () => {
    if (!this.props.acted) {
      return (
        <Button variant="primary" className="bottom" onClick={() => this.doneButtonClick()}>
          Done
        </Button>
      );
    }
    return (
      <div className="bottom waitingFor">
        Waiting for {this.getWaitingFor()} so that the game can return to the lobby
      </div>
    );
  }

  render() {
    return (
      <div className="game-container">
        <SideBar />
        <div className="post-game-container">
          <div className="shade">
            {this.renderHeader()}
            {this.renderSpies()}
            {this.renderMissionReports()}
            {this.renderDoneButton()}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, { setActed })(PostGame));
