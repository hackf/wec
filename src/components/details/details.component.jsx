import { useEffect, useState } from 'react';

import { BsArrowLeft } from 'react-icons/bs';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { useMapContext } from '../../providers/mapbox/mapbox.context';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';
import { updateMap } from '../form/form.component';
import { useMobileContext } from '../../providers/mobile/mobile.context';
import { useStopsContext } from '../../providers/stops/stops.context.jsx';
import useRoute from '../../providers/route/route.context.jsx';
import { addMarker, setMarker } from '../map/functions/map.markers.jsx';
import math, { distance_meters } from '../math/math.component.jsx';
//import * as Location from 'expo-location';

import './details.styles.scss';

const Details = () => {
  const { corState, corDispatch } = useCoordinatesContext();
  const { mapState } = useMapContext();
  const { graphState, graphDispatch } = useGraphhopperContext();
  const { mobileState, mobileDispatch } = useMobileContext();
  const { stopsDispatch } = useStopsContext();
  const { route, handleInputChange } = useRoute();
  const localRoute = {
    point_index: 1,
    instruction_index: 0,
    current_location: [0, 0],
    time: 0,
    distance: 0,
    instruction_distance: 0,
  };
  let searching = true;
  let current = [];

  // Converts from degrees to radians.
  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  // Converts from radians to degrees.
  function toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  function bearing(startLat, startLng, destLat, destLng) {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x =
      Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        await corDispatch({
          field: 'start',
          lat,
          lng,
          location: 'Current Location',
        });
      });
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    let data = [];

    navigator.geolocation.getCurrentPosition(async function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      current = [lng, lat];

      data = await updateMap(e, corState, mapState, graphDispatch);
      const start = data.paths[0].points.coordinates[0];
      const user_cor = await math(data.paths[0].points.coordinates, localRoute.point_index, lat, lng);

      localRoute.time = data.paths[0].time;
      localRoute.distance = data.paths[0].distance;
      localRoute.instruction_distance = data.paths[0].instructions[localRoute.instruction_index].distance;
      localRoute.current_location = [user_cor.inter.y, user_cor.inter.x];

      handleInputChange(localRoute);

      mapState.flyTo({
        duration: 4000,
        center: [user_cor.inter.y, user_cor.inter.x],
        zoom: 17,
        pitch: 40,
        bearing: data.paths[0].instructions[localRoute.instruction_index].heading,
      });
      addMarker(mapState, [user_cor.inter.y, user_cor.inter.x]);
    });

    if (navigator.geolocation) {
      setInterval(async function () {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (JSON.stringify(current) !== JSON.stringify([lng, lat]) && mapState.getSource('nav')) {
            const user_cor = await math(data.paths[0].points.coordinates, localRoute.point_index, lat, lng);
            current = [lng, lat];

            if (user_cor.path == 2) {
              const graphState_data = data.paths[0].instructions[localRoute.instruction_index];

              localRoute.point_index += 1;
              localRoute.instruction_index += 1;

              if (localRoute.point_index > graphState_data.interval[1]) {
                localRoute.time -= graphState_data.time;
                localRoute.distance -= graphState_data.distance;
                localRoute.instruction_distance = data.paths[0].instructions[localRoute.instruction_index].distance;
              } else {
                localRoute.instruction_distance -= distance_meters(
                  data.paths[0].points.coordinates[localRoute.point_index - 2][0],
                  data.paths[0].points.coordinates[localRoute.point_index - 2][1],
                  data.paths[0].points.coordinates[localRoute.point_index - 1][0],
                  data.paths[0].points.coordinates[localRoute.point_index - 1][1]
                );
              }
            }

            localRoute.current_location = [user_cor.inter.y, user_cor.inter.x];

            handleInputChange(localRoute);

            console.log(data);

            mapState.flyTo({
              duration: 4000,
              center: [user_cor.inter.y, user_cor.inter.x],
              zoom: 17,
              pitch: 40,
              bearing: bearing(
                data.paths[0].points.coordinates[localRoute.point_index - 1][1],
                data.paths[0].points.coordinates[localRoute.point_index - 1][0],
                data.paths[0].points.coordinates[localRoute.point_index][1],
                data.paths[0].points.coordinates[localRoute.point_index][0]
              ),
            });

            setMarker(mapState, [user_cor.inter.y, user_cor.inter.x]);
          }
        });
      }, 100);
    }

    mobileDispatch('route');
  }

  function handleClick(e) {
    e.preventDefault();

    handleExit(e, mapState, mobileDispatch, corDispatch, stopsDispatch, corState);
  }

  return (
    <>
      <div className={mobileState === 'details' ? 'exit' : 'hidden'}>
        <BsArrowLeft className="exit__icon" />
        <div className="exit__button" onClick={handleClick} />
      </div>
      <div className={mobileState === 'details' ? 'container' : 'hidden'}>
        <div className="info">
          <div className="info__circle info__circle--red" />
          <p className="info__label info__label--start">Start</p>
          <p className="info__location info__location--start">
            {corState.start ? corState.start.location : 'Chose a starting point'}
          </p>
          <div className="info__line" />
          <div className="info__circle info__circle--blue" />
          <p className="info__label info__label--end">End</p>
          <p className="info__location info__location--end">
            {corState.end ? corState.end.location : 'Chose a ending point'}
          </p>
        </div>
        <div className="button button--add">Add Desination</div>
        <div className="button button--start" onClick={handleSubmit}>
          Start
        </div>
      </div>
    </>
  );
};

export const handleExit = (e, mapState, mobileDispatch, corDispatch, stopsDispatch, corState) => {
  if (mapState.getStyle().layers.some(e => e.id === 'route')) {
    mapState.removeLayer('route');
    mapState.removeSource('route');
  }

  const keys = ['stop_1', 'stop_2', 'stop_3', 'end'];

  corDispatch({}, corState.start);
  stopsDispatch([]);

  
  mapState.flyTo({
    duration: 4000,
    center: [-83.0363633, 42.3149367],
    zoom: 12,
    pitch: 45,
    bearing: -17.6,
  });

  mobileDispatch('searching');
  
};

export default Details;
