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
    bbox: [-83.139, 41.7252, -82.474, 42.4234],
    country: 'CA',
    language: 'en',
    limit: '5',
    proximity: `${proxCoords[0]}, ${proxCoords[1]}`,
    access_token: process.env.REACT_APP_GEOCODING_ACCESS_TOKEN,
  }).toString();

  // FOR DETROIT INTEGRATION: remove 'country' parameter in the query above.

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
