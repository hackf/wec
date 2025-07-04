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

export const getCoordinates = async queryString => {
  const query = new URLSearchParams({
    q: queryString,
    limit: 5,
    debug: true,
    point: '42.31743,-83.02677',
    provider: 'default',
    key: import.meta.env.VITE_APP_API_KEY,
    bbox: [-83.139, 41.7252, -82.474, 42.4234],
  }).toString();

  const response = await fetch(`https://graphhopper.com/api/1/geocode?${query}`, { method: 'GET' });

  const result = await response.json();

  if (!("hits" in result) || result.hits.length === 0) {
    return [];
  }

  return result.hits.map(record => ({
    label: `${record.name}, ${record.city != null ? record.city : ""} ${record.country}`,
    lat: record.point.lat,
    lng: record.point.lng,
  }));
};

