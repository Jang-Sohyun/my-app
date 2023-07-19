import React, {
  useContext as useContextDefault,
  useReducer,
  Dispatch,
} from 'react';

type Reducer<T, A> = (state: T, action: A) => T;

type ActionFunction<ActionType, Func> = (
  dispatch: Dispatch<ActionType>
) => Func;

const createDataContext = <
  State,
  ActionType,
  Action extends {
    [key in keyof Action]: ActionFunction<ActionType, ReturnType<Action[key]>>;
  }
>(
  reducer: Reducer<State, ActionType>,
  actions: Action,
  initialState: State
) => {
  type ContextType = [
    State,
    {
      [key in keyof Action]: ReturnType<Action[key]>;
    }
  ];

  const boundActions = {} as ContextType[1];

  const Context = React.createContext<ContextType>([
    initialState,
    boundActions,
  ]);

  const useContext = () => useContextDefault(Context);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // actions === { addBlogPost: (dispatch) => { return () => {} } }
    for (const key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    const value = [state, boundActions] as ContextType;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { useContext, Provider };
};

export default createDataContext;
