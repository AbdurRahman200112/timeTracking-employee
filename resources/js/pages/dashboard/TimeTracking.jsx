import React, { useEffect, useRef, useState } from "react";
import { Button } from "@material-tailwind/react";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  startTimer,
  updateTime,
  pauseTimer,
  stopTimer,
} from "../../redux/timeSlice";

export function TimeTracking() {
  const dispatch = useDispatch();
  const { elapsedTime, isRunning } = useSelector((state) => state.timer);

  // Distinguish between paused vs. fully stopped
  const [isPaused, setIsPaused] = useState(false);

  // Interval for the main working timer
  const intervalRef = useRef(null);

  // Table data from backend
  const [timeEntries, setTimeEntries] = useState([]);

  // Reverse-geocoded city name
  const [cityName, setCityName] = useState("");

  // --------------------------------------------------------------------
  // 1. If the timer was running on mount, restart the interval
  // --------------------------------------------------------------------
  useEffect(() => {
    if (isRunning) {
      startTimerInterval();
    }
  }, [isRunning]);

  // --------------------------------------------------------------------
  // 2. Fetch existing time entries from DB (example)
  // --------------------------------------------------------------------
  useEffect(() => {
    const fetchTimeTrackingData = async () => {
      try {
        const response = await axios.get("/api/time-tracking", {
          withCredentials: true, // Make sure cookies/sessions are sent
        });
        setTimeEntries(response.data);
      } catch (error) {
        console.error("Error fetching time tracking data:", error);
      }
    };
    fetchTimeTrackingData();
  }, []);

  // --------------------------------------------------------------------
  // Timer logic
  // --------------------------------------------------------------------
  const startTimerInterval = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        dispatch(updateTime());
      }, 1000);
    }
  };

  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Helper: format time as HH:MM:SS (24-hour)
  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour12: false }); // e.g. "08:30:00"
  };

  // --------------------------------------------------------------------
  // 3. Start => calls geolocation, reverse-geocode, stores start time in localStorage
  // --------------------------------------------------------------------
  const handleStartWithGeo = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Coordinates:", latitude, longitude);

        // Reverse-geocode city name (optional)
        let determinedCity = "Unknown location";
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC9NY_mMXuLB2oTMbZMG4vYO0Y0VqfbrlQ`;
          const geoRes = await fetch(geocodeUrl);
          const geoData = await geoRes.json();

          if (geoData.results && geoData.results.length > 0) {
            let foundCity = null;
            const comps = geoData.results[0].address_components || [];
            for (const c of comps) {
              if (c.types.includes("locality")) {
                foundCity = c.long_name;
                break;
              }
            }
            if (foundCity) {
              determinedCity = foundCity;
            } else if (geoData.results[0].formatted_address) {
              determinedCity = geoData.results[0].formatted_address;
            }
          }
        } catch (err) {
          console.error("Error reverse-geocoding:", err);
        }
        setCityName(determinedCity);

        // Format local time => "HH:MM:SS"
        const startTimeString = getCurrentTimeString();

        // Store start time & location info in localStorage
        localStorage.setItem("startTime", startTimeString);
        localStorage.setItem("location", determinedCity);
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);

        // IMPORTANT: Initialize break data in localStorage
        // This will keep track of the sum of all breaks in seconds
        localStorage.setItem("breakDurationInSeconds", "0");
        // And if user is about to pause now, we store breakStartTime then

        // Start Redux timer
        dispatch(startTimer());
        startTimerInterval();
        setIsPaused(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // --------------------------------------------------------------------
  // 4. Pause => mark break start, stop local timer
  // --------------------------------------------------------------------
  const handlePause = () => {
    dispatch(pauseTimer());
    clearTimerInterval();
    setIsPaused(true);

    // Record break start time in localStorage
    const now = new Date();
    localStorage.setItem("breakStartTime", now.toISOString());
  };

  // --------------------------------------------------------------------
  // 5. Resume => compute how long the break was, add to total, resume
  // --------------------------------------------------------------------
  const handleResume = () => {
    // If there's a breakStartTime, let's compute how long user was paused
    const breakStart = localStorage.getItem("breakStartTime");
    if (breakStart) {
      const breakStartDate = new Date(breakStart);
      const now = new Date();
      const breakSeconds = Math.floor((now - breakStartDate) / 1000);

      // Add breakSeconds to total
      const oldBreakTotal = parseInt(localStorage.getItem("breakDurationInSeconds") || "0", 10);
      const newBreakTotal = oldBreakTotal + breakSeconds;
      localStorage.setItem("breakDurationInSeconds", newBreakTotal.toString());

      // Clear the breakStartTime
      localStorage.removeItem("breakStartTime");
    }

    // Resume the main timer
    dispatch(startTimer());
    startTimerInterval();
    setIsPaused(false);
  };

  // --------------------------------------------------------------------
  // 6. Stop => sends start/end time, break duration, etc. to backend
  // --------------------------------------------------------------------
  const handleStop = async () => {
    const endTimeString = getCurrentTimeString();

    // Retrieve start time & location info from localStorage
    const startTimeString = localStorage.getItem("startTime");
    const location = localStorage.getItem("location");
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");

    // Before finalizing, if the user is currently paused,
    // we finalize the break up to this stop time.
    const breakStart = localStorage.getItem("breakStartTime");
    if (breakStart) {
      const breakStartDate = new Date(breakStart);
      const now = new Date();
      const breakSeconds = Math.floor((now - breakStartDate) / 1000);

      // Add breakSeconds to total
      const oldBreakTotal = parseInt(localStorage.getItem("breakDurationInSeconds") || "0", 10);
      const newBreakTotal = oldBreakTotal + breakSeconds;
      localStorage.setItem("breakDurationInSeconds", newBreakTotal.toString());

      // Clear the breakStartTime
      localStorage.removeItem("breakStartTime");
    }

    // Read final breakDurationInSeconds
    const breakSecondsTotal = parseInt(localStorage.getItem("breakDurationInSeconds") || "0", 10);

    if (!startTimeString) {
      console.error("No start time found in localStorage.");
      return;
    }

    // Convert breakSecondsTotal to HH:MM:SS format
    const breakDurationString = secondsToHHMMSS(breakSecondsTotal);

    try {
      // POST to /api/time-tracking/stop
      await axios.post(
        "/api/time-tracking/stop",
        {
          start_time: startTimeString,
          end_time: endTimeString,
          latitude,
          longitude,
          location,
          break_duration: breakDurationString, // <--- new field
        },
        { withCredentials: true }
      );
      console.log("Timer stopped and data saved to DB successfully.");

      // Clear localStorage
      localStorage.removeItem("startTime");
      localStorage.removeItem("location");
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");
      localStorage.removeItem("breakDurationInSeconds");
      localStorage.removeItem("breakStartTime");
    } catch (err) {
      console.error("Error stopping timer in DB:", err);
    }

    // Reset Redux timer
    dispatch(stopTimer());
    clearTimerInterval();
    setIsPaused(false);
  };

  // Utility: convert total break seconds to HH:MM:SS
  const secondsToHHMMSS = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  };

  // Helper for table – format 24-hour time to AM/PM if needed
  const formatTime = (timeStr) => {
    if (!timeStr) return ""; // Handle empty values
    const [hour, minute] = timeStr.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // --------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------
  return (
    <div className="p-6 bg-white min-h-screen flex flex-col items-center">
      <h1 className="text-lg font-bold mb-4 text-center">Time Tracking</h1>

      {cityName && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-700">
            Current City: <span className="font-bold">{cityName}</span>
          </p>
        </div>
      )}

      <div className="bg-white p-6 shadow-xl rounded-xl w-full max-w-8xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Start/Stop Button */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => {
                if (!isRunning && !isPaused) {
                  handleStartWithGeo();
                } else {
                  handleStop();
                }
              }}
              className={`${
                !isRunning && !isPaused ? "bg-orange-500" : "bg-red-500"
              } w-64 py-3 text-white rounded-full text-lg`}
            >
              {!isRunning && !isPaused ? "Start" : "Stop"}
            </Button>

            {/* Pause/Resume Icon */}
            {(isRunning || isPaused) && (
              <>
                {isPaused ? (
                  <FaPlayCircle
                    onClick={handleResume}
                    className="text-5xl cursor-pointer text-blue-500"
                  />
                ) : (
                  <FaPauseCircle
                    onClick={handlePause}
                    className="text-5xl cursor-pointer text-blue-500"
                  />
                )}
              </>
            )}
          </div>

          {/* Timer Display */}
          <div className="text-3xl font-bold border-dashed border-2 px-6 py-3 text-center">
            {String(elapsedTime.hours).padStart(2, "0")} :{" "}
            {String(elapsedTime.minutes).padStart(2, "0")} :{" "}
            {String(elapsedTime.seconds).padStart(2, "0")}
          </div>

          {/* Over Time Example (placeholder) */}
          <div className="text-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg">
              Over Time
            </div>
            <p className="text-red-500 font-bold">01h:30min</p>
          </div>

          {/* Date Example (placeholder) */}
          <div className="text-center bg-orange-500 text-white px-6 py-4 rounded-lg text-lg">
            <h3 className="text-xl font-bold">04</h3>
            <p>September</p>
          </div>
        </div>

        {/* Table of Existing Entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th style={{ fontFamily: "Poppins" }} className="px-6 py-3">
                  #
                </th>
                <th style={{ fontFamily: "Poppins" }} className="px-6 py-3">
                  Date
                </th>
                <th style={{ fontFamily: "Poppins" }} className="px-6 py-3">
                  Start
                </th>
                <th style={{ fontFamily: "Poppins" }} className="px-6 py-3">
                  End
                </th>
                <th style={{ fontFamily: "Poppins" }} className="px-6 py-3">
                  Location
                </th>
                <th style={{ fontFamily: "Poppins" }} className="px-6 py-3">
                  Break
                </th>
              </tr>
            </thead>
            <tbody>
              {timeEntries
                .sort(
                  (a, b) => new Date(b.entry_date) - new Date(a.entry_date)
                ) // Sort data in descending order
                .map((entry, index) => (
                  <tr
                    key={entry.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td
                      style={{ fontFamily: "Poppins" }}
                      className="px-6 py-4"
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{ fontFamily: "Poppins" }}
                      className="px-6 py-4"
                    >
                      {entry.entry_date}
                    </td>
                    <td
                      style={{ fontFamily: "Poppins" }}
                      className="px-6 py-4"
                    >
                      {entry.start_time}
                    </td>
                    <td
                      style={{ fontFamily: "Poppins" }}
                      className="px-6 py-4"
                    >
                      {entry.end_time || "--:--:--"}
                    </td>
                    <td
                      style={{ fontFamily: "Poppins" }}
                      className="px-6 py-4"
                    >
                      {entry.location || "N/A"}
                    </td>
                    <td
                      style={{ fontFamily: "Poppins" }}
                      className="px-6 py-4"
                    >
                      {entry.break_duration || "00:00:00"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TimeTracking;
