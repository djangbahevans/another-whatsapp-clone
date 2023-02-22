import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useReducer,
} from 'react';
import reducer, { State } from './reducer';
import { User } from './types';

type ContextType = [
  State,
  Dispatch<{ type: 'SET_USER'; payload: User | null }>
];

export const StateContext = createContext<ContextType>([
  { user: null },
  () => {},
]);

type Props = {
  children?: ReactNode;
  reducer: typeof reducer;
  initialState: State;
};

export const StateProvider: FC<Props> = ({
  reducer,
  initialState,
  children,
}) => {
  const x = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
