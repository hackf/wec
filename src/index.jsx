import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Map, DomUtil } from "leaflet";

import './index.scss';
import App from './App';

/**
 * Override _initControlPos so that more control position can be supported by the Map
 */
Map.include({
  _initControlPos() {
    this._controlContainer = DomUtil.create("div", "leaflet-control-container", this._container);
    this._controlCorners = {};

    this._controlCorners["center"] = DomUtil.create(
      "div", "leaflet-center", this._controlContainer
    );
    this._controlCorners["topleft"] = DomUtil.create(
      "div", "leaflet-top leaflet-left", this._controlContainer
    );
    this._controlCorners["topright"] = DomUtil.create(
      "div", "leaflet-top leaflet-right", this._controlContainer
    );
    this._controlCorners["bottomleft"] = DomUtil.create(
      "div", "leaflet-bottom leaflet-left", this._controlContainer
    );
    this._controlCorners["bottomright"] = DomUtil.create(
      "div", "leaflet-bottom leaflet-right", this._controlContainer
    );
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
