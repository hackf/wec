import { useMemo, useEffect } from "react";

import { GeoJSON as LGeoJSON, LatLngBounds } from "leaflet";

import { useMapEvents, useMap } from "react-leaflet/hooks";
import { MapContainer } from 'react-leaflet/MapContainer'
import { Polyline } from 'react-leaflet/Polyline'
import { Pane } from 'react-leaflet/Pane'
import { TileLayer } from 'react-leaflet/TileLayer'
import { AttributionControl } from 'react-leaflet/AttributionControl'

import CustomControls from './controls/CustomControls';
import Menu from '../menu/menu.component';
import Dashboard from '../dashboard/dashboard.component';
import DivIcon from "./DivIcon";

import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';

import './map.styles.scss';

function MapEvents() {
  const map = useMapEvents({
    moveend(e) {
      console.log("moveend", e);
      console.log("Center of Map", map.getCenter());
    },
  });

  return null;
}

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
 * Displays the submitted route on the map
 * @param {StopMarkersProps}
 * @returns {ReactNode} A Polyline that represents the route
 */
function StopMarkers({ waypoints }) {
  console.log("waypoints", waypoints);
  return (
    <Pane name="stop-markers" style={{ zIndex: 500 }}>
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

/**
 * Route component's props definition
 * @typedef {Object} RouteProps
 * @property {LatLng[]} path
 */

/**
 * Displays the submitted route on the map
 * @param {RouteProps}
 * @returns {ReactNode} A Polyline that represents the route
 */
function Route({ path }) {
  const map = useMap();
  useEffect(
    () => {
      if (path.length <= 0) {
        return;
      }
      map.flyToBounds(
        new LatLngBounds(path[0], path[path.length - 1]),
        {
          animate: true,
        },
      );
    },
    [path],
  );
  return (
    <Polyline positions={path} pathOptions={{ weight: 8 }} />
  );
}

const Map = () => {
  const { graphState } = useGraphhopperContext();

  const path = useMemo(
    () => {
      if (graphState == null) {
        return [];
      }

      return LGeoJSON.coordsToLatLngs(graphState.paths[0].points.coordinates);
    },
    [graphState],
  );

  /** @type LineString */
  const snappedWaypoints = useMemo(
    () => {
      if (graphState == null) {
        return {
          type: "LineString",
          coordinates: [],
        };
      }
      return graphState.paths[0].snapped_waypoints;
    },
    [graphState],
  );

  return (
    <div className="map">
      <MapContainer
        id="map"
        style={{ width: "100%", height: "100%" }}
        center={[42.3149367, -83.0363633]}
        zoom={15}
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <Route path={path} />
        <MapEvents />
        <StopMarkers waypoints={snappedWaypoints} />
        <CustomControls useLeafletStyles={false} position="topleft">
          <Menu />
        </CustomControls>
        <CustomControls useLeafletStyles={false} position="bottomleft">
          <Dashboard />
        </CustomControls>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AttributionControl position="topright"/>
      </MapContainer>
    </div>
  );
};

export default Map;
