import React, { Component } from 'react';
/* eslint-disable no-nested-ternary */
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MissionStatus from '../../resources/mission-status';
import BottomButtons from './bottom-buttons';
import TopText from './top-text';
import { Phase } from '../../resources/phase';
import socket from '../../socketConfig';

function mapStateToProps(reduxState) {
  return {
    playerID: reduxState.inGame.playerID,
    currentLeader: reduxState.inGame.currentLeader,
    missionStatuses: reduxState.inGame.missionStatuses,
    playerIDs: reduxState.inGame.playerIDs,
    currentRound: reduxState.inGame.currentRound,
    selectedPlayers: reduxState.inGame.selectedPlayers,
    numSelectedPlayers: reduxState.inGame.numSelectedPlayers,
    currentMission: reduxState.inGame.currentMission,
    gamePhase: reduxState.inGame.gamePhase,
    missionSize: reduxState.inGame.missionSize,
    missionSizes: reduxState.inGame.missionSizes,
    votes: reduxState.inGame.votes,
  };
}

class GameBoard extends Component {
  cardClicked = (ID) => {
    if (this.props.currentLeader === this.props.playerID && this.props.gamePhase === Phase.SELECTING_TEAM) {
      socket.emit('inGame', { action: 'cardClicked', cardPlayerID: ID });
    }
  }

  renderPlayerVote = (ID) => {
    const formalVote = this.props.votes[this.props.playerIDs.indexOf(ID)];
    const vote = formalVote === 'APPROVE' ? 'yes'
      : formalVote === 'REJECT' ? 'no' : 'unclear';
    const className = `player-vote ${vote}`;

    return (
      <div className={className}>
        {vote}
      </div>
    );
  }

  render() {
    const missions = this.props.missionStatuses.map((status, index) => {
      const key = index + 1; // note that key isn't allowed to be index

      const currentString = (index + 1) === this.props.currentMission ? 'current' : '';
      const statusString = status === MissionStatus.SUCCEEDED ? 'succeeded'
        : status === MissionStatus.FAILED ? 'failed'
          : status === MissionStatus.TBD ? '' : 'something-went-wrong';
      const className = `mission ${statusString} ${currentString}`;

      return (
        <div key={key} className={className}>
          <div className="mission-text">
            Mission {index + 1}
          </div>
          <div>
            {this.props.missionSizes[index]}
          </div>
        </div>
      );
    });

    const players = this.props.playerIDs.map((ID) => {
      const selectedString = this.props.selectedPlayers.includes(ID) ? 'selected' : 'not-selected';
      const hoverableString = this.props.currentLeader === this.props.playerID
        && (this.props.selectedPlayers.includes(ID) || this.props.numSelectedPlayers < this.props.missionSize) ? 'hoverable' : '';
        // numSelectedPlayers is used to force a refresh when selectedPlayers changes (ask Will for details)
      const className = `player-card ${selectedString} ${hoverableString}`;
      return (
        <div role="button" tabIndex="0" key={ID} className={className} onClick={() => this.cardClicked(ID)}>
          <div className="playerID">
            {ID}
          </div>
          {this.props.gamePhase === Phase.VIEWING_VOTES && this.renderPlayerVote(ID)}
        </div>
      );
    });

    return (
      <div className="game-board-container">
        <div className="shade">
          <TopText />
          <div className="missions">
            {missions}
          </div>
          <div className="current-round">
            Attempt to approve team: {this.props.currentRound} (of 5)
          </div>
          <div className="player-cards">
            {players}
          </div>
          <BottomButtons />
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, null)(GameBoard));
