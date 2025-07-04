import { useCallback } from 'react';

import { Input } from '../input/input.component';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { Add } from '../button/button.component';
import { useStopsContext } from '../../providers/stops/stops.context.jsx';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';
import { fetchRoute } from '../map/functions/map.routes';

import './form.styles.scss';

const Form = () => {
  const { corState } = useCoordinatesContext();
  const { stopsState } = useStopsContext();
  const { graphDispatch } = useGraphhopperContext();

  const handleSubmit = useCallback(
    function handleSubmit(e) {
      e.preventDefault();
      fetchRoute(corState)
        .then(data => {
          graphDispatch(data);
        });
    },
    [corState, graphDispatch],
  );

  return (
    <form className={`form form__${stopsState.length === 3 ? 'full' : ''} `} onSubmit={handleSubmit}>
      <div className="form__inputs">
        <Input key="stop-start" label="Start" />
        {stopsState}
        <Input key="stop-end" label="End" />
      </div>
      {stopsState.length !== 3 ? <Add /> : null}
      <input type="submit" value="Submit" className="form__button" />
    </form>
  );
};

export default Form;
