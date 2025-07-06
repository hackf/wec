import { useCallback } from "react";
import { useAtom} from "jotai";
import { atomWithImmer } from "jotai-immer";
import { GeoJSON as LGeoJSON } from "leaflet";

import { useStops } from "./stops";

/**
 * Fetches the route data from the graphhopper route endpoint
 * @param {LatLng[]} stops
 * @return {object} JSON response
 */
async function fetchRoute(stops) {
  const response = await fetch(`https://graphhopper.com/api/1/route?key=${import.meta.env.VITE_APP_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      points: stops.map(({lat, lng}) => [lng, lat]),
      snap_preventions: ['motorway', 'ferry', 'tunnel'],
      details: ['road_class', 'surface'],
      vehicle: 'racingbike',
      instructions: true,
      calc_points: true,
      points_encoded: false,
      priority: [
        { 'if': 'road_class == MOTORWAY', 'multiply_by': '0.1' },
        { 'if': 'road_class == TRUNK', 'multiply_by': '0.2' },
        { 'if': 'road_class == SECONDARY', 'multiply_by': '0.2' },
        { 'if': 'road_class == PRIMARY', 'multiply_by': '0.8' },
        { 'if': 'road_class == TERTIARY', 'multiply_by': '0.7' },
        { 'if': 'road_class == RESIDENTIAL', 'multiply_by': '1.0' },
        { 'if': 'road_class == ROAD', 'multiply_by': '0.5' },
        { 'if': 'road_class == CYCLEWAY', 'multiply_by': '1.0' },
        { 'if': 'bike_network == MISSING', 'multiply_by': '0.7' },
        { 'if': 'max_speed >= 60', 'multiply_by': '0.1' },
        { 'if': 'lanes > 2', 'multiply_by': '0.2' },
      ],
    }),
  });

  return await response.json();
};

const routeAtom = atomWithImmer({
  state: "idle",
  data: null,
  error: null,
});

export default function useRoute() {
  const [state, setState] = useAtom(routeAtom);
  const stops = useStops();

  const trigger = useCallback(
    () => {
      setState((state) => {
        state.state = "loading"
        state.data = null;
        state.error = null;
      });
      fetchRoute(stops)
        .then((data) => {
          const path = data.paths[0];
          setState((state) => {
            state.state = "done";
            state.data = {
              points: LGeoJSON.coordsToLatLngs(path.points.coordinates),
              waypoints: path.snapped_waypoints,
              instructions: path.instructions,
              distance: path.distance,
              time: path.time,
            };
            state.error = null;
          });
        })
        .catch((error) => {
          console.error(error);
          setState((state) => {
            state.state = "error"
            state.data = null;
            state.error = error;
          });
        });
    },
    [stops, setState],
  );

  return [
    state,
    trigger,
  ]
}
