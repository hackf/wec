import { useParams, useLocation, Link } from "wouter";
import { useCallback, useState, useEffect } from "react";
import { useMap } from "react-leaflet/hooks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLocationDot } from "@fortawesome/free-solid-svg-icons";

import { useGeoSearch, useResetSearchData } from "../../atoms/search";
import { useUpdateStop } from "../../atoms/stops";

export default function SearchMap() {
  const updateStop = useUpdateStop();

  const [searchString, setSearchString] = useState("");

  const resetSearchData = useResetSearchData();
  const [state, trigger] = useGeoSearch();

  const handleChange = useCallback(
    (event) => {
      const input = event.target.value;
      setSearchString(input);
      trigger(input);
    },
    [setSearchString],
  );

  const params = useParams();
  const [, navigate] = useLocation();
  const handleUpdateStop = useCallback(
    (index) => {
      if (state.state != "done" && (!("stopIndex" in params) || params.stopIndex == null)) {
        return;
      }
      updateStop({ index: new Number(params.stopIndex), ...state.data[index] });
      navigate("/stops");
      resetSearchData();
    },
    [updateStop, params, state],
  );

  useEffect(
    () => {
      resetSearchData();
      return resetSearchData;
    },
    [resetSearchData],
  );

  const map = useMap();
  const flyTo = useCallback(
    (lat, lng) => {
      map.flyTo(
        [lat, lng],
        map.getZoom(),
        { animate: true },
      );
    },
    [map],
  );

  if (state.state == "idle") {
    return (
      <div>
        <Link to={`/pick/${params.stopIndex}`}>Place stop manually</Link>
        <input
          aria-label="Search"
          type="text"
          placeholder="Search"
          value={searchString}
          onChange={handleChange}
        />
      </div>
    );
  }
  if (state.state == "loading") {
    return (
      <div>
        <Link to={`/pick/${params.stopIndex}`}>Place stop manually</Link>
        <input
          aria-label="Search"
          type="text"
          placeholder="Search"
          value={searchString}
          onChange={handleChange}
        />
        <p>Loading ...</p>
      </div>
    );
  }
  if (state.state == "error") {
    return (
      <div>
        <Link to={`/pick/${params.stopIndex}`}>Place stop manually</Link>
        <input
          aria-label="Search"
          type="text"
          placeholder="Search"
          value={searchString}
          onChange={handleChange}
        />
        <p>Error loading results. Please try again later.</p>
      </div>
    );
  }
  return (
    <div>
      <Link to={`/pick/${params.stopIndex}`}>Place stop manually</Link>
      <input
        aria-label="Search"
        type="text"
        placeholder="Search"
        value={searchString}
        onChange={handleChange}
      />
      <ol>
        {state.data.map((data, index) => (
          <li key={data.osmId}>
            <span>{data.name}</span>
            <button type="button" onClick={() => handleUpdateStop(index)}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button type="button" onClick={() => flyTo(data.lat, data.lng)}>
              <FontAwesomeIcon icon={faLocationDot} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
