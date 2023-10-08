import { createContext, useContext } from 'react';

const MobileContext = createContext();

export function useMobileContext() {
  return useContext(MobileContext);
}

export default MobileContext;
