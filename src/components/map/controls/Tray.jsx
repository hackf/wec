import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

import { useTrayDispatch, useTrayStyles } from "../../../atoms/tray";

import trayClasses from "./Tray.module.css";

export default function Tray({ children }) {
  const trayDispatch = useTrayDispatch()
  const onTrayStart = useCallback((event) => {
    if (event.type === "touchstart") {
      trayDispatch({ type: "TrayDragStart", payload: event.changedTouches[0].pageY });
    } else if (event.type === "dragstart") {
      const img = new Image();
      event.dataTransfer.setDragImage(img, 0, 0);
      trayDispatch({ type: "TrayDragStart", payload: event.pageY });
    }
  }, [trayDispatch]);

  const onTrayMove = useCallback((event) => {
    if (event.type === "touchmove") {
      trayDispatch({ type: "TrayDragMove", payload: event.changedTouches[0].pageY });
    } else if (event.type === "drag") {
      // TODO: Just before the `dragend` event is triggered a `drag` event is also
      // triggered but with `pageY` set to zero. Not sure why this happens. This is a
      // hack to get around this issue until I can figure out why it's happening
      if (event.pageY > 0) {
        trayDispatch({ type: "TrayDragMove", payload: event.pageY });
      }
    }
  }, [trayDispatch]);

  const onTrayEnd = useCallback(() => {
    trayDispatch({ type: "TrayDragEnd" });
  }, [trayDispatch]);

  const trayStyles = useTrayStyles();

  return (
    <div className={trayClasses["tray"]}>
      <button
        className={trayClasses["tray-draggable"]}
        onDragStart={onTrayStart}
        onDragEnd={onTrayEnd}
        onDrag={onTrayMove}
        onTouchStart={onTrayStart}
        onTouchMove={onTrayMove}
        onTouchEnd={onTrayEnd}
        draggable={true}
      >
        <FontAwesomeIcon icon={faGripLines} />
      </button>
      <div style={trayStyles} className={trayClasses["tray-content"]}>
        { children }
      </div>
    </div>
  );
}
