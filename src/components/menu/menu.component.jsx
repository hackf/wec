import Form from '../form/form.component.jsx';
import { Input } from '../input/input.component';
import { Directions } from '../button/button.component';
import Details from '../details/details.component';
import { useMobileContext } from '../../providers/mobile/mobile.context';
import Dashboard from '../dashboard/dashboard.component';
import Card from '../card/card.component';
import { useStopsContext } from '../../providers/stops/stops.context.jsx';

import './menu.styles.scss';

const Menu = () => {
  const { mobileState } = useMobileContext();
  const { graphState } = useStopsContext();

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
        {console.log(graphState)}
        <Card direction="Turn right onto Todd Lane" distance="1000" mobile />
      </div>
    </>
  );
};

export default Menu;
