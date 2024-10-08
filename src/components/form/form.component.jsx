import { useEffect, useState } from 'react';

import { Input } from '../input/input.component';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { useMapContext } from '../../providers/mapbox/mapbox.context';
import { Add } from '../button/button.component';
import { useStopsContext } from '../../providers/stops/stops.context.jsx';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';
import { updateMap } from './functions/updateMap.jsx';

import './form.styles.scss';

const Form = () => {
  const { corState } = useCoordinatesContext();
  const { mapState } = useMapContext();
  const { stopsState } = useStopsContext();
  const { graphDispatch } = useGraphhopperContext();

  async function handleSubmit(e) {
    e.preventDefault();

    const data = await updateMap(corState, mapState, graphDispatch);

    const start = data.paths[0].points.coordinates[0];

    mapState.flyTo({
      duration: 4000,
      center: [start[0], start[1]],
      zoom: 17,
      //pitch: 0,
      //bearing: data.paths[0].instructions[0].heading,
    });
  }

  function displayStops() {
    return stopsState;
  }

  return (
    <form className={`form form__${stopsState.length === 3 ? 'full' : ''} `} onSubmit={handleSubmit}>
      <div className="form__inputs">
        <Input label="Start" />
        <>{displayStops()}</>
        <Input label="End" />
      </div>
      {stopsState.length !== 3 ? <Add /> : <></>}
      <input type="submit" value="Submit" className="form__button" />
    </form>
  );
};

export default Form;
