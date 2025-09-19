import { useCallback, useMemo } from "react";

import { useTrayDispatch } from "../../../atoms/tray";
import { useLocation } from "wouter";

import buttonClasses from "./ControlNavigationButton.module.css";

export default function ControlNavigationButton({ onClick, children, href }) {
  const [location, ] = useLocation();

  const stateStyles = useMemo(() => {
    return (href === location) ? buttonClasses["active"] : "";
  }, [href, location]);

  const trayDispatch = useTrayDispatch();
  const openTray = useCallback((event) => {
    trayDispatch({ type: "TrayOpen" });
    onClick(event);
  }, [trayDispatch]);

  return (
    <button onClick={openTray} className={stateStyles}>
      { children }
    </button>
  );
}

