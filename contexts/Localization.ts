import { createContext, useContext } from 'react';
import { Locales } from 'types';
import { LocaleWords } from 'types/localeWords';

interface Context {
  t: (key: LocaleWords, params?: any) => string;
  locale: Locales;
  setLocale: (locale: Locales) => void;
}
export const LocalizationContext = createContext<Context>({
  t: () => '',
  locale: 'en',
  setLocale: () => {},
});

export const useLocalizationContext = () => {
  return useContext(LocalizationContext);
};
