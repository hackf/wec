import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useGraphhopperContext } from '../../providers/graphhopper/graphhopper.context';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { BsArrowLeft } from 'react-icons/bs';
import { BsArrowRight } from 'react-icons/bs';
import Card from '../card/card.component.jsx';

import './sidebar.styles.scss';

const Sidebar = () => {
  const [isOpen, setOpen] = useState(false);
  const { graphState } = useGraphhopperContext();
  const { corState } = useCoordinatesContext();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const on_click = () => {
    setOpen(!isOpen);
  };

  const get_distance = (data, index) => {
    if (index === 0) {
      return undefined;
    }

    return Math.round(data[index - 1].distance);
  };

  const displayInstructions = () => {
    let instructions;
    if (graphState && isOpen) {
      //const data = graphState.paths[0].instructions.slice(0, 20)
      const data = graphState.paths[0].instructions;

      instructions = data.map((i, index) => {
        return <Card distance={get_distance(data, index)} direction={i.text} key={index} />;
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
    <div className={`sidebar ${isOpen === true ? 'activate' : ''}`}>
      <div className="sidebar__open">
        <div className="sidebar__button--container" onClick={on_click}>
          {display_arrow()}
        </div>
      </div>
      <div className="sidebar__content" ref={componentRef}>
        <div className="sidebar__content--title">Directions</div>
        {displayInstructions() ? (
          <>
            <button onClick={handlePrint}>Print</button>
            <h2>
              {corState.start.location.slice(0, corState.start.location.indexOf(','))} to{' '}
              {corState.end.location.slice(0, corState.end.location.indexOf(','))}
            </h2>
            <div className="sidebar__content--instructions">{displayInstructions()}</div>
          </>
        ) : (
          <p className="sidebar__content--noContent">
            Directions will appear here after submitting your desired stops. Please select and submit your stops in the
            Windsor Essex Cycling form.
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
