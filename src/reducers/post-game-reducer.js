import { ActionTypes } from '../actions';

const initialState = {
  victoriousFaction: '',
  gameHistory: {
    missions: [
      {
        missionOutcome: 'FAILED',
        missionVoteComposition: {
          player1: 'SUCCESS',
          player2: 'FAIL',
        },
        rounds: [
          {
            roundOutcome: 'REJECTED',
            roundLeader: 'player1',
            proposedTeam: ['player1', 'player2'],
            roundVoteComposition: {
              player1: 'REJECT',
              player2: 'APPROVE',
              player3: 'REJECT',
              player4: 'REJECT',
              player5: 'REJECT',
              player6: 'REJECT',
            },
          },
        ],
      },
    ],
  },
};

const PostGameReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_VICTORIOUS_FACTION:
      return { ...state, victoriousFaction: action.victoriousFaction };
    case ActionTypes.SET_GAME_HISTORY:
      return { ...state, gameHistory: action.gameHistory };
    default:
      return state;
  }
};

export default PostGameReducer;
