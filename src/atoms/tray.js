import { atom, useSetAtom, useAtomValue } from "jotai";
import { atomWithImmer } from "jotai-immer";

/**
 * Returns the number within the `targets` array that is closest to the provided `value`
 * @param {number} value The target number
 * @param {number[]} targets The numbers to be tested against
 */
function closestTo(value, targets) {
  if (targets == null || !Array.isArray(targets) || targets.length < 1) {
    throw new Error("parameter targets needs to be an non-empty array of numbers");
  }

  const smallest = { target: null, distance: Number.MAX_SAFE_INTEGER };
  for (let target of targets) {
    const distance = Math.abs(target - value);
    if (smallest.target == null || smallest.distance > distance) {
      smallest.target = target;
      smallest.distance = distance;
    }
  }

  return smallest.target;
}

/**
 * TrayState
 * @typedef {Object} TrayState
 * @property {"opened" | "closed" | "moving"} state
 * @property {Object} styles
 * @property {number[]} snapPoints
 * @property {number} previousY
 */

/**
 * @type TrayState
 */
const initialTrayState = {
  state: "opened",
  styles: { height: 200 },
  snapPoints: [0, 200, 500],
  previousY: 0,
};
const trayAtom = atomWithImmer(initialTrayState);

const dispatchAtom = atom(
  null,
  (_get, set, action) => {
    switch (action.type) {
      case "TrayDragStart":
        set(trayAtom, (state) => {
          state.previousY = action.payload;
        });
        break;
      case "TrayDragMove":
        set(trayAtom, (state) => {
          const newY = action.payload;
          console.log("newY", newY);
          const distance = Math.abs(state.previousY - newY);

          state.styles.height += state.previousY > newY ? distance : distance * -1;
          state.previousY = newY;

          if ("transition" in state.styles) {
            delete state.styles.transition;
          }

          state.state = "moving";
        });
        break;
      case "TrayDragEnd":
        set(trayAtom, (state) => {
          console.log("Styles", state.styles.height);
          const snapPoint = closestTo(state.styles.height, state.snapPoints);
          console.log("snapPoints", snapPoint);
          if (snapPoint === 0) {
            state.state = "closed";
          } else {
            state.state = "opened";
          }
          state.styles.height = snapPoint;
          state.styles.transition = "height 300ms ease-out";
        });
        break;
      case "TrayOpen":
        set(trayAtom, (state) => {
          if (state.state === "closed") {
            state.styles.height = state.snapPoints[1];
            state.state = "opened";
            state.styles.transition = "height 300ms ease-out";
          }
        });
        break;
      case "TrayToggle":
        set(trayAtom, (state) => {
          switch (state.state) {
            case "moving":
              return;
            case "closed":
              state.styles.height = state.snapPoints[1];
              state.state = "opened";
              break;
            case "opened":
              state.styles.height = state.snapPoints[0];
              state.state = "closed";
              break;
          }
          state.styles.transition = "height 300ms ease-out";
        });
        break;
    }
  },
);

const trayStylesAtom = atom(
  (get) => {
    return get(trayAtom).styles;
  },
)

export function useTrayDispatch() {
  return useSetAtom(dispatchAtom);
}

export function useTrayStyles() {
  return useAtomValue(trayStylesAtom);
}
