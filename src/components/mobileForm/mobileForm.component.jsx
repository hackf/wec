import { Input } from '../input/input.component';

import { Add } from '../button/button.component';
import { useStopsContext } from '../../providers/stops/stops.context.jsx';

import './mobileForm.styles.scss';
import { useMobileContext } from '../../providers/mobile/mobile.context.jsx';

const MobileForm = () => {
  const { stopsState } = useStopsContext();
  const { mobileState } = useMobileContext();

  function displayStops() {
    console.log(stopsState);
    return stopsState;
  }

  return (
    <div className={mobileState === 'searching' ? 'input' : 'input--hidden'}>
      <>{displayStops()}</>
      {stopsState.length !== 3 ? <Add mobile={true} /> : <></>}
      <Input label="end" type="mobile" placeholder="End Stop" />
    </div>
  );
};

export default MobileForm;
