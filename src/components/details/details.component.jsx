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
  let searching = true;

  console.log(route);

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
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    let current = [];
    let data = [];

    navigator.geolocation.getCurrentPosition(async function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      current = [lng, lat];

      data = await updateMap(e, corState, mapState, graphDispatch);
      const start = data.paths[0].points.coordinates[0];
      const user_cor = await math(data.paths[0].points.coordinates, route.point_index, lat, lng);

      handleInputChange([user_cor.inter.y, user_cor.inter.x], 'current_location');
      handleInputChange(data.paths[0].distance, 'distance');
      handleInputChange(data.paths[0].time, 'time');
      handleInputChange(data.paths[0].instructions[0].distance, 'instruction_distance');

      mapState.flyTo({
        duration: 4000,
        center: [user_cor.inter.y, user_cor.inter.x],
        zoom: 17,
        pitch: 40,
        bearing: data.paths[0].instructions[route.instruction_index].heading,
      });
      addMarker(mapState, [user_cor.inter.y, user_cor.inter.x]);
    });

    if (navigator.geolocation) {
      setInterval(async function () {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (JSON.stringify(current) !== JSON.stringify([lng, lat]) && mapState.getSource('nav')) {
            const user_cor = await math(data.paths[0].points.coordinates, route.point_index, lat, lng);

            if (user_cor.path == 2) {
              const new_point_index = route.point_index + 1;
              const instruction_index = route.instruction_index;
              const graphState_data = data.paths[0].instructions[instruction_index];

              if (new_point_index > graphState_data.interval[1]) {
                handleInputChange(new_point_index, 'point_index');
                handleInputChange(route.distance - graphState_data.distance, 'distance');
                handleInputChange(route.time - graphState_data.time, 'time');
                handleInputChange(data.paths[0].instructions[instruction_index + 1], 'instruction_distance');
                handleInputChange(instruction_index + 1, 'instrcution_index');
              } else {
                handleInputChange(new_point_index, 'point_index');
                handleInputChange(
                  route.instruction_distance -
                    distance_meters(
                      data.paths[0].points.coordinates[new_point_index - 2][0],
                      data.paths[0].points.coordinates[new_point_index - 2][1],
                      data.paths[0].points.coordinates[new_point_index - 1][0],
                      data.paths[0].points.coordinates[new_point_index - 1][1]
                    ),
                  'instruction_distance'
                );
              }
              handleInputChange([user_cor.inter.y, user_cor.inter.x], 'current_location');
            }

            console.log(route);

            mapState.flyTo({
              duration: 4000,
              center: [user_cor.inter.y, user_cor.inter.x],
              zoom: 17,
              pitch: 40,
              bearing: data.paths[0].instructions[route.instruction_index].heading,
            });

            setMarker(mapState, [user_cor.inter.y, user_cor.inter.x]);
          }
        });
      }, 10000);
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
