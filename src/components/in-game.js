import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import GameBoard from './game-board/game-board';
import FactionReveal from './faction-reveal';
import SideBar from './sidebar';
import { Phase, stringifyPhase } from '../resources/phase';
import MissionSucceededModal from './modals/mission-succeeded-modal';
import MissionFailedModal from './modals/mission-failed-modal';
import ResistanceWinsModal from './modals/resistance-wins-modal';
import SpiesWinModal from './modals/spies-win-modal';
import FactionReminder from './modals/faction-reminder';
import { setModalToDisplay } from '../actions';

function mapStateToProps(reduxState) {
  return {
    gamePhase: reduxState.inGame.gamePhase,
    sessionID: reduxState.lobby.sessionID,
    modalToDisplay: reduxState.inGame.modalToDisplay,
    numFailVotes: reduxState.inGame.numFailVotes,
    faction: reduxState.inGame.faction,
    playerID: reduxState.inGame.playerID,
    spies: reduxState.inGame.spies,
  };
}

class InGame extends Component {
  closeEndGameModal = () => {
    this.props.setModalToDisplay('');
    this.props.history.push(`/post-game/${this.props.sessionID}`);
  }

  render() {
    if (this.props.gamePhase === Phase.VIEWING_TEAM) {
      return (
        <div className="game-container">
          <FactionReveal />
        </div>
      );
    }
    const gamePhaseWrapper = `${stringifyPhase(this.props.gamePhase)}-container`;
    return (
      <div className="game-container">
        <MissionSucceededModal show={this.props.modalToDisplay === 'SUCCEEDED'} closeModal={() => this.props.setModalToDisplay('')} />
        <MissionFailedModal show={this.props.modalToDisplay === 'FAILED'} numFailVotes={this.props.numFailVotes} closeModal={() => this.props.setModalToDisplay('')} />
        <ResistanceWinsModal show={this.props.modalToDisplay === 'RESISTANCE'} faction={this.props.faction} closeModal={() => this.closeEndGameModal()} />
        <SpiesWinModal show={this.props.modalToDisplay === 'SPY'} faction={this.props.faction} closeModal={() => this.closeEndGameModal()} />
        <FactionReminder
          show={this.props.modalToDisplay === 'FACTION_REMINDER'}
          faction={this.props.faction}
          playerID={this.props.playerID}
          spies={this.props.spies}
          closeModal={() => this.props.setModalToDisplay('')}
        />
        <SideBar />
        <div className={gamePhaseWrapper}>
          <GameBoard />
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, { setModalToDisplay })(InGame));
