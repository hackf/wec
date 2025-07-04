import React, { useState, useMemo } from 'react';

import Map from './components/map/map.component';
import Sidebar from './components/sidebar/sidebar.component';

import CoordinatesContext from './providers/coordinates/coordinates.context';
import GraphhopperContext from './providers/graphhopper/graphhopper.context';
import StopsContext from './providers/stops/stops.context.jsx';

import './App.scss';

const defaultCor = {
  start: undefined,
  stop_1: undefined,
  stop_2: undefined,
  stop_3: undefined,
  end: undefined,
};

function App() {
  const [corState, setCor] = useState(defaultCor);
  const [graphState, setGraph] = useState(undefined);
  const [stopsState, setStops] = useState([]);

  const corProviderState = useMemo(
    () => ({
      corState,
      corDispatch: ({ lat, lng, location, field }, start) => {
        if (start) {
          setCor({ ...defaultCor, start });
        } else {
          const newArr = { ...corState };
          newArr[field] = { lat, lng, location };
          setCor(newArr);
        }
      },
    }),
    [corState, setCor],
  );

  const graphProviderState = useMemo(
    () => ({
      graphState,
      graphDispatch: async val => {
        setGraph(val);
      },
    }),
    [graphState, setGraph],
  );

  const stopsProviderState = useMemo(
    () => ({
      stopsState,
      stopsDispatch: val => setStops(val),
    }),
    [stopsState, setStops],
  );

  return (
    <div className="app">
      <GraphhopperContext.Provider value={graphProviderState}>
        <CoordinatesContext.Provider value={corProviderState}>
          <Sidebar />
          <div className="main">
            <StopsContext.Provider value={stopsProviderState}>
              <Map />
            </StopsContext.Provider>
          </div>
        </CoordinatesContext.Provider>
      </GraphhopperContext.Provider>
    </div>
  );
}

export default App;
