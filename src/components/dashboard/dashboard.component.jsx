import { useMobileContext } from '../../providers/mobile/mobile.context';
import { handleExit } from '../details/details.component';
import { useMapContext } from '../../providers/mapbox/mapbox.context';
import { CgClose } from 'react-icons/cg';

import './dashboard.styles.scss';

const Dashboard = () => {
  const { mapState } = useMapContext();
  const { mobileState, mobileDispatch } = useMobileContext();

  function handleClick(e) {
    e.preventDefault();

    // handleExit(e, mapState, mobileDispatch, corDispatch, stopsDispatch, corState);
    handleExit(e, mapState, mobileDispatch);
  }

  console.log(mobileState);

  return (
    <div className={mobileState === 'route' ? 'dashboard' : 'hidden'}>
      <div className="dashboard__exit">
        <CgClose className="dashboard__icon" />
        <div className="dashboard__button" onClick={handleClick} />
      </div>
      <div className="dashboard__info">
        <div className="dashboard__text">
          <p className="dashboard__text--number">9:53</p>
          <p className="dashboard__text--unit">PM</p>
        </div>
        <div className="dashboard__text">
          <p className="dashboard__text--number">12</p>
          <p className="dashboard__text--unit">MIN</p>
        </div>
        <div className="dashboard__text">
          <p className="dashboard__text--number">4.2</p>
          <p className="dashboard__text--unit">KM</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
