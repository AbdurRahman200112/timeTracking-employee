import { createSlice } from "@reduxjs/toolkit";

const getElapsedTime = (startTime) => {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  return {
    hours: Math.floor(elapsedSeconds / 3600),
    minutes: Math.floor((elapsedSeconds % 3600) / 60),
    seconds: elapsedSeconds % 60,
  };
};

const initialState = {
  isRunning: false,
  startTime: localStorage.getItem("startTime") ? parseInt(localStorage.getItem("startTime")) : null,
  elapsedTime: localStorage.getItem("startTime")
    ? getElapsedTime(parseInt(localStorage.getItem("startTime")))
    : { hours: 0, minutes: 0, seconds: 0 },
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state) => {
      if (!state.isRunning) {
        state.isRunning = true;
        state.startTime = Date.now();
        localStorage.setItem("startTime", state.startTime);
        localStorage.setItem("isRunning", "true");
      }
    },
    updateTime: (state) => {
      if (state.isRunning && state.startTime) {
        state.elapsedTime = getElapsedTime(state.startTime);
      }
    },
    pauseTimer: (state) => {
      state.isRunning = false;
      localStorage.setItem("isRunning", "false");
    },
    stopTimer: (state) => {
      state.isRunning = false;
      state.startTime = null;
      state.elapsedTime = { hours: 0, minutes: 0, seconds: 0 };
      localStorage.removeItem("startTime");
      localStorage.setItem("isRunning", "false");
    },
  },
});

export const { startTimer, updateTime, pauseTimer, stopTimer } = timerSlice.actions;
export default timerSlice.reducer;
