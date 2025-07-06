
import { Link, Route, Switch } from "wouter";

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { AttributionControl } from 'react-leaflet/AttributionControl'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute, faPenToSquare, faCompass } from "@fortawesome/free-solid-svg-icons";

import CustomControls from './controls/CustomControls';
import EditStops from "./EditStops";
import MapRoute from "./MapRoute";

import './map.styles.scss';

const Map = () => {

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
        <CustomControls useLeafletStyles={false} position="topleft">
          <div className="controls">
            <div>
              <Link to="/">
                <FontAwesomeIcon icon={faRoute} />
              </Link>
              <Link to="/edit/stops">
                <FontAwesomeIcon icon={faPenToSquare} />
              </Link>
              <Link to="/directions">
                <FontAwesomeIcon icon={faCompass} />
              </Link>
            </div>
            <Switch>
              <Route path="/">
                <MapRoute />
              </Route>
              <Route path="/edit" nest>
                <EditStops />
              </Route>
              <Route path="/directions">
              </Route>
            </Switch>
          </div>
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
