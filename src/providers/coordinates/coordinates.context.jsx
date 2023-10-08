import { createContext, useContext } from 'react';

const CoordinatesContext = createContext({});

export function useCoordinatesContext() {
  return useContext(CoordinatesContext);
}

export default CoordinatesContext;
