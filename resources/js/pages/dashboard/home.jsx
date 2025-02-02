import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@material-tailwind/react";
import { FaClock, FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  startTimer,
  updateTime,
  pauseTimer,
  stopTimer,
} from "../../redux/timeSlice";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export function Home() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [currentDate, setCurrentDate] = useState({ day: "", month: "" });
  const [isPaused, setIsPaused] = useState(false);
  const [cityName, setCityName] = useState("");
  const intervalRef = useRef(null);
  const dispatch = useDispatch();
  const { elapsedTime, isRunning } = useSelector((state) => state.timer);
// const {workHoursData, setWWorkHoursData} = useState("");
  // Distinguish between paused vs. fully stopped
  const [timeEntries, setTimeEntries] = useState([]);

  // Interval for the timer

  // Table data from backend

  // Reverse-geocoded city name

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two-digit format
    const month = today.toLocaleString("default", { month: "long" }); // Get full month name

    setCurrentDate({ day, month });
  }, []);

  // Helper: format time as HH:MM:SS (24-hour)
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
  // 3. Set up Server-Sent Events (SSE) for real-time updates
  // --------------------------------------------------------------------
  useEffect(() => {
    const eventSource = new EventSource("/api/time-tracking/updates", {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      const newEntry = JSON.parse(event.data);
      setTimeEntries((prevEntries) => [newEntry, ...prevEntries]); // Add new entry to the top
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Cleanup on unmount
    };
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
  // 4. Start => calls geolocation, reverse-geocode, stores start time in localStorage
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

        // Store start time in localStorage
        localStorage.setItem("startTime", startTimeString);
        localStorage.setItem("location", determinedCity);
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);

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
  // 5. Pause (just stops local timer, no DB call)
  // --------------------------------------------------------------------
  const handlePause = () => {
    dispatch(pauseTimer());
    clearTimerInterval();
    setIsPaused(true);
  };

  // --------------------------------------------------------------------
  // 6. Resume (just resumes local timer, no DB call)
  // --------------------------------------------------------------------
  const handleResume = () => {
    dispatch(startTimer());
    startTimerInterval();
    setIsPaused(false);
  };

  // --------------------------------------------------------------------
  // 7. Stop => sends start and end time to backend
  // --------------------------------------------------------------------
  const handleStop = async () => {
    const endTimeString = getCurrentTimeString();

    // Retrieve start time and location from localStorage
    const startTimeString = localStorage.getItem("startTime");
    const location = localStorage.getItem("location");
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");

    if (!startTimeString) {
      console.error("No start time found in localStorage.");
      return;
    }

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
        },
        { withCredentials: true }
      );
      console.log("Timer stopped and data saved to DB successfully.");

      // Clear localStorage
      localStorage.removeItem("startTime");
      localStorage.removeItem("location");
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");
    } catch (err) {
      console.error("Error stopping timer in DB:", err);
    }
    const workHoursData = {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Work Hours",
          data: [3, 5, 2, 7, 4, 6, 3],
          backgroundColor: "#FC8C10",
          borderRadius: 6,
        },
      ],
    };
    // Reset Redux timer
    dispatch(stopTimer());
    clearTimerInterval();
    setIsPaused(false);
  };
  const workHoursData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Work Hours",
        data: [3, 5, 2, 7, 4, 6, 3],
        backgroundColor: "#FC8C10",
        borderRadius: 6,
      },
    ],

  }
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-lg font-bold mb-4">Dashboard</h1>
      <div className="p-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col bg-white p-6 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold flex items-center" style={{ fontFamily: 'Poppins' }}>
                <div className="bg-orange-50 p-3 flex justify-center items-center rounded-full">
                  <FaClock className="text-orange-500" />
                </div>
                Work Hours
              </h2>
              <select className="bg-orange-50 rounded-full px-8 py-3">
                <option>Oct</option>
              </select>
            </div>
            <div className="h-60 md:h-80 flex justify-center items-center">
              <Bar
                data={workHoursData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  barPercentage: 0.4,
                  categoryPercentage: 0.6,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col bg-white p-6 shadow-lg rounded-xl">
            <h2 className="font-semibold mb-4">Location</h2>
            <div className="h-60 md:h-80">
              <MapContainer center={[24.8607, 67.0011]} zoom={5} className="h-full w-full rounded-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[32.7767, -96.797]}>
                  <Popup>Employee Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Timer and Buttons Section */}


      {/* Table of Existing Entries */}
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

export default Home;