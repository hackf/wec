import { atom, useAtomValue, useSetAtom } from "jotai";

export const userLocationAtom = atom(null);

export function useUserLocation() {
  return useAtomValue(userLocationAtom);
}

export function useSetUserLocation() {
  return useSetAtom(userLocationAtom);
}

const GEOLOCATION_UNSUPPORTED_ERROR = "GEOLOCATION_UNSUPPORTED";
const GEOLOCATION_ERROR_CODES = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
};

export function requestBrowserLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error(GEOLOCATION_UNSUPPORTED_ERROR));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, lng: longitude });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        ...options,
      },
    );
  });
}

export function getGeolocationErrorMessage(error) {
  if (!error) {
    return "An unknown error occurred.";
  }
  if (error.message === GEOLOCATION_UNSUPPORTED_ERROR) {
    return "Geolocation is not supported by your browser.";
  }
  switch (error.code) {
    case GEOLOCATION_ERROR_CODES.PERMISSION_DENIED:
      return "Location access denied. Please enable location permissions.";
    case GEOLOCATION_ERROR_CODES.POSITION_UNAVAILABLE:
      return "Location information unavailable.";
    case GEOLOCATION_ERROR_CODES.TIMEOUT:
      return "Location request timed out.";
    default:
      return "An unknown error occurred.";
  }
}
