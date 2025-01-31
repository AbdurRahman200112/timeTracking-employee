import { createSlice } from "@reduxjs/toolkit";

/**
 * Helper: Computes elapsed hours, minutes, seconds given a start time in ms.
 */
const getElapsedTime = (startTime) => {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  return {
    hours: Math.floor(elapsedSeconds / 3600),
    minutes: Math.floor((elapsedSeconds % 3600) / 60),
    seconds: elapsedSeconds % 60,
  };
};

// Check localStorage for a saved startTime
const savedStartTime = localStorage.getItem("startTime")
  ? parseInt(localStorage.getItem("startTime"), 10)
  : null;

// If we have a saved startTime, calculate how much time has passed
const savedElapsedTime = savedStartTime
  ? getElapsedTime(savedStartTime)
  : { hours: 0, minutes: 0, seconds: 0 };

const initialState = {
  isRunning: false,
  startTime: savedStartTime,      // e.g. 1682580112345
  elapsedTime: savedElapsedTime,  // e.g. { hours: 0, minutes: 10, seconds: 55 }
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state) => {
      // Mark the timer as running but DO NOT reset elapsedTime
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      // Temporarily stop incrementing time, but keep the current elapsedTime
      state.isRunning = false;
    },
    stopTimer: (state) => {
      // Fully reset
      state.isRunning = false;
      state.elapsedTime = { hours: 0, minutes: 0, seconds: 0 };
      state.startTime = null;
      localStorage.removeItem("startTime"); // Clear from localStorage as well
    },
    updateTime: (state) => {
      // Increment the elapsed time by 1 second if running
      if (state.isRunning) {
        let { hours, minutes, seconds } = state.elapsedTime;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
        state.elapsedTime = { hours, minutes, seconds };
      }
    },

    /**
     * Optional: A helper action if you want to store the current time (Date.now())
     * into `startTime` and localStorage. This is NOT called by default—see notes below.
     */
    setStartTime: (state, action) => {
      const newStartTime = action.payload || Date.now();
      state.startTime = newStartTime;
      localStorage.setItem("startTime", newStartTime.toString());
    },
  },
});

export const {
  startTimer,
  pauseTimer,
  stopTimer,
  updateTime,
  setStartTime,
} = timerSlice.actions;

export default timerSlice.reducer;
