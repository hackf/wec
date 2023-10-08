import { createContext, useContext } from "react";

const MapContext = createContext();

export function useMapContext() {
  return useContext(MapContext);
}

export default MapContext;
