import CustomControls from "./CustomControls";

import Tray from "./Tray";

import mapTraylasses from "./MapTray.module.css";

export default function MapTray({ children }) {
  return (
    <CustomControls className={mapTraylasses["map-tray"]} useLeafletStyles={false} position="tray">
      <Tray>
        { children }
      </Tray>
    </CustomControls>
  );
}

