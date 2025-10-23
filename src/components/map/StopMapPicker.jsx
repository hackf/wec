import { useCallback, useState, useEffect, useRef } from "react";

import { useParams, useLocation } from "wouter";

import { useMapEvent } from "react-leaflet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useUpdateStop } from "../../atoms/stops";

import CustomControls from './controls/CustomControls';

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

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const elementRef = useRef(null);
  useEffect(
    () => {
      const rect = elementRef.current.getBoundingClientRect();
      setPosition({
        top: (rect.height / 2) * -1,
        left: (rect.height / 2) * -1,
      });

      const observer = new MutationObserver(() => {
        const rect = elementRef.current.getBoundingClientRect();
        setPosition({
          top: (rect.height / 2) * -1,
          left: (rect.height / 2) * -1,
        });
      });

      observer.observe(elementRef.current, {
        attributes: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    },
    [],
  );

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

      <CustomControls useLeafletStyles={false} position="center">
        <div className="map-picker" ref={elementRef} style={position}>
          <FontAwesomeIcon icon={faCircleDot} color="#FF0000B0" size="2x" />
        </div>
      </CustomControls>
    </>
  );
}
