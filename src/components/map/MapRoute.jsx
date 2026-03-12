import { useEffect } from "react";
import { LatLngBounds, Marker, divIcon } from "leaflet";
import { useMap } from "react-leaflet/hooks";
import { Polyline, Pane, Marker as RMarker } from 'react-leaflet'

import DivIcon from "./DivIcon";

import Dashboard from '../dashboard/dashboard.component';

import { useUserLocation } from "../../atoms/geolocation";
import useRoute from "../../atoms/route";
import { routeProgressAtom } from "../../atoms/routeProgress";
import { useAtom } from "jotai";

import { nearestPointOnPolyline, slicePolylineFrom, slicePolylineTo } from "../../utils/geometry";

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
  const userLocation = useUserLocation();
  const [progress, setProgress] = useAtom(routeProgressAtom);

  useEffect(() => {
    if (routeState.state !== "done" || !routeState.data || routeState.data.points.length === 0) return;
    const pts = routeState.data.points.map(p => [p.lat, p.lng]); // ensure [lat,lng] arrays
    map.flyToBounds(new LatLngBounds(pts[0], pts[pts.length - 1]), { animate: true });
    // reset progress when new route arrives
    setProgress({ snappedIndex: 0, snappedT: 0, snappedPoint: pts[0] });
  }, [routeState, map, setProgress]);

  useEffect(() => {
    if (routeState.state !== "done" || !routeState.data || !userLocation) return;
    const poly = routeState.data.points.map(p => [p.lat, p.lng]);
    // find nearest
    const nearest = nearestPointOnPolyline({ lat: userLocation.lat, lng: userLocation.lng }, poly);
    if (!nearest) return;
    setProgress({ snappedIndex: nearest.index, snappedT: nearest.t, snappedPoint: [nearest.point.lat, nearest.point.lng] });
  }, [userLocation, routeState, setProgress]);

  if (routeState.state !== "done") return null;

  const poly = routeState.data.points.map(p => [p.lat, p.lng]);
  const { snappedIndex, snappedT, snappedPoint } = progress;
  const remaining = slicePolylineFrom(poly, snappedIndex, snappedT);
  const traveled = slicePolylineTo(poly, snappedIndex, snappedT);

  return (
    <>
      <RouteStopMarkers waypoints={routeState.data.waypoints} />
      <Pane name="route-polylines" style={{ zIndex: 400 }}>
        {/* traveled (faded) */}
        <Polyline positions={traveled} pathOptions={{ weight: 8, color: '#999', opacity: 0.5 }} />
        {/* remaining (main) */}
        <Polyline positions={remaining} pathOptions={{ weight: 8, color: '#FF1439' }} />
      </Pane>
      {/* live snapped point marker */}
      {snappedPoint && (
        <Pane name="snapped-marker" style={{ zIndex: 1000 }}>
          <RMarker position={snappedPoint} />
        </Pane>
      )}
      <Dashboard distance={routeState.data.distance} time={routeState.data.time} />
    </>
  );
}
