import { useEffect, useState } from 'react';

import { BsArrowLeft } from 'react-icons/bs';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { useMapContext } from '../../providers/mapbox/mapbox.context';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';
import { updateMap } from '../form/form.component';
import { useMobileContext } from '../../providers/mobile/mobile.context';
import { useStopsContext } from '../../providers/stops/stops.context.jsx';
import { useRouteContext } from '../../providers/route/route.context.jsx';
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
  const { routeState, routeDispatch } = useRouteContext();
  let searching = true;

  console.log(routeState);

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

      console.log(data);

      const user_cor = await math(data.paths[0].points.coordinates, routeState.point_index, lat, lng);

      routeDispatch([
        { field: 'current_location', val: [user_cor.inter.y, user_cor.inter.x] },
        { field: 'distance', val: data.paths[0].distance },
        { field: 'time', val: data.paths[0].time },
        { field: 'instruction_distance', val: data.paths[0].instructions[0].distance },
      ]);

      mapState.flyTo({
        duration: 4000,
        center: [user_cor.inter.y, user_cor.inter.x],
        zoom: 17,
        pitch: 40,
        bearing: data.paths[0].instructions[routeState.instruction_index].heading,
      });
      addMarker(mapState, [user_cor.inter.y, user_cor.inter.x]);
    });

    if (navigator.geolocation) {
      setInterval(async function () {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (JSON.stringify(current) !== JSON.stringify([lng, lat]) && mapState.getSource('nav')) {
            current = [lng, lat];

            /*
            const data = await updateMap(e, corState, mapState, graphDispatch);
            const start = data.paths[0].points.coordinates[0];
            */

            const user_cor = await math(data.paths[0].points.coordinates, routeState.point_index, lat, lng);

            if (user_cor.path == 2) {
              const new_point_index = routeState.point_index + 1;
              const instruction_index = routeState.instructions_index;
              const graphState_data = graphState.paths[0].instructions[instruction_index];
              routeDispatch({ filed: 'point_index', val: new_point_index });

              if (new_point_index > graphState_data.interval[1]) {
                routeDispatch([
                  { filed: 'distance', val: routeState.distance - graphState_data.distance },
                  { field: 'time', val: routeState.time - graphState_data.time },
                  {
                    field: 'instruction_distance',
                    val: graphState.paths[0].instructions[instruction_index + 1],
                  },
                  { field: 'instrcution_index', val: instruction_index + 1 },
                  { field: 'current_location', val: [user_cor.inter.y, user_cor.inter.x] },
                ]);
              } else {
                routeDispatch([
                  {
                    field: 'instruction_distance',
                    val:
                      routeState.instruction_distance -
                      distance_meters(
                        graphState.paths[0].points.coordinates[new_point_index - 2][0],
                        graphState.paths[0].points.coordinates[new_point_index - 2][1],
                        graphState.paths[0].points.coordinates[new_point_index - 1][0],
                        graphState.paths[0].points.coordinates[new_point_index - 1][1]
                      ),
                  },
                  { field: 'current_location', val: [user_cor.inter.y, user_cor.inter.x] },
                ]);
              }
            }

            mapState.flyTo({
              duration: 4000,
              center: [user_cor.inter.y, user_cor.inter.x],
              zoom: 17,
              pitch: 40,
              bearing: data.paths[0].instructions[routeState.instruction_index].heading,
            });
            setMarker(mapState, [user_cor.inter.y, user_cor.inter.x]);
          }
        });
      }, 10);
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
