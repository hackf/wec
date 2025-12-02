import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs, faStop } from "@fortawesome/free-solid-svg-icons";

import {
  useSetUserLocation,
  useUserLocationWatchId,
  useSetUserLocationWatchId,
  requestBrowserLocation,
  startWatchLocation,
  stopWatchLocation,
  getGeolocationErrorMessage,
} from "../../atoms/geolocation";

export default function Geolocation() {
  const map = useMap();
  const setUserLocation = useSetUserLocation();
  const watchId = useUserLocationWatchId();
  const setWatchId = useSetUserLocationWatchId();
  const [isTracking, setIsTracking] = useState(Boolean(watchId));
  const justStartedRef = useRef(false);

  useEffect(() => {
    // keep local isTracking in sync if external changed
    setIsTracking(Boolean(watchId));
  }, [watchId]);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (watchId != null) {
        stopWatchLocation(watchId);
        setWatchId(null);
      }
    };
  }, [watchId, setWatchId]);

  const startTracking = useCallback(async () => {
    try {
      // try to get a quick initial location for immediate centering
      const pos = await requestBrowserLocation();
      setUserLocation(pos);
      map.flyTo([pos.lat, pos.lng], 16, { animate: true, duration: 1.2 });
    } catch (err) {
      // avoid failing the whole startTracking flow if getCurrentPosition() for that one-time call errors
    }

    try {
      const id = startWatchLocation(
        (location) => {
          setUserLocation(location);
          // only auto-center when we just started tracking or when the user hasn't moved map
          if (justStartedRef.current) {
            map.flyTo([location.lat, location.lng], 16, { animate: true, duration: 1.2 });
            justStartedRef.current = false;
          }
        },
        (err) => {
          console.error("Watch position error:", err);
          alert(getGeolocationErrorMessage(err));
        },
      );
      setWatchId(id);
      setIsTracking(true);
      justStartedRef.current = true;
    } catch (error) {
      console.error("Error starting watch:", error);
      alert(getGeolocationErrorMessage(error));
    }
  }, [map, setUserLocation, setWatchId]);

  const stopTracking = useCallback(() => {
    if (watchId != null) {
      stopWatchLocation(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  }, [watchId, setWatchId]);

  const handleLocate = useCallback(() => {
    if (!isTracking) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isTracking, startTracking, stopTracking]);

  return (
    <button onClick={handleLocate} aria-pressed={isTracking} title={isTracking ? "Stop live location" : "Start live location"}>
      <FontAwesomeIcon icon={isTracking ? faStop : faLocationCrosshairs} />
    </button>
  );
}
