import { createContext, useContext } from 'react';

const StopsContext = createContext();

export function useStopsContext() {
  return useContext(StopsContext);
}

export default StopsContext;
