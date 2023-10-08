export const getCoordinates = async addr => {
  const query = new URLSearchParams({
    q: addr,
    locale: 'en',
    limit: '5',
    reverse: 'false',
    debug: 'false',
    //provider: 'nominatim',
    provider: 'default',
    //countrycode: 'ca',
    key: 'ee4af31e-0f04-4b6c-9f9b-c8a665ec6a89',
  }).toString();

  const response = await fetch(`https://graphhopper.com/api/1/geocode?${query}`, { method: 'GET' });

  return await response.json();
};

export const routes = async props => {
  const keys = ['start', 'stop_1', 'stop_2', 'stop_3', 'end'];
  const points = [];
  const point_hints = [];

  for (let i = 0; i < keys.length; i++) {
    const val = props[keys[i]];
    if (val) {
      points.push([val.lng, val.lat]);
      point_hints.push(val.location);
    }
  }

  const response = await fetch('https://graphhopper.com/api/1/route?key=ee4af31e-0f04-4b6c-9f9b-c8a665ec6a89', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      points,
      point_hints,
      snap_preventions: ['motorway', 'ferry', 'tunnel'],
      details: ['road_class', 'surface'],
      vehicle: 'bike',
      locale: 'en',
      instructions: true,
      calc_points: true,
      points_encoded: false,
    }),
  });

  return await response.json();
};
