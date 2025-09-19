import { Link, Route, Switch } from "wouter";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { AttributionControl } from "react-leaflet/AttributionControl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute, faPenToSquare, faCompass, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";

import CustomControls from "./controls/CustomControls";
import EditStops from "./EditStops";
import MapRoute from "./MapRoute";
import MapTray from "./controls/MapTray";
import ControlNavigationButton from "./controls/ControlNavigationButton";

import mapClasses from "./map.module.css";

function Map() {
  return (
    <div className={mapClasses["map"]}>
      <MapContainer
        id="map"
        style={{ width: "100%", height: "100%" }}
        center={[42.3149367, -83.0363633]}
        zoom={15}
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <CustomControls useLeafletStyles={false} position="bottomleft">
          <Link to="/" asChild>
            <ControlNavigationButton>
              <FontAwesomeIcon icon={faRoute} />
            </ControlNavigationButton>
          </Link>
          <Link to="/edit/stops" asChild>
            <ControlNavigationButton>
              <FontAwesomeIcon icon={faPenToSquare} />
            </ControlNavigationButton>
          </Link>
          <Link to="/directions" asChild>
            <ControlNavigationButton>
              <FontAwesomeIcon icon={faCompass} />
            </ControlNavigationButton>
          </Link>
        </CustomControls>
        <CustomControls useLeafletStyles={false} position="bottomright">
          <button>
            <FontAwesomeIcon icon={faLocationCrosshairs} />
          </button>
        </CustomControls>
        <MapTray>
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
        </MapTray>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AttributionControl position="topright"/>
      </MapContainer>
    </div>
  );
}

export default Map;
