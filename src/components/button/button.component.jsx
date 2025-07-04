import { useStopsContext } from '../../providers/stops/stops.context.jsx';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';

import { Input } from '../input/input.component';

import './button.styles.scss';

export const Add = () => {
  const { stopsState, stopsDispatch } = useStopsContext();

  function addStop() {
    stopsDispatch([
      ...stopsState,
      <Input
        label={`Stop ${stopsState.length + 1}`}
        id={`Stop ${stopsState.length + 1}`}
        key={`Stop ${stopsState.length + 1}`}
      />,
    ]);
  }

  return (
    <div className="add">
      <button
        className="add__button"
        onClick={addStop}
        type="button"
      >
        + Add Destination
      </button>
    </div>
  );
};

export const Directions = () => {
  const { corState } = useCoordinatesContext();

  if (corState.start) {
    return <div className="directions">Directions</div>;
  }

  return null;
};
