import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Map, DomUtil } from "leaflet";

import "./index.css";
import App from "./App";

/**
 * WARNING: This is a hack in order to have more control over the control areas created
 * by leaflet. Be **very careful** when modifying this chunk of code.
 *
 * This Overrides leaflet's global `Map._initControlPos` method in order to change the control positions
 * and their styles. The original function creates 4 positions that custom and builtin controls
 * will be placed: `topleft`, `topright`, `bottomleft`, and `bottomright`.
 * See the `position` controls for more details: https://leafletjs.com/reference.html#control-position
 * With that said, those original positions *NEED* to exist, otherwise things *WILL* break. Since the
 * positions are just references to elements, they can be changed to have different styles. This is
 * what this function does, it changes the control container, changes the styles (classes) for the
 * original 4 positions, and adds new positions that suit the needs of this project.
 *
 * NOTE: The index style file contains the styles for the classes set by this method
 *
 * The original control container and positions used relative/absolute css positions to place elements
 * above the map tiles. The new control container instead uses a css grid to achieve the same thing
 * expect it adds additional locations for custom positions. This also makes the controls a bit more
 * responsive on small screen sizes. Though, the controls should shouldn't take up too much space since
 * that would make interacting with the map more difficult.
 *
 * The most important position new position is the "tray" position. It's positioned as bottom row and
 * spans all the columns. It's were most of the functionality of the application lives. The goal of the
 * the "tray" control is to allow the user to quickly hide or show those controls while interacting with
 * the map. If the "tray" control ever fails to achieve this, it should be designed so that it does. It's
 * also meant to mimic the UX/UI of other popular map focused applications (mostly mobile since that's
 * the target for this application).
 *
 * The "center" position was also created to aid in placing elements in the middle of the map but the
 * controls that used that position are going to be redesigned so it might not be needed in the future.
 *
 * IMO it's easier to understand how this works visually. Locate the element with the control container's
 * class with the browser's dev tools and check the "grid" option which *should* print debugging information
 * for the grid directly on the page.
 */
Map.include({
  _initControlPos() {
    this._controlContainer = DomUtil.create("div", "leaflet-grid-control-container", this._container);
    this._controlCorners = {};

    this._controlCorners["center"] = DomUtil.create(
      "div", "leaflet-grid-row-center leaflet-grid-column-center", this._controlContainer
    );
    this._controlCorners["topleft"] = DomUtil.create(
      "div", "leaflet-grid-top leaflet-grid-left", this._controlContainer
    );
    this._controlCorners["topright"] = DomUtil.create(
      "div", "leaflet-grid-top leaflet-grid-right", this._controlContainer
    );
    this._controlCorners["bottomleft"] = DomUtil.create(
      "div", "leaflet-grid-bottom leaflet-grid-left", this._controlContainer
    );
    this._controlCorners["bottomright"] = DomUtil.create(
      "div", "leaflet-grid-bottom leaflet-grid-right", this._controlContainer
    );
    this._controlCorners["tray"] = DomUtil.create(
      "div", "leaflet-grid-tray", this._controlContainer
    );
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
