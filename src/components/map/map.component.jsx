import { useRef, useEffect } from 'react';

import { useMapContext } from '../../providers/mapbox/mapbox.context';
import addRoutes from './functions/map.routes';
import setThreeD from './functions/map.3d';
import { initilize } from './functions/map.initialize';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { routes } from '../graphhopper/graphhopper.component';

import './map.styles.scss';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';

const Map = () => {
  const mapContainer = useRef(null);
  const { mapState, mapDispatch } = useMapContext();
  const { corState } = useCoordinatesContext();
  const { graphDispatch } = useGraphhopperContext();

  const setMap = async () => {
    initilize(mapState, mapDispatch, mapContainer, [-83.0363633, 42.3149367]);
  };

  useEffect(() => {
    setMap();
  });

  useEffect(() => {
    if (mapState === undefined) return;
    mapState.on('style.load', () => {
      setThreeD(mapState);
    });
  });

  useEffect(() => {
    if (!mapState) return;
    mapState.on('style.load', async () => {
      if (corState.start) {
        const data = await routes(corState);

        console.log(data);

        addRoutes(mapState, data.paths[0].points.coordinates);
        await graphDispatch(data);
      }
    });
  });

  return <div ref={mapContainer} className="map" />;
};

export default Map;
