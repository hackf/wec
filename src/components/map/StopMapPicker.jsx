import { useCallback, useState, useEffect, useRef } from "react";

import { useParams, useLocation } from "wouter";

import { useMap, useMapEvents } from "react-leaflet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faCheck } from "@fortawesome/free-solid-svg-icons";

import { useUpdateStop } from "../../atoms/stops";

import CustomControls from './controls/CustomControls';

export default function StopMapPicker() {
  const [center, setCenter] = useState({ lat: null, lng: null });
  const map = useMap();
  useEffect(
    () => {
      setCenter(map.getCenter());
    },
    []
  );
  useMapEvents({
    moveend() {
      setCenter(map.getCenter());
    },
  });

  const updateStop = useUpdateStop();

  const params = useParams();
  const [, navigate] = useLocation();
  const handleAccept = useCallback(
    () => {
      if ((!("stopIndex" in params) || params.stopIndex == null)) {
        return;
      }
      updateStop({ index: new Number(params.stopIndex), ...center });
      navigate("/stops");
    },
    [center, params, updateStop, navigate],
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
      <button type="button" onClick={handleAccept}>
        <FontAwesomeIcon icon={faCheck} />
      </button>

      <CustomControls useLeafletStyles={false} position="center">
        <div className="map-picker" ref={elementRef} style={position}>
          <FontAwesomeIcon icon={faCircleDot} color="#FF0000B0" size="2x" />
        </div>
      </CustomControls>
    </>
  );
}
