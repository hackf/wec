// calculate the linear line of the two points on the road
function line(x2, y2, x1, y1) {
  const m = (y2 - y1) / (x2 - x1);
  const b = y2 - m * x2;

  return m;
}

// create the perpendicluar line off the original line
function perpendicular(m1, x, y) {
  const m2 = -1 / m1;
  const b = y - m2 * x;

  return find_point(m2, b, x);
}

// get another point on the perpendicular line
function find_point(m, b, x) {
  const y = m * -x + b;

  return { x4: -x, y4: y };
}

// calculate the intersection off the line
function intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y };
}

//calculate distance
function distance(x1, y1, x2, y2) {
  const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return d;
}

function main(x1, y1, x2, y2, x3, y3) {
  const m1 = line(x1, y1, x2, y2);
  const { x4, y4 } = perpendicular(m1, x3, y3);

  const inter = intersection(x1, y1, x2, y2, x3, y3, x4, y4);
  const d = distance(x3, y3, inter.x, inter.y);

  return { inter, d };
}

export default function math(data, point_index, x3, y3) {
  const path1 = main(
    data[point_index - 1][1],
    data[point_index - 1][0],
    data[point_index][1],
    data[point_index][0],
    x3,
    y3
  );
  const path2 = main(
    data[point_index][1],
    data[point_index][0],
    data[point_index + 1][1],
    data[point_index + 1][0],
    x3,
    y3
  );

  if (path1.d < path2.d) {
    return { path: 1, inter: path1.inter };
  } else {
    return { path: 2, inter: path2.inter };
  }
}

///////////////////////////

export function distance_meters(lat1, lon1, lat2, lon2) {
  return (
    Math.acos(
      Math.sin(radians(lat1)) * Math.sin(radians(lat2)) +
        Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.cos(radians(lon2) - radians(lon1))
    ) *
    6371 *
    1000
  );
}

function radians(x) {
  return x * (Math.PI / 180);
}
