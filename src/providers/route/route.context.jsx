import { createContext, useReducer, useContext } from 'react';

import routeReducer, { initialState } from './route.reducer';

const RouteContext = createContext(initialState);

export const RouteProvider = ({ children }) => {
  const [route, dispatch] = useReducer(routeReducer, initialState);

  const handleInputChange = newState => {
    dispatch({
      type: 'CHANGING',
      payload: {
        newState,
      },
    });
  };

  const value = {
    route,
    handleInputChange,
  };

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
};

const useRoute = () => {
  const context = useContext(RouteContext);

  if (context === undefined) {
    throw new Error('useRoute must be used within RouteContext');
  }

  return context;
};

export default useRoute;
