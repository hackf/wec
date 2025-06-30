export const getCoordinates = async queryString => {
  const query = new URLSearchParams({
    q: queryString,
    limit: 5,
    debug: true,
    point: '42.31743,-83.02677',
    provider: 'default',
    key: process.env.REACT_APP_API_KEY,
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
  const response = await fetch(`https://graphhopper.com/api/1/route?key=${process.env.REACT_APP_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      points,
      point_hints,
      snap_preventions: ['motorway', 'ferry', 'tunnel'],
      details: ['road_class', 'surface'],
      vehicle: 'racingbike',
      instructions: true,
      calc_points: true,
      points_encoded: false,
      priority: [
        { 'if': 'road_class == MOTORWAY', 'multiply_by': '0.1' },
        { 'if': 'road_class == TRUNK', 'multiply_by': '0.2' },
        { 'if': 'road_class == SECONDARY', 'multiply_by': '0.2' },
        { 'if': 'road_class == PRIMARY', 'multiply_by': '0.8' },
        { 'if': 'road_class == TERTIARY', 'multiply_by': '0.7' },
        { 'if': 'road_class == RESIDENTIAL', 'multiply_by': '1.0' },
        { 'if': 'road_class == ROAD', 'multiply_by': '0.5' },
        { 'if': 'road_class == CYCLEWAY', 'multiply_by': '1.0' },
        { 'if': 'bike_network == MISSING', 'multiply_by': '0.7' },
        { 'if': 'max_speed >= 60', 'multiply_by': '0.1' },
        { 'if': 'lanes > 2', 'multiply_by': '0.2' }
      ]
    })
  });

  return await response.json();
};
