import { useContext, createContext } from 'react';

export const AppContext = createContext(null);
AppContext.displayName = 'AppContext';

export function useAppContext() {
  return useContext(AppContext);
}
