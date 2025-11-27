import { useCallback } from "react";
import { useMap } from "react-leaflet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";

import { useSetUserLocation, requestBrowserLocation, getGeolocationErrorMessage } from "../../atoms/geolocation";

export default function Geolocation() {
  const map = useMap();
  const setUserLocation = useSetUserLocation();

  const handleLocate = useCallback(async () => {
    try {
      const location = await requestBrowserLocation();
      setUserLocation(location);
      map.flyTo([location.lat, location.lng], 16, {
        animate: true,
        duration: 1.5,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      alert(getGeolocationErrorMessage(error));
    }
  }, [map, setUserLocation]);

  return (
    <button onClick={handleLocate}>
      <FontAwesomeIcon icon={faLocationCrosshairs} />
    </button>
  );
}
