import addMilliseconds from "date-fns/addMilliseconds";
import format from "date-fns/format";
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';

import './dashboard.styles.scss';

const Dashboard = () => {
  const { graphState } = useGraphhopperContext();

  if (graphState) {
    const distance = graphState.paths[0].distance / 1000;

    const time = graphState.paths[0].time;

    const totalMinutes = time / 60000;
    const minutes = totalMinutes - 60 >= 0 ? totalMinutes - (Math.floor(totalMinutes / 60) * 60) : totalMinutes;
    const hours = totalMinutes / 60;

    const today = new Date();
    const arrive = addMilliseconds(today, time);

    return (
      <div className="dashboard">
        <div className="dashboard__text">
          <div className="dashboard__label">
            Arrival Time
          </div>
          <div className="dashboard__value">
            <span className="dashboard__text--number">
              {format(arrive, "h:mm a")}
            </span>
          </div>
        </div>
        <div className="dashboard__text">
          <div className="dashboard__label">
            Travel Time
          </div>
          <div className="dashboard__value">
            { hours > 1
              ? (
                <>
                  <span className="dashboard__text--number">
                    {hours.toLocaleString(
                      "en-CA",
                      { style: "decimal", maximumFractionDigits: 0 },
                    )}
                  </span>
                  <span className="dashboard__text--unit">HR</span>
                </>
              )
              : null
            }
            <span className="dashboard__text--number">
              {minutes.toLocaleString(
                "en-CA",
                { style: "decimal", maximumFractionDigits: 0 },
              )}
            </span>
            <span className="dashboard__text--unit">MIN</span>
          </div>
        </div>
        <div className="dashboard__text">
          <div className="dashboard__label">
            Distance
          </div>
          <div className="dashboard__value">
            <span className="dashboard__text--number">
              {distance.toLocaleString(
                "en-CA",
                { style: "decimal", maximumFractionDigits: 1 },
              )}
            </span>
            <span className="dashboard__text--unit">KM</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
