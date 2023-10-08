export const mapboxReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE":
      state = action.payload.value;
      return state;
    default:
      return state;
  }
};
