import { routes } from '../../graphhopper/graphhopper.component';
import addRoutes from '../../map/functions/map.routes';

export const updateMap = async (corState, mapState, graphDispatch) => {
  const data = await routes(corState);
  if (mapState.getStyle().layers.some(e => e.id === 'route')) {
    mapState.removeLayer('route');
    mapState.removeSource('route');
  }
  
  addRoutes(mapState, data.paths[0].points.coordinates);
  await graphDispatch(data);

  return data;
};
