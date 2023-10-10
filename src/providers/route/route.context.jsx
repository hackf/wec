import { createContext, useContext } from 'react';

const RouteContext = createContext({});

export function useRouteContext() {
  return useContext(RouteContext);
}

export default RouteContext;
