import { useRef, useMemo } from "react";
import { createPortal } from "react-dom";

import { Marker } from "react-leaflet/Marker";
import { divIcon } from "leaflet";

function SearchIconPortal({ children, container, portalId=undefined }) {
  return createPortal(children, container, portalId);
}

export default function SearchIcon({ position, color, textColor, number, id }) {
  const containerRef = useRef(document.createElement("div"));

  const icon = useMemo(
    () => divIcon({ html: containerRef.current, className: "", iconSize: [50, 50], iconAnchor: [25, 50] }),
    [],
  );

  return (
    <>
      <Marker position={position} icon={icon}></Marker>
      <SearchIconPortal container={containerRef.current} portalId={`marker-portal-${id}`}>
        <svg
          width="50"
          height="50"
          viewBox="0 0 13.229 13.229"
          version="1.1"
          id="marker"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="shadowBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
          </filter>
          <g id="layer1">
            <path
              style={{fill: "#00000050", strokeWidth: 0.26458}}
              d="m 6.5974319,1.3194864 c 0,0 -3.9099598,0.021146 -3.9584591,3.9808233 -0.031488,2.570823 3.9584591,6.6197963 3.9584591,6.6197963 0,0 4.0031881,-4.0769832 3.9808231,-6.6645247 C 10.54447,1.3468761 6.5974319,1.3194864 6.5974319,1.3194864 Z"
              id="marker1"
              transform="translate(3.5 8) scale(0.8 0.4) skewX(-10)"
              filter="url(#shadowBlur)"
            />
            <path
              style={{fill: color, strokeWidth: 0.26458}}
              d="m 6.5974319,1.3194864 c 0,0 -3.9099598,0.021146 -3.9584591,3.9808233 -0.031488,2.570823 3.9584591,6.6197963 3.9584591,6.6197963 0,0 4.0031881,-4.0769832 3.9808231,-6.6645247 C 10.54447,1.3468761 6.5974319,1.3194864 6.5974319,1.3194864 Z"
              id="marker1"
            />
            <text
              x="50%"
              y="50%"
              fill={textColor}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="0.4rem"
            >
              {number}
            </text>
          </g>
        </svg>
      </SearchIconPortal>
    </>
  );
}
