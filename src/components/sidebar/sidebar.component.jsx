import { useState } from 'react';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';
import { BsArrowLeft } from 'react-icons/bs';
import { BsArrowRight } from 'react-icons/bs';
import Card from '../card/card.component.jsx';

import './sidebar.styles.scss';

const Sidebar = () => {
  const [isOpen, setOpen] = useState(false);
  const { graphState } = useGraphhopperContext();

  const on_click = () => {
    setOpen(!isOpen);
  };

  const get_distance = (data, index) => {
    if (index === 0) {
      return undefined;
    }

    console.log(index);
    console.log(data);

    return Math.round(data[index - 1].distance);
  };

  const displayInstructions = () => {
    let instructions;
    if (graphState && isOpen) {
      //const data = graphState.paths[0].instructions.slice(0, 20)
      const data = graphState.paths[0].instructions;

      instructions = data.map((i, index) => {
        return <Card distance={get_distance(data, index)} direction={i.text} />;
        //return <p>{`In ${Math.round(i.distance)} meters ${i.text}`}</p>;
      });
    }
    return instructions;
  };

  const display_arrow = () => {
    if (isOpen) {
      return <BsArrowRight className="sidebar__button" />;
    }

    return <BsArrowLeft className="sidebar__button" />;
  };

  return (
    <div class={`sidebar ${isOpen === true ? 'activate' : ''}`}>
      <div className="sidebar__open">
        <div className="sidebar__button--container" onClick={on_click}>
          {display_arrow()}
        </div>
      </div>
      <div className="sidebar__content">
        <div className="sidebar__content--title">Directions</div>
        {displayInstructions()}
      </div>
    </div>
  );
};

export default Sidebar;
