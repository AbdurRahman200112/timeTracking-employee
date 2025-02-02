import { createSlice } from "@reduxjs/toolkit";

/**
 * Computes elapsed hours, minutes, and seconds given a start time in milliseconds.
 */
const getElapsedTime = (startTime) => {
  if (!startTime) return { hours: 0, minutes: 0, seconds: 0 };

  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);

  return {
    hours: Math.floor(elapsedSeconds / 3600),
    minutes: Math.floor((elapsedSeconds % 3600) / 60),
    seconds: elapsedSeconds % 60,
  };
};

/**
 * Converts a timestamp (in milliseconds) into a MySQL TIME format (HH:MM:SS)
 */
const formatTimeForMySQL = (timestamp) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Converts MySQL TIME format (HH:MM:SS) to milliseconds timestamp
 */
const parseTimeToMilliseconds = (time) => {
  if (!time) return null;
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, seconds, 0); // Set time using local hours
  return now.getTime();
};

// Retrieve startTime from localStorage (if available) and convert it into milliseconds
const savedStartTime = localStorage.getItem("startTime")
  ? parseTimeToMilliseconds(localStorage.getItem("startTime"))
  : null;

const initialState = {
  isRunning: !!savedStartTime, // Running if startTime exists
  startTime: savedStartTime, // Stored timestamp
  elapsedTime: getElapsedTime(savedStartTime), // Compute elapsed time dynamically
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state) => {
      if (!state.isRunning) {
        const newStartTime = Date.now();
        state.isRunning = true;
        state.startTime = newStartTime;
        localStorage.setItem("startTime", formatTimeForMySQL(newStartTime));
      }
    },
    pauseTimer: (state) => {
      state.isRunning = false;
      localStorage.setItem("startTime", formatTimeForMySQL(state.startTime));
    },
    stopTimer: (state) => {
      state.isRunning = false;
      state.startTime = null;
      state.elapsedTime = { hours: 0, minutes: 0, seconds: 0 };
      localStorage.removeItem("startTime");
    },
    updateTime: (state) => {
      if (state.isRunning && state.startTime) {
        state.elapsedTime = getElapsedTime(state.startTime);
      }
    },
  },
});

export const { startTimer, pauseTimer, stopTimer, updateTime } = timerSlice.actions;
export default timerSlice.reducer;
