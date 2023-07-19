import { Dispatch } from 'react';
import Alert, { AlertButton as Button } from 'components/Alert';
import BottomSheet from 'components/BottomSheet';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import createDataContext from './createDataContext';

interface State {
  isOpen: boolean;
  buttons: Button[];
  resolve: ((v: any) => void) | null;
}
type ActionType =
  | {
      type: 'open';
      payload: {
        buttons: Button[];

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
        buttons: action.payload.buttons,
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
  return ({ buttons }: { buttons: Button[] }) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'open',
        payload: {
          buttons,
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
    buttons: [{ label: 'close', onClick: () => {} }],
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
    <BottomSheet
      open={state.isOpen}
      onClose={() => {
        actions.close();
      }}
      sx={{ zIndex: 1301 }}
    >
      <List sx={{ paddingBottom: 4 }}>
        {state.buttons.map(({ label, isDanger }, index, arr) => (
          <ListItem
            key={label}
            disablePadding
            sx={{
              py: 1,
              borderBottom:
                index < arr.length - 1 ? '1px solid #efefef' : undefined,
            }}
          >
            <ListItemButton
              sx={{ textAlign: 'center' }}
              onClick={() => {
                actions.close();
                state.resolve?.(label);
              }}
            >
              <ListItemText
                primary={label}
                sx={{
                  color: isDanger ? 'rgb(248, 94, 58)' : 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </BottomSheet>
  );
};
