// basic geo helpers
export function toRad(v) { return (v * Math.PI) / 180; }

// rough meters between two lat/lngs
export function distanceMeters(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat/2);
  const sinDLon = Math.sin(dLon/2);
  const aHarv = sinDLat*sinDLat + Math.cos(lat1)*Math.cos(lat2)*sinDLon*sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(aHarv), Math.sqrt(1 - aHarv));
  return R * c;
}

// project point p onto segment ab (lat/lng). Returns { point: {lat,lng}, t, distMeters }
export function projectToSegment(p, a, b) {
  // convert lat/lng to simple cartesian approx using equirectangular projection around p
  const lat0 = p.lat;
  const mPerDegLat = 111132.92 - 559.82 * Math.cos(2*toRad(lat0)) + 1.175 * Math.cos(4*toRad(lat0));
  const mPerDegLng = 111412.84 * Math.cos(toRad(lat0)) - 93.5 * Math.cos(3*toRad(lat0));
  const ax = (a.lng - p.lng) * mPerDegLng;
  const ay = (a.lat - p.lat) * mPerDegLat;
  const bx = (b.lng - p.lng) * mPerDegLng;
  const by = (b.lat - p.lat) * mPerDegLat;
  const px = 0, py = 0; // p at origin

  const vx = bx - ax, vy = by - ay;
  const wx = px - ax, wy = py - ay;
  const vlen2 = vx*vx + vy*vy;
  let t = vlen2 === 0 ? 0 : (vx*wx + vy*wy) / vlen2;
  t = Math.max(0, Math.min(1, t));
  const projx = ax + t*vx;
  const projy = ay + t*vy;
  const dx = projx - px, dy = projy - py;
  const dist = Math.sqrt(dx*dx + dy*dy);
  // convert back to lat/lng
  const lng = p.lng + projx / mPerDegLng;
  const lat = p.lat + projy / mPerDegLat;
  return { point: { lat, lng }, t, distMeters: dist };
}

// find nearest point on polyline (array of [lat,lng]) to pLatLng
export function nearestPointOnPolyline(p, poly) {
  if (!poly || poly.length === 0) return null;
  let best = { distMeters: Infinity, index: 0, t: 0, point: null };
  for (let i = 0; i < poly.length - 1; i++) {
    const a = { lat: poly[i][0], lng: poly[i][1] };
    const b = { lat: poly[i+1][0], lng: poly[i+1][1] };
    const proj = projectToSegment(p, a, b);
    if (proj.distMeters < best.distMeters) {
      best = { distMeters: proj.distMeters, index: i, t: proj.t, point: proj.point };
    }
  }
  return best;
}

// slice polyline into [lat,lng] arrays from fractional index -> end or start -> fractional index
export function slicePolylineFrom(poly, index, t) {
  // build new array starting from projected point
  const out = [];
  if (index < 0) return poly.slice();
  // projected point
  const a = poly[index];
  const b = poly[index+1];
  const lat = a[0] + (b[0] - a[0]) * t;
  const lng = a[1] + (b[1] - a[1]) * t;
  out.push([lat, lng]);
  for (let i = index+1; i < poly.length; i++) out.push(poly[i]);
  return out;
}
export function slicePolylineTo(poly, index, t) {
  const out = [];
  if (index < 0) return [];
  for (let i = 0; i <= index - 1; i++) out.push(poly[i]);
  // projected point
  const a = poly[index];
  const b = poly[index+1];
  const lat = a[0] + (b[0] - a[0]) * t;
  const lng = a[1] + (b[1] - a[1]) * t;
  out.push([lat, lng]);
  return out;
}
