import { atom } from "jotai";

export const routeProgressAtom = atom({
  snappedIndex: 0,
  snappedT: 0,
  snappedPoint: null,
});
