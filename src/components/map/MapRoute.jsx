import { useEffect } from "react";
import { LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet/hooks";
import { Polyline } from 'react-leaflet/Polyline'
import { Pane } from 'react-leaflet/Pane'

import DivIcon from "./DivIcon";

import Dashboard from '../dashboard/dashboard.component';

import useRoute from "../../atoms/route";

/**
 * LineString
 * @typedef {Object} LineString
 * @property {"LineString"} type
 * @property {number[][]} coordinates
 */

/**
 * StopMarkers component's props definition
 * @typedef {Object} StopMarkersProps
 * @property {LineString} waypoints
 */

/**
 * Display each stop as a marker on the map
 * @param {StopMarkersProps}
 * @returns {ReactNode}
 */
function RouteStopMarkers({ waypoints }) {
  return (
    <Pane name="route-stop-markers" style={{ zIndex: 500 }}>
      { waypoints.coordinates.map((point, index) => (
        <DivIcon
          key={index}
          id={`stop${index}`}
          number={index + 1}
          color="#FF1439"
          textColor="#FFFFFF"
          position={point.slice().reverse()}
        />
      )) }
    </Pane>
  );
}


export default function MapRoute() {
  const [routeState] = useRoute();
  const map = useMap();
  useEffect(
    () => {
      if (routeState.state != "done" || routeState.data.points.length <= 0) {
        return;
      }
      map.flyToBounds(
        new LatLngBounds(routeState.data.points[0], routeState.data.points[routeState.data.points.length - 1]),
        {
          animate: true,
        },
      );
    },
    [routeState],
  );
  if (routeState.state === "idle" || routeState.state === "error") {
    return null;
  }
  if (routeState.state === "loading") {
    return null;
  }
  return (
    <>
      <RouteStopMarkers waypoints={routeState.data.waypoints} />
      <Polyline positions={routeState.data.points} pathOptions={{ weight: 8 }} />
      <Dashboard distance={routeState.data.distance} time={routeState.data.time} />
    </>
  );
}
