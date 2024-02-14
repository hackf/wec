import { BsArrow90DegLeft } from 'react-icons/bs';
import { BsArrow90DegRight } from 'react-icons/bs';
import { BsArrowUp } from 'react-icons/bs';

import './card.styles.scss';

const Card = ({ distance, direction, mobile }) => {
  const display_distance = x => {
    if (x === undefined) {
      return <></>;
    }

    return <div className="card__visual--distance">{round_numbers(x)}</div>;
  };

  const round_numbers = x => {
    if (x >= 1000) {
      return `${Math.round(x / 100) / 10} KM`;
    }

    return `${Math.round(x)} M`;
  };

  const choose_arrow = x => {
    if (x.includes('Turn right') || x.includes('Turn slight right')) {
      return <BsArrow90DegRight />;
    } else if (x.includes('Turn left') || x.includes('Turn slight left')) {
      return <BsArrow90DegLeft />;
    }

    return <BsArrowUp />;
  };

  return (
    <div className={`card ${mobile ? 'card--mobile' : ''}`}>
      <div className={`card__visual card__visual--${distance === undefined ? 'full' : 'halves'}`}>
        {choose_arrow(direction)}
        {display_distance(distance)}
      </div>
      <div className="card__info">{direction}</div>
    </div>
  );
};

export default Card;
