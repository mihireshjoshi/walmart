import { configureStore } from '@reduxjs/toolkit';
import positionReducer from './positionSlice';

export const store = configureStore({
  reducer: {
    position: positionReducer,
  },
});
