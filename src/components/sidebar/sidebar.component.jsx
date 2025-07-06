import { useState, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

import { BsArrowLeft } from 'react-icons/bs';
import { BsArrowRight } from 'react-icons/bs';

import Card from '../card/card.component.jsx';
import useRoute from "../../atoms/route";

import './sidebar.styles.scss';

const Sidebar = () => {
  const [isOpen, setOpen] = useState(false);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Directions',
    onBeforeGetContent: () => {
      return new Promise(resolve => {
        setTimeout(resolve, 500);
      });
    },
  });

  const toggleSideBar = useCallback(
    () => {
      setOpen((state) => !state);
    },
    [setOpen],
  );

  const [routeState,] = useRoute();

  return (
    <div className={`sidebar ${isOpen ? 'activate' : ''}`}>
      <div className="sidebar__open">
        <div className="sidebar__button--container" onClick={toggleSideBar}>
          { isOpen
            ? <BsArrowRight className="sidebar__button" />
            : <BsArrowLeft className="sidebar__button" /> }
        </div>
      </div>
      <div className="sidebar__content">
        <div ref={componentRef} className="sidebar__content--ref">
          <div className="sidebar__content--title">Directions</div>
          {routeState.state === "done" ? (
            <>
              <button onClick={handlePrint}>Print</button>
              <div className="sidebar__content--instructions">
                {
                  routeState.data.instructions.map((instruction, index) => {
                    return <Card distance={Math.round(instruction.distance)} direction={instruction.text} key={index} />;
                  })
                }
              </div>
            </>
          ) : (
            <p className="sidebar__content--noContent">
              Directions will appear here after submitting your desired stops. Please select and submit your stops in
              the Windsor Essex Cycling form.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
