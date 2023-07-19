import { createContext, useContext } from 'react';
import { User } from 'types';

interface Context {
  loading: boolean;
  user: User | null;
  logout: () => void;
  setUserFromJwtOrClear: () => void;
  requestLogin: () => void;
  cart: any[];
  addToCart: ({
    productId,
    amount,
  }: {
    productId: number;
    amount: number;
  }) => void;
  removeCart: ({ cartId }: { cartId: number }) => void;
  changeCart: ({ cartId, amount }: { cartId: number; amount: number }) => void;
}
export const DdleContext = createContext<Context>({
  loading: false,
  user: null,
  logout: () => {},
  setUserFromJwtOrClear: () => {},
  requestLogin: () => {},
  cart: [],
  addToCart: () => {},
  removeCart: () => {},
  changeCart: () => {},
});
export const useDdleContext = () => {
  const context = useContext(DdleContext);
  return context;
};
