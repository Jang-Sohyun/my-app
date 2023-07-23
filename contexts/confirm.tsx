import { Dispatch } from 'react';
import Alert, { AlertButton as Button } from '../components/Alert';
import createDataContext from './createDataContext';

type Input = {
  label: string;
  type?: 'number' | 'text' | null;
  value: string;
  multiline?: boolean;
  placeholder?: string;
  variant?: string;
  disabled?: boolean;
};
interface State {
  isOpen: boolean;
  title: string;
  body?: string;
  buttons: [Button] | [Button, Button];
  input?: Input | null;
  resolve: ((v: any) => void) | null;
}
type ActionType =
  | {
      type: 'open';
      payload: {
        title: string;
        body?: string;
        buttons: [Button] | [Button, Button];
        input?: Input | null;
        resolve: (v: any) => void;
      };
    }
  | { type: 'close' };

const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'open': {
      return {
        ...state,
        isOpen: true,
        title: action.payload.title,
        body: action.payload.body,
        buttons: action.payload.buttons,
        input: action.payload.input,
        resolve: action.payload.resolve,
      };
    }
    case 'close': {
      return {
        ...state,
        isOpen: false,
        resolve: null,
      };
    }
    default:
      return state;
  }
};

const open = (dispatch: Dispatch<ActionType>) => {
  return ({
    title,
    body,
    buttons,
    input,
  }: {
    title: string;
    body?: string;
    buttons: [Button] | [Button, Button];
    input?: Input | null;
  }) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'open',
        payload: {
          title,
          body: body || '',
          buttons,
          input,
          resolve,
        },
      });
    });
  };
};

const close = (dispatch: Dispatch<ActionType>) => {
  return () => {
    dispatch({
      type: 'close',
    });
  };
};
export const { useContext, Provider } = createDataContext(
  reducer,
  { open, close },
  {
    isOpen: false,
    title: '',
    body: '',
    buttons: [{ label: 'close', onClick: () => {} }],
    input: null,
    resolve: null,
  }
);
export const ProviderWithUI = ({ children }: any) => (
  <Provider>
    {children}
    <Ui />
  </Provider>
);

const Ui = () => {
  const [state, actions] = useContext();
  return (
    <Alert
      open={state.isOpen}
      onClose={actions.close}
      title={state.title}
      subTitle={state.body}
      buttons={
        state.buttons.map(({ label, isDanger }) => ({
          label,
          isDanger,
          onClick: () => {
            actions.close();
            state.resolve?.(label);
          },
        })) as any
      }
    />
  );
};
