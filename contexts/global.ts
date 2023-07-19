import { createContext, useContext } from 'react';
import { User, SocialAuthList } from 'types';

interface Context {
  loading: boolean;
  user: User | null;
  logout: () => void;
  connectSocialAuth: (type: SocialAuthList) => void;
  disconnectSocialAuth: (type: SocialAuthList) => void;
}
export const DdleContext = createContext<Context>({
  loading: false,
  user: null,
  logout: () => {},
  connectSocialAuth: () => {},
  disconnectSocialAuth: () => {},
});
export const useDdleContext = () => {
  const context = useContext(DdleContext);
  return context;
};
