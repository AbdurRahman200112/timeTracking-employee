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

  // Interval for the timer
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
  // 2. Fetch existing time entries from DB
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
  // 3. Start => calls geolocation, reverse-geocode, posts to /start
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

        // Post to /api/time-tracking/start
        try {
          await axios.post(
            "/api/time-tracking/start",
            {
              start_time: startTimeString,
              latitude,
              longitude,
              location: determinedCity,
            },
            { withCredentials: true }
          );
          console.log("Timer started in DB successfully.");
        } catch (err) {
          console.error("Error starting timer in DB:", err);
        }

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
  // 4. Pause (just stops local timer, no DB call)
  // --------------------------------------------------------------------
  const handlePause = () => {
    dispatch(pauseTimer());
    clearTimerInterval();
    setIsPaused(true);
  };

  // --------------------------------------------------------------------
  // 5. Resume (just resumes local timer, no DB call)
  // --------------------------------------------------------------------
  const handleResume = () => {
    dispatch(startTimer());
    startTimerInterval();
    setIsPaused(false);
  };

  // --------------------------------------------------------------------
  // 6. Stop => sets end_time in DB
  // --------------------------------------------------------------------
  const handleStop = async () => {
    const endTimeString = getCurrentTimeString();

    try {
      // POST to /api/time-tracking/stop
      await axios.post(
        "/api/time-tracking/stop",
        { end_time: endTimeString },
        { withCredentials: true }
      );
      console.log("Timer stopped in DB successfully.");
    } catch (err) {
      console.error("Error stopping timer in DB:", err);
    }

    // Reset Redux timer
    dispatch(stopTimer());
    clearTimerInterval();
    setIsPaused(false);
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

          {/* Over Time Example */}
          <div className="text-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg">
              Over Time
            </div>
            <p className="text-red-500 font-bold">01h:30min</p>
          </div>

          {/* Date Example */}
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
                <th className="px-4">Date</th>
                <th className="px-4">Employee</th>
                <th className="px-4">Start</th>
                <th className="px-4">End</th>
                <th className="px-4">Location</th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="px-4">{entry.entry_date}</td>
                  <td className="px-4">{entry.employee_id}</td>
                  <td className="px-4">{entry.start_time}</td>
                  <td className="px-4">{entry.end_time || "--:--:--"}</td>
                  <td className="px-4">{entry.location || "N/A"}</td>
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
