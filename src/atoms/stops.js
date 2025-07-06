import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";

/**
 * Stop
 * @typedef {Object} Stop
 * @property {number} lat
 * @property {number} lng
 * @property {string} label
 */

const stopsAtom = atomWithImmer([]);

const addStopAtom = atom(
  null,
  (_get, set) => {
    set(stopsAtom, (stops) => {
      if (stops.length > 4) {
        return;
      }
      stops.push({ lat: null, lng: null });
    });
  },
);

const updateStopAtom = atom(
  null,
  (_get, set, data) => {
    set(stopsAtom, (stops) => {
      if (data.index - 1 > stops.length - 1) {
        return;
      }
      stops[data.index - 1] = data;
    });
  },
);

export function useStops() {
  return useAtomValue(stopsAtom);
}

export function useAddStops() {
  return useSetAtom(addStopAtom);
}

export function useUpdateStop() {
  return useSetAtom(updateStopAtom);
}
