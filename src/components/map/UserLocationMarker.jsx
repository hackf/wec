import { CircleMarker, Popup } from "react-leaflet";

import { useUserLocation } from "../../atoms/geolocation";

export default function UserLocationMarker() {
  const userLocation = useUserLocation();

  if (!userLocation) {
    return null;
  }

  return (
    <CircleMarker
      center={[userLocation.lat, userLocation.lng]}
      radius={8}
      pathOptions={{
        fillColor: "#4285F4",
        fillOpacity: 1,
        color: "#fff",
        weight: 2,
      }}
    >
      <Popup>Your Location</Popup>
    </CircleMarker>
  );
}
