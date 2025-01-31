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
  // Redux states
  const { elapsedTime, isRunning } = useSelector((state) => state.timer);

  // Keep track of whether the timer is paused (distinct from fully stopped)
  const [isPaused, setIsPaused] = useState(false);

  // Interval ref for the setInterval
  const intervalRef = useRef(null);

  // Example: entries from your backend
  const [timeEntries, setTimeEntries] = useState([]);

  // Store city name after reverse-geocoding
  const [cityName, setCityName] = useState("");

  // -----------------------------------------------------------
  // 1. If the timer is running on mount, re-start the interval
  // -----------------------------------------------------------
  useEffect(() => {
    if (isRunning) {
      startTimerInterval();
    }
  }, [isRunning]);

  // -----------------------------------------------------------
  // 2. Fetch time-tracking data
  // -----------------------------------------------------------
  useEffect(() => {
    const fetchTimeTrackingData = async () => {
      try {
        const response = await axios.get("/api/time-tracking", {
          withCredentials: true,
        });
        setTimeEntries(response.data);
      } catch (error) {
        console.error("Error fetching time tracking data:", error);
      }
    };
    fetchTimeTrackingData();
  }, []);

  // -----------------------------------------------------------
  // Timer interval logic
  // -----------------------------------------------------------
  const startTimerInterval = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        dispatch(updateTime()); // increments time if isRunning = true
      }, 1000);
    }
  };

  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // -----------------------------------------------------------
  // 3. Start from zero with geolocation
  //    (only if fully stopped, not paused)
  // -----------------------------------------------------------
  const handleStartWithGeo = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Coordinates:", latitude, longitude);

        // Reverse-Geocode for city name
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`;
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            let foundCity = null;
            const addressComponents = data.results[0].address_components || [];

            for (const component of addressComponents) {
              if (component.types.includes("locality")) {
                foundCity = component.long_name;
                break;
              }
            }
            if (foundCity) {
              setCityName(foundCity);
            } else if (data.results[0].formatted_address) {
              setCityName(data.results[0].formatted_address);
            } else {
              setCityName("Unknown location");
            }
          } else {
            setCityName("Unknown location");
          }
        } catch (error) {
          console.error("Error reverse-geocoding location:", error);
          setCityName("Unknown location");
        }

        // Actually start the timer
        dispatch(startTimer()); // sets isRunning = true in Redux
        startTimerInterval();
        setIsPaused(false); // not paused
      },
      (error) => {
        console.error("Geolocation error:", error);
        // If user denies location, do not start
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // -----------------------------------------------------------
  // 4. Pause without resetting
  // -----------------------------------------------------------
  const handlePause = () => {
    dispatch(pauseTimer()); // sets isRunning = false, keeps time
    clearTimerInterval();
    setIsPaused(true);
  };

  // -----------------------------------------------------------
  // 5. Resume (no geolocation, no reset)
  // -----------------------------------------------------------
  const handleResume = () => {
    dispatch(startTimer()); // sets isRunning = true
    startTimerInterval();
    setIsPaused(false);
  };

  // -----------------------------------------------------------
  // 6. Stop (resets to 0)
  // -----------------------------------------------------------
  const handleStop = () => {
    dispatch(stopTimer()); // sets time = 0, isRunning = false
    clearTimerInterval();
    setIsPaused(false); // no longer paused
  };

  // -----------------------------------------------------------
  // Render
  // -----------------------------------------------------------
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
          {/* MAIN BUTTON: Start or Stop */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => {
                if (!isRunning && !isPaused) {
                  // If fully stopped => Start with geo
                  handleStartWithGeo();
                } else {
                  // If running or paused => Stop (reset to 0)
                  handleStop();
                }
              }}
              className={`${
                !isRunning && !isPaused ? "bg-orange-500" : "bg-red-500"
              } w-64 py-3 text-white rounded-full text-lg`}
            >
              {!isRunning && !isPaused ? "Start" : "Stop"}
            </Button>

            {/* ICON: Pause or Resume (only visible if we've started or paused) */}
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

          {/* TIMER DISPLAY */}
          <div className="text-3xl font-bold border-dashed border-2 px-6 py-3 text-center">
            {String(elapsedTime.hours).padStart(2, "0")} :{" "}
            {String(elapsedTime.minutes).padStart(2, "0")} :{" "}
            {String(elapsedTime.seconds).padStart(2, "0")}
          </div>

          {/* Over Time (example) */}
          <div className="text-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg">
              Over Time
            </div>
            <p className="text-red-500 font-bold">01h:30min</p>
          </div>

          {/* Date Section (example) */}
          <div className="text-center bg-orange-500 text-white px-6 py-4 rounded-lg text-lg">
            <h3 className="text-xl font-bold">04</h3>
            <p>September</p>
          </div>
        </div>

        {/* Example table of time entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-2 px-4">Date</th>
                <th className="px-4">Location</th>
                <th className="px-4">Start Time</th>
                <th className="px-4">End Time</th>
                <th className="px-4">Break</th>
                <th className="px-4 text-right">Over Time</th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{entry.entry_date}</td>
                  <td className="px-4">{entry.employee_name}</td>
                  <td className="px-4">{entry.start_time}</td>
                  <td className="px-4">{entry.end_time}</td>
                  <td className="px-4">{entry.break_duration}</td>
                  <td className="px-4 text-right">
                    <Button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                      {entry.working_hours}
                    </Button>
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
