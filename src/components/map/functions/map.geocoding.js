export const geoCoding = async (addr, state) => {
  const proxCoords = state.stop_3
    ? [state.stop_3.lng, state.stop_3.lat]
    : state.stop_2
    ? [state.stop_2.lng, state.stop_2.lat]
    : state.stop_1
    ? [state.stop_1.lng, state.stop_1.lat]
    : state.start
    ? [state.start.lng, state.start.lat]
    : [-83.026772, 42.317432];

  const query = new URLSearchParams({
    bbox: [-83.137, 41.888, -82.479, 42.4123],
    language: 'en',
    limit: '5',
    proximity: `${proxCoords[0]}, ${proxCoords[1]}`,
    access_token: process.env.REACT_APP_GEOCODING_ACCESS_TOKEN,
  }).toString();

  const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${addr}.json?${query}`, {
    method: 'GET',
  });
  /*
  const response = await fetch(
    `https://graphhopper.com/api/1/geocode?q=${addr}&locale=de&key=ee4af31e-0f04-4b6c-9f9b-c8a665ec6a89`,
    { method: 'GET' }
  );
  */
  return await response.json();
};
