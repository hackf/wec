import Form from '../form/form.component.jsx';
import { Input } from '../input/input.component';
import { Directions } from '../button/button.component';
import Details from '../details/details.component';
import { useMobileContext } from '../../providers/mobile/mobile.context';
import Dashboard from '../dashboard/dashboard.component';
import Card from '../card/card.component';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';
import useRoute from '../../providers/route/route.context';
import { distance_meters } from '../math/math.component.jsx';

import './menu.styles.scss';

const Menu = () => {
  const { mobileState } = useMobileContext();
  const { graphState } = useGraphhopperContext();
  const { route } = useRoute();

  function calc_distance() {
    const distance_traveled = distance_meters(
      route.current_location[1],
      route.current_location[0],
      graphState.paths[0].points.coordinates[route.point_index - 1][1],
      graphState.paths[0].points.coordinates[route.point_index - 1][0]
    );
    return route.instruction_distance - distance_traveled;
  }

  return (
    <>
      <div className="menu--computer">
        <h1 className="menu__title">Windsor Essex Cycling</h1>
        <Form />
      </div>
      <div className={mobileState === 'searching' ? 'input' : 'input--hidden'}>
        <Input label="end" type="mobile" />
      </div>
      <Details />
      <Dashboard />
      <div className={mobileState === 'route' ? 'menu__direction' : 'hidden'}>
        <Card
          direction={graphState ? graphState.paths[0].instructions[route.instruction_index + 1].text : ''}
          distance={graphState ? calc_distance() : ''}
          mobile
        />
      </div>
    </>
  );
};

export default Menu;
