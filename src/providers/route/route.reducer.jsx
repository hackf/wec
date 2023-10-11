export const initialState = {
  point_index: 1,
  instruction_index: 0,
  current_location: [0, 0],
  time: 0,
  distance: 0,
  instruction_distance: 0,
};

const routeReducer = (state, action) => {
  const { type, payload } = action;
  const { newState } = payload;

  switch (type) {
    case 'CHANGING':
      return { ...newState };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`No case for type ${type} found in routeReducer`);
  }
};

export default routeReducer;
