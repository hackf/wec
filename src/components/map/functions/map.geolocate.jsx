export const geoLocate = async corDispatch => {
  let location = 0;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log('Geolocation not supported');
  }

  if (location) {
    await corDispatch({
      field: 'start',
      lat: location.lat,
      lng: location.lng,
      location: 'Home',
    });
  }
};

function success(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  return { lat, lng };
}

function error() {
  console.log('Unable to retrieve your location');
}
