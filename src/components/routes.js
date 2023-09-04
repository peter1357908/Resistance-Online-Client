import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import socket from '../socketConfig';
import Welcome from './welcome';
import JoinGame from './join-game';
import CreateGame from './create-game';
import Lobby from './lobby';
import InGame from './in-game';
import PostGame from './post-game';
import { Phase } from '../resources/phase';
import MissionStatus from '../resources/mission-status';
import {
  // lobby state
  setCreatorID,
  setFailed,
  setFailMessage,
  // in-game state
  setPlayerID,
  setPlayerIDs,
  setCurrentLeader,
  setCurrentMission,
  setMissionSize,
  setMissionSizes,
  setCurrentRound,
  setMissionStatuses,
  setMissionStatus,
  setSelectedPlayers,
  setGamePhase,
  setWaitingFor,
  setFaction,
  setSpies,
  setVotes,
  setRoundOutcome,
  setActed,
  setModalToDisplay,
  setNumFailVotes,
  // post-game state
  setVictoriousFaction,
  setGameHistory,
}
  from '../actions';

function mapStateToProps(reduxState) {
  return {
    // lobby state
    sessionID: reduxState.lobby.sessionID,
    playerIDs: reduxState.lobby.playerIDs,
    lobbyPlayerID: reduxState.lobby.currentPlayerID,
    // ingame state
    selectedPlayers: reduxState.inGame.selectedPlayers,
    numSelectedPlayers: reduxState.inGame.numSelectedPlayers,
    missionSize: reduxState.inGame.missionSize,
  };
}

class Router extends Component {
  componentDidMount() {
    // start listening on lobby
    socket.on('lobby', (result) => {
      switch (result.action) {
        case 'gameStarted':
          this.props.history.push(`/in-game/${this.props.sessionID}`);
          break;
        case 'someoneQuit':
          this.props.setPlayerIDs(result.playerIDs);
          this.props.setCreatorID(result.creatorID);
          break;
        case 'someoneJoined':
          this.props.setPlayerIDs(result.playerIDs);
          this.props.setCreatorID(result.creatorID);
          break;
        case 'quitAcknowledged':
          this.props.history.push('/');
          break;
        case 'fail':
          this.props.setFailed(true);
          this.props.setFailMessage(result.failMessage);
          break;
        default:
          console.log(`unknown action received from server: ${result.action}`);
          break;
      }
    });

    // start listening on inGame
    socket.on('inGame', (result) => {
      switch (result.action) {
        case 'gameStarted':
          this.props.setPlayerID(this.props.lobbyPlayerID); // move copy the playerID from lobby to in-game
          this.props.setPlayerIDs(result.playerIDs);
          this.props.setGamePhase(Phase.VIEWING_TEAM);
          this.props.setFaction('resistance'); // by default, you're on the resistance
          this.props.setSpies([]); // by default, we know of no spies
          this.props.setMissionSizes(result.missionSizes);
          this.props.setActed(false);
          break;
        case 'youAreSpy':
          this.props.setFaction('spy');
          this.props.setSpies(result.spies);
          break;
        case 'waitingFor':
          this.props.setWaitingFor(result.waitingFor);
          break;
        case 'everyoneViewedFaction':
          this.props.setGamePhase(Phase.SELECTING_TEAM);
          this.props.setCurrentLeader(result.currentLeaderID);
          this.props.setCurrentMission(result.currentMission);
          this.props.setMissionSize(result.missionSize);
          this.props.setCurrentRound(result.currentRound);
          this.props.setSelectedPlayers([]);
          this.props.setActed(false);
          this.props.setMissionStatuses([
            MissionStatus.TBD,
            MissionStatus.TBD,
            MissionStatus.TBD,
            MissionStatus.TBD,
            MissionStatus.TBD]);
          break;
        case 'cardClicked':
          if (this.props.selectedPlayers.includes(result.cardPlayerID)) {
            this.props.setSelectedPlayers(this.props.selectedPlayers.filter((e) => e !== result.cardPlayerID));
          } else if (this.props.numSelectedPlayers < this.props.missionSize) {
            this.props.selectedPlayers.push(result.cardPlayerID);
            this.props.setSelectedPlayers(this.props.selectedPlayers);
          }
          break;
        case 'proposeTeam':
          this.props.setActed(false);
          this.props.setSelectedPlayers(result.proposedTeam);
          this.props.setGamePhase(Phase.VOTING_ON_TEAM);
          break;
        case 'roundVotes':
          this.props.setActed(false);
          this.props.setGamePhase(Phase.VIEWING_VOTES);
          this.props.setVotes(this.props.playerIDs.map((ID) => result.voteComposition[ID]));
          this.props.setRoundOutcome(result.roundOutcome);
          this.props.setCurrentRound(result.concludedRound);
          break;
        case 'tooManyRounds':
          this.props.setMissionStatus(result.failedMission, MissionStatus.FAILED);
          break;
        case 'missionStarting':
          this.props.setActed(false);
          this.props.setGamePhase(Phase.MISSION);
          this.props.setSelectedPlayers(result.playersOnMission);
          this.props.setWaitingFor(result.playersOnMission);
          break;
        case 'teamSelectionStarting':
          this.props.setGamePhase(Phase.SELECTING_TEAM);
          this.props.setCurrentLeader(result.currentLeaderID);
          this.props.setCurrentMission(result.currentMission);
          this.props.setMissionSize(result.missionSize);
          this.props.setCurrentRound(result.currentRound);
          this.props.setSelectedPlayers([]);
          break;
        case 'missionVotes':
          this.props.setModalToDisplay(result.missionOutcome);
          this.props.setNumFailVotes(result.numFailVotes);
          if (result.missionOutcome === 'SUCCEEDED') {
            this.props.setMissionStatus(result.concludedMission, MissionStatus.SUCCEEDED);
          } else if (result.missionOutcome === 'FAILED') {
            this.props.setMissionStatus(result.concludedMission, MissionStatus.FAILED);
          }
          break;
        case 'gameFinished':
          this.props.setModalToDisplay(result.victoriousFaction);
          break;
        default:
          console.log('unknown action received from server: ', result.action);
          break;
      }
    });

    // start listening on post-game
    socket.on('postGame', (result) => {
      switch (result.action) {
        case 'gameHistory':
          this.props.setWaitingFor([]);
          this.props.setActed(false);
          this.props.setSpies(result.spies);
          this.props.setGameHistory(result.gameHistory);
          this.props.setVictoriousFaction(result.victoriousFaction);
          break;
        case 'waitingFor':
          if (result.waitingFor.length === 0) {
            this.props.history.push('/lobby');
            this.props.setGamePhase(Phase.VIEWING_TEAM);
            this.props.setVictoriousFaction('');
          }
          this.props.setWaitingFor(result.waitingFor);
          break;
        default:
          console.log('unknown action received from server: ', result.action);
          break;
      }
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/join-game" component={JoinGame} />
        <Route path="/create-game" component={CreateGame} />
        <Route path="/lobby" component={Lobby} />
        <Route path="/in-game/:gameID" component={InGame} />
        <Route path="/post-game/:gameID" component={PostGame} />
        <Route render={() => (<a href="https://www.youtube.com/watch?v=_XR6dsy7ATE">Stop! You&apos;ve violated the law!</a>)} />
      </Switch>
    );
  }
}

export default withRouter(connect(mapStateToProps, {
  // lobby state
  setCreatorID,
  setFailed,
  setFailMessage,
  // in-game state
  setPlayerID,
  setPlayerIDs,
  setCurrentLeader,
  setCurrentMission,
  setMissionSize,
  setMissionSizes,
  setCurrentRound,
  setMissionStatuses,
  setMissionStatus,
  setSelectedPlayers,
  setGamePhase,
  setWaitingFor,
  setFaction,
  setSpies,
  setVotes,
  setRoundOutcome,
  setActed,
  setModalToDisplay,
  setNumFailVotes,
  // post-game state
  setVictoriousFaction,
  setGameHistory,
})(Router));
