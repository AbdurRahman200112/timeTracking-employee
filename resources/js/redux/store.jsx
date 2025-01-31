import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./timeSlice";

export const store = configureStore({
  reducer: {
    timer: timerReducer,
  },
});

export default store;
