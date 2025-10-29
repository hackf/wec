import { useCallback, useState, useEffect } from "react";

import { useParams, useLocation } from "wouter";

import { useMapEvent } from "react-leaflet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useUpdateStop } from "../../atoms/stops";

export default function StopMapPicker() {
  const [selected, setSelected] = useState(null); // { lat, lng } or null

  const updateStop = useUpdateStop();

  const params = useParams();
  const [, navigate] = useLocation();

  // check for clicks on the map to set the marker
  useMapEvent('click', (e) => {
    // only the clicks from the map container are registered to lat/lng
    if (e.originalEvent.target.closest('.leaflet-container')) {
      setSelected(e.latlng);
    }
  });

  const handleAccept = useCallback(
    () => {
      if (!selected || !("stopIndex" in params) || params.stopIndex == null) {
        return;
      }
      updateStop({ index: new Number(params.stopIndex), ...selected });
      navigate("/stops");
    },
    [selected, params, updateStop, navigate],
  );

  const handleCancel = useCallback(
    () => {
      navigate("/stops");
    },
    [navigate],
  );

  // change the cursor to pointer while placing a stop
  useEffect(() => {
    const mapContainer = document.querySelector('.leaflet-container');
    if (!mapContainer) {
      return;
    }

    if (!selected) {
      mapContainer.style.cursor = 'pointer';
    }

    return () => {
      mapContainer.style.cursor = '';
    };
  }, [selected]);

  return (
    <>
      <button
        type="button"
        onClick={handleAccept}
        disabled={!selected} // disabled and greyed out until user clicks on map
        style={{ opacity: !selected ? 0.5 : 1 }}
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>
      <button type="button" onClick={handleCancel}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </>
  );
}
