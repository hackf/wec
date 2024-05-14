import { useStopsContext } from '../../providers/stops/stops.context.jsx';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';

import { Input } from '../input/input.component';

import './button.styles.scss';

export const Add = ({ mobile }) => {
  const { stopsState, stopsDispatch } = useStopsContext();

  function addStop() {
    stopsDispatch([
      ...stopsState,
      <Input
        label={`Stop ${stopsState.length + 1}`}
        id={`Stop ${stopsState.length + 1}`}
        placeholder={mobile ? `Stop ${stopsState.length + 1}` : null}
        type={mobile ? 'mobile' : null}
      />,
    ]);
  }

  return (
    <div className="add">
      <div className={`add__overlay`} onClick={addStop}>
        <p>+ Add Destination</p>
      </div>
      <div className="add__button">
        <Input label="Add" type="mobile" />
      </div>
    </div>
  );
};

export const Directions = () => {
  const { corState } = useCoordinatesContext();

  if (corState.start) {
    return <div className="directions">Directions</div>;
  }

  return <></>;
};
