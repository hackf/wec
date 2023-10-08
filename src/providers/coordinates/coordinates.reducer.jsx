export const coordinatesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'TYPING':
      state[action.payload.id] = 'test';
      return state;
    default:
      return state;
  }
};
