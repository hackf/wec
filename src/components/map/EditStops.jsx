import { useMemo, useCallback } from "react";
import { Route, Link, Switch, useLocation } from "wouter";
import { Pane } from "react-leaflet/Pane";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

import SearchMap from "./SearchMap";
import DivIcon from "./DivIcon";
import SearchIcon from "./SearchIcon";
import StopMapPicker from "./StopMapPicker";

import { useStops, useAddStops, useRemoveStop } from "../../atoms/stops";
import { useSearchData } from "../../atoms/search";
import useRoute from "../../atoms/route";

function SearchMarkers() {
  const searchData = useSearchData();
  return (
    <Pane name="search-markers" style={{ zIndex: 1000 }}>
      { searchData.map((data, index) => (
        <SearchIcon
          key={data.osmId}
          id={`${data.osmId}`}
          number={index + 1}
          color="#2314ff"
          textColor="#FFFFFF"
          position={[data.lat, data.lng]}
        />
      )) }
    </Pane>
  );
}

function StopMarkers() {
  const stops = useStops();
  const filtersStops = useMemo(
    () => stops.filter((stop) => stop.lat != null && stop.lng != null),
    [stops],
  );
  return (
    <Pane name="stop-markers" style={{ zIndex: 1000 }}>
      { filtersStops.map((data, index) => (
        <DivIcon
          key={`${data.lat}-${data.lng}`}
          id={`${data.lat}-${data.lng}`}
          number={index + 1}
          color="#541dff"
          textColor="#FFFFFF"
          position={[data.lat, data.lng]}
        />
      )) }
    </Pane>
  );
}

export default function EditStops() {
  const stops = useStops();

  const disableGetRoute = useMemo(
    () => {
      if (stops.length <= 1) {
        return true;
      }
      return !stops.every((stop) => stop.lat != null && stop.lng != null);
    },
    [stops],
  );

  const addStop = useAddStops();
  const removeStop = useRemoveStop();
  const [, fetchRoute] = useRoute();

  const [, navigate] = useLocation();
  const getRoute = useCallback(
    () => {
      fetchRoute();
      navigate("~/");
    },
    [fetchRoute],
  );

  return (
    <div>
      <Switch>
        <Route path="stops">
          <ol>
            {stops.map((stop, index) => (
              <li key={index}>
                <span>{`Stop ${index + 1}`}</span>
                <span>{`lat: ${stop.lat}`}</span>
                <span>{`lng: ${stop.lng}`}</span>
                <Link to={`/search/${index + 1}`}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
                <button type="button" onClick={() => removeStop(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={addStop}>
            Add Stop
          </button>
          <button type="button" disabled={disableGetRoute} onClick={getRoute}>
            Get Route
          </button>
          <StopMarkers />
        </Route>
        <Route path="search/:stopIndex">
          <SearchMap />
          <SearchMarkers />
        </Route>
        <Route path="pick/:stopIndex">
          <StopMapPicker />
        </Route>
      </Switch>
    </div>
  );
}
