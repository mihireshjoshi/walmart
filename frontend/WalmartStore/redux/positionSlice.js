import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userPosition: { x: 0, y: 0 },
};

const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    setPosition: (state, action) => {
      state.userPosition = action.payload;
    },
  },
});

export const { setPosition } = positionSlice.actions;

export default positionSlice.reducer;
