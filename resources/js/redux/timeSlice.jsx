import { createSlice } from "@reduxjs/toolkit";

/**
 * Converts total milliseconds into { hours, minutes, seconds }.
 */
const msToHMS = (ms) => {
  if (!ms || ms < 0) return { hours: 0, minutes: 0, seconds: 0 };

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

/**
 * Safely parse an integer from localStorage.
 */
const parseIntSafe = (val, defaultVal = 0) => {
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? defaultVal : parsed;
};

// Retrieve any saved data from localStorage
const savedStartTimeMs = parseIntSafe(localStorage.getItem("startTimeMs"), null);
const savedAccumulatedMs = parseIntSafe(localStorage.getItem("accumulatedMs"), 0);

// Determine if we consider ourselves 'running':
// We only consider running if there's a `savedStartTimeMs`.
const isTimerRunning = savedStartTimeMs !== null;

// Compute the current "elapsed" if the timer is running
let initialElapsedMs = savedAccumulatedMs;
if (isTimerRunning) {
  initialElapsedMs += Date.now() - savedStartTimeMs; 
}

// Build your initial state
const initialState = {
  isRunning: isTimerRunning,
  startTime: isTimerRunning ? savedStartTimeMs : null,
  accumulatedMs: isTimerRunning ? savedAccumulatedMs : 0,
  elapsedTime: msToHMS(initialElapsedMs), // { hours, minutes, seconds }
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state) => {
      // "Start" also acts like "Resume". If it’s already running, do nothing.
      if (!state.isRunning) {
        state.isRunning = true;
        // Mark a new "startTime" from now
        state.startTime = Date.now();
        // Save to localStorage
        localStorage.setItem("startTimeMs", state.startTime.toString());
        localStorage.setItem("accumulatedMs", state.accumulatedMs.toString());
      }
    },
    pauseTimer: (state) => {
      if (state.isRunning && state.startTime) {
        // Add whatever time has passed to the accumulated total
        const now = Date.now();
        const delta = now - state.startTime; // ms since last start/resume
        state.accumulatedMs += delta;

        // Update localStorage for accumulated
        localStorage.setItem("accumulatedMs", state.accumulatedMs.toString());

        // Stop timer
        state.isRunning = false;
        state.startTime = null;
        localStorage.removeItem("startTimeMs"); // no longer actively running
      }
    },
    stopTimer: (state) => {
      // Reset everything
      state.isRunning = false;
      state.startTime = null;
      state.accumulatedMs = 0;
      state.elapsedTime = { hours: 0, minutes: 0, seconds: 0 };

      localStorage.removeItem("startTimeMs");
      localStorage.removeItem("accumulatedMs");
    },
    updateTime: (state) => {
      if (state.isRunning && state.startTime) {
        const now = Date.now();
        const totalMs = state.accumulatedMs + (now - state.startTime);
        state.elapsedTime = msToHMS(totalMs);
      } else {
        // If not running, use only the accumulated time
        state.elapsedTime = msToHMS(state.accumulatedMs);
      }
    },
  },
});

export const { startTimer, pauseTimer, stopTimer, updateTime } = timerSlice.actions;
export default timerSlice.reducer;
