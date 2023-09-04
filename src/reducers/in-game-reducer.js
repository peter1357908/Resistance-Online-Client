import { Phase } from '../resources/phase';
import MissionStatus from '../resources/mission-status';
import { ActionTypes } from '../actions';

// some of these values in initialState are intentionally initialized to something so that there's something to display
const initialState = {
  playerID: 'player1',
  playerIDs: ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'],
  currentLeader: 'player1', // whose turn it is
  currentMission: 2,
  missionSize: 2, // how many players we need on the current mission,
  missionSizes: [2, 3, 2, 3, 3],
  currentRound: 1,
  missionStatuses: [
    MissionStatus.FAILED, // the success/failure status of all 5 missions
    MissionStatus.TBD,
    MissionStatus.TBD,
    MissionStatus.TBD,
    MissionStatus.TBD,
  ],
  selectedPlayers: ['player1', 'player2'], // i.e. which cards should be displayed as enlarged and glowing
  numSelectedPlayers: 2, // this is not really needed, but it's fixing a bug where the board doesn't refresh when selectedPlayers changes
  gamePhase: Phase.VIEWING_TEAM,
  waitingFor: ['player3', 'player4', 'player5'], // the players we're waiting on
  faction: 'resistance',
  spies: ['player1', 'player2'], // empty if you're not a spy
  votes: ['APPROVE', 'REJECT', 'APPROVE', 'APPROVE', 'APPROVE', 'REJECT'], // how people voted on the most recent round
  roundOutcome: '', // the outcome of the most recent round vote (either 'APPROVED' or 'REJECTED')
  // ^ we may eventually find a better structure to store the votes
  acted: false, // whether or not the player has done the action required in the current round, e.g., clicking "ok", voting, etc.
  modalToDisplay: '', // valid values are: '', 'SUCCEEDED', 'FAILED', 'RESISTANCE' (indicating resistance won), and 'SPY'
  numFailVotes: 0, // how many fail votes the most recent mission received
};

const InGameReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_PLAYER_ID:
      return { ...state, playerID: action.playerID };
    case ActionTypes.SET_PLAYER_IDS:
      return { ...state, playerIDs: action.playerIDs };
    case ActionTypes.SET_CURRENT_LEADER:
      return { ...state, currentLeader: action.currentLeader };
    case ActionTypes.SET_CURRENT_MISSION:
      return { ...state, currentMission: action.currentMission };
    case ActionTypes.SET_MISSION_SIZE:
      return { ...state, missionSize: action.missionSize };
    case ActionTypes.SET_MISSION_SIZES:
      return { ...state, missionSizes: action.missionSizes };
    case ActionTypes.SET_CURRENT_ROUND:
      return { ...state, currentRound: action.currentRound };
    case ActionTypes.SET_MISSION_STATUSES:
      return { ...state, missionStatuses: action.missionStatuses };
    case ActionTypes.SET_MISSION_STATUS: {
      const newMissionStatuses = state.missionStatuses.slice();
      newMissionStatuses[action.mission - 1] = action.missionStatus;
      return { ...state, missionStatuses: newMissionStatuses };
    }
    case ActionTypes.SET_SELECTED_PLAYERS:
      return { ...state, numSelectedPlayers: action.selectedPlayers.length, selectedPlayers: action.selectedPlayers };
    case ActionTypes.SET_GAME_PHASE:
      return { ...state, gamePhase: action.phase };
    case ActionTypes.SET_WAITING_FOR:
      return { ...state, waitingFor: action.waitingFor };
    case ActionTypes.SET_FACTION:
      return { ...state, faction: action.faction };
    case ActionTypes.SET_SPIES:
      return { ...state, spies: action.spies };
    case ActionTypes.SET_VOTES:
      return { ...state, votes: action.votes };
    case ActionTypes.SET_ROUND_OUTCOME:
      return { ...state, roundOutcome: action.roundOutcome };
    case ActionTypes.SET_ACTED:
      return { ...state, acted: action.acted };
    case ActionTypes.SET_MODAL_TO_DISPLAY:
      return { ...state, modalToDisplay: action.modalToDisplay };
    case ActionTypes.SET_NUM_FAIL_VOTES:
      return { ...state, numFailVotes: action.numFailVotes };
    default:
      return state;
  }
};

export default InGameReducer;
