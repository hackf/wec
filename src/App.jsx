import React, { useReducer, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MdClose } from 'react-icons/md';

import Map from './components/map/map.component';
import Sidebar from './components/sidebar/sidebar.component';
import Menu from './components/menu/menu.component';

import CoordinatesContext from './providers/coordinates/coordinates.context';
import MapContext from './providers/mapbox/mapbox.context';
import GraphhopperContext from './providers/graphhopper/graphhopper.context';
import StopsContext from './providers/stops/stops.context.jsx';
import MobileContext from './providers/mobile/mobile.context.jsx';
import { RouteProvider } from './providers/route/route.context.jsx';

import { mapboxReducer } from './providers/mapbox/mapbox.reducer';
import { coordinatesReducer } from './providers/coordinates/coordinates.reducer';
import { graphhopperReducer } from './providers/graphhopper/graphhopper.reducer';

import './App.scss';

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;

function App() {
  const defaultCor = {
    start: undefined,
    stop_1: undefined,
    stop_2: undefined,
    stop_3: undefined,
    end: undefined,
  };
  const [corState, setCor] = useState(defaultCor);
  const [mapState, setMap] = useState(undefined);
  const [graphState, setGraph] = useState(undefined);
  const [stopsState, setStops] = useState([]);
  const [mobileState, setMobile] = useState('searching');

  const mapProviderState = {
    mapState,
    mapDispatch: val => setMap(val),
  };

  const mobileProviderState = {
    mobileState,
    mobileDispatch: val => setMobile(val),
  };

  const corProviderState = {
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
  };

  const graphProviderState = {
    graphState,
    graphDispatch: async val => {
      await setGraph(val);
    },
  };

  const stopsProviderState = {
    stopsState,
    stopsDispatch: val => setStops(val),
  };

  return (
    <div className="app">
      <GraphhopperContext.Provider value={graphProviderState}>
        <Sidebar />
        <div className="main">
          <CoordinatesContext.Provider value={corProviderState}>
            <MapContext.Provider value={mapProviderState}>
              <RouteProvider>
                <Map />
                <StopsContext.Provider value={stopsProviderState}>
                  <MobileContext.Provider value={mobileProviderState}>
                    <Menu />
                  </MobileContext.Provider>
                </StopsContext.Provider>
              </RouteProvider>
            </MapContext.Provider>
          </CoordinatesContext.Provider>
        </div>
      </GraphhopperContext.Provider>
    </div>
  );
}

export default App;
