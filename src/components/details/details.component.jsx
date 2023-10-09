import { useEffect, useState } from 'react';

import { BsArrowLeft } from 'react-icons/bs';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { useMapContext } from '../../providers/mapbox/mapbox.context';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';
import { updateMap } from '../form/form.component';
import { useMobileContext } from '../../providers/mobile/mobile.context';
import { useStopsContext } from '../../providers/stops/stops.context.jsx';
import { addMarker, setMarker } from '../map/functions/map.markers.jsx';
//import * as Location from 'expo-location';

import './details.styles.scss';

const Details = () => {
  const { corState, corDispatch } = useCoordinatesContext();
  const { mapState } = useMapContext();
  const { graphState, graphDispatch } = useGraphhopperContext();
  const { mobileState, mobileDispatch } = useMobileContext();
  const { stopsDispatch } = useStopsContext();
  let searching = true;

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

    navigator.geolocation.getCurrentPosition(async function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      current = [lng, lat];

      const data = await updateMap(e, corState, mapState, graphDispatch);
      const start = data.paths[0].points.coordinates[0];

      mapState.flyTo({
        duration: 4000,
        center: [lng, lat],
        zoom: 18,
        pitch: 0,
        bearing: data.paths[0].instructions[0].heading,
      });

      addMarker(mapState, [lng, lat]);
    });

    if (navigator.geolocation) {
      setInterval(async function () {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (JSON.stringify(current) !== JSON.stringify([lng, lat])) {
            current = [lng, lat];

            /*
            const data = await updateMap(e, corState, mapState, graphDispatch);
            const start = data.paths[0].points.coordinates[0];

            mapState.flyTo({
              duration: 400,
              center: [lng, lat],
              zoom: 18,
              pitch: 0,
              bearing: data.paths[0].instructions[0].heading,
            });
            */

            setMarker(mapState, [lng, lat]);
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
