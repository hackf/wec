import { createContext, useContext } from "react";

const GraphhopperContext = createContext();

export function useGraphhopperContext() {
  return useContext(GraphhopperContext);
}

export default GraphhopperContext;
