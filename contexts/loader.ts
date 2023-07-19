import { Dispatch } from 'react';
import createDataContext from './createDataContext';

interface State {
  on: boolean;
  text?: string | null;
  set: (on: boolean, text?: string | null) => void;
}
type ActionType = { type: 'on'; text?: string | null } | { type: 'off' };

const userReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'on': {
      return {
        ...state,
        text: action.text,
        on: true,
      };
    }
    case 'off': {
      return {
        ...state,
        text: null,
        on: false,
      };
    }
    default:
      return state;
  }
};

const set = (dispatch: Dispatch<ActionType>) => {
  return (on: boolean, text?: string | null) => {
    dispatch({
      type: on ? 'on' : 'off',
      text,
    });
  };
};
export const { useContext, Provider } = createDataContext(
  userReducer,
  { set },
  {
    on: true,
    set: (on: boolean, text?: string | null) => {},
  }
);
