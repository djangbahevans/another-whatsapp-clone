import { User } from './types';

export const initialState = {
  user: null,
};

export const actionTypes = {
  SET_USER: 'SET_USER',
} as const;

export type State = {
  user: User | null;
};

const reducer = (
  state: State,
  action: { type: 'SET_USER'; payload: User | null }
) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
