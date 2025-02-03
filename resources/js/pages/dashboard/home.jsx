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
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom markers
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

// Import Leaflet marker icons using ES modules
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Register ChartJS components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to update map view to marker's position
function MapViewUpdater({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 13); // Set map view to marker's position
    }
  }, [latitude, longitude, map]);

  return null;
}

export function Home() {
  const [currentDate, setCurrentDate] = useState({ day: "", month: "" });
  const [isPaused, setIsPaused] = useState(false);
  const [cityName, setCityName] = useState("");
  const [latestLocation, setLatestLocation] = useState(null); // State for latest location
  const intervalRef = useRef(null);
  const dispatch = useDispatch();
  const { elapsedTime, isRunning } = useSelector((state) => state.timer);

  // Entries from the backend
  const [timeEntries, setTimeEntries] = useState([]);

  // ----------------- PAGINATION STATES -----------------
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5; // Show 5 entries per page

  // ----------------- Fetch location on mount -----------------
  useEffect(() => {
    const fetchLatestLocation = async () => {
      try {
        const response = await axios.get("/api/time-tracking/latest-location", {
          withCredentials: true,
        });
        setLatestLocation(response.data);
      } catch (error) {
        console.error("Error fetching latest location:", error);
      }
    };

    fetchLatestLocation();
  }, []);

  // ----------------- Set current date -----------------
  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two-digit format
    const month = today.toLocaleString("default", { month: "long" }); // Get full month name
    setCurrentDate({ day, month });
  }, []);

  // ----------------- Fetch time entries from the backend -----------------
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

  // ----------------- Timer logic -----------------
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
  const calculateOvertime = () => {
    const standardWorkingHours = 8 * 3600; // 8 hours in seconds
    const totalWorkingSeconds =
      elapsedTime.hours * 3600 +
      elapsedTime.minutes * 60 +
      elapsedTime.seconds;

    const overtimeSeconds = totalWorkingSeconds - standardWorkingHours;

    if (overtimeSeconds > 0) {
      const overtimeHours = Math.floor(overtimeSeconds / 3600);
      const overtimeMinutes = Math.floor((overtimeSeconds % 3600) / 60);
      return `${overtimeHours}h:${overtimeMinutes}m`;
    } else {
      return "00h:00m";
    }
  };
  // Helper: format time as HH:MM:SS (24-hour)
  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour12: false }); // e.g. "08:30:00"
  };

  // ----------------- Start timer with geolocation -----------------
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

        // Initialize break data in localStorage
        localStorage.setItem("breakDurationInSeconds", "0");

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

  // ----------------- Pause timer -----------------
  const handlePause = () => {
    dispatch(pauseTimer());
    clearTimerInterval();
    setIsPaused(true);

    // Record break start time in localStorage
    const now = new Date();
    localStorage.setItem("breakStartTime", now.toISOString());
  };

  // ----------------- Resume timer -----------------
  const handleResume = () => {
    const breakStart = localStorage.getItem("breakStartTime");
    if (breakStart) {
      const breakStartDate = new Date(breakStart);
      const now = new Date();
      const breakSeconds = Math.floor((now - breakStartDate) / 1000);

      const oldBreakTotal = parseInt(
        localStorage.getItem("breakDurationInSeconds") || "0",
        10
      );
      const newBreakTotal = oldBreakTotal + breakSeconds;
      localStorage.setItem(
        "breakDurationInSeconds",
        newBreakTotal.toString()
      );

      localStorage.removeItem("breakStartTime");
    }

    dispatch(startTimer());
    startTimerInterval();
    setIsPaused(false);
  };

  // ----------------- Stop timer and send data to backend -----------------
  const handleStop = async () => {
    const endTimeString = getCurrentTimeString();

    // Retrieve start time and location from localStorage
    const startTimeString = localStorage.getItem("startTime");
    const location = localStorage.getItem("location");
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");

    // Finalize break duration if paused
    const breakStart = localStorage.getItem("breakStartTime");
    if (breakStart) {
      const breakStartDate = new Date(breakStart);
      const now = new Date();
      const breakSeconds = Math.floor((now - breakStartDate) / 1000);

      const oldBreakTotal = parseInt(
        localStorage.getItem("breakDurationInSeconds") || "0",
        10
      );
      const newBreakTotal = oldBreakTotal + breakSeconds;
      localStorage.setItem(
        "breakDurationInSeconds",
        newBreakTotal.toString()
      );

      localStorage.removeItem("breakStartTime");
    }

    // Read final breakDurationInSeconds
    const breakSecondsTotal = parseInt(
      localStorage.getItem("breakDurationInSeconds") || "0",
      10
    );

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
          break_duration: breakDurationString,
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

  // ----------------- Utility: convert total break seconds to HH:MM:SS -----------------
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

  // ----------------- WORK HOURS CHART (Dummy) -----------------
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

  // ----------------- PAGINATION CALCULATIONS -----------------
  const totalPages = Math.ceil(timeEntries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;

  // Sort entries descending by date, then slice for the current page
  const currentEntries = timeEntries
    .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date))
    .slice(startIndex, startIndex + entriesPerPage);

  // Handle page changes
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ----------------- RENDER -----------------
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-lg font-bold mb-4">Dashboard</h1>
      <div className="p-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work Hours Chart */}
          <div className="flex flex-col bg-white p-6 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2
                className="font-semibold flex items-center"
                style={{ fontFamily: "Poppins" }}
              >
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

          {/* Location Map */}
          <div className="flex flex-col bg-white p-6 shadow-lg rounded-xl">
            <h2 className="font-semibold mb-4">Location</h2>
            <div className="h-60 md:h-80">
              <MapContainer
                center={
                  latestLocation
                    ? [latestLocation.latitude, latestLocation.longitude]
                    : [24.8607, 67.0011] // Default center if no location
                }
                zoom={13}
                className="h-full w-full rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {latestLocation && (
                  <>
                    <Marker
                      position={[
                        latestLocation.latitude,
                        latestLocation.longitude,
                      ]}
                    >
                      <Popup>{latestLocation.location}</Popup>
                    </Marker>
                    <MapViewUpdater
                      latitude={latestLocation.latitude}
                      longitude={latestLocation.longitude}
                    />
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Timer and Buttons Section */}
      <div className="bg-white p-6 shadow-xl rounded-xl w-full max-w-8xl mt-6">
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
            <p className="text-red-500 font-bold">{calculateOvertime()}</p>
          </div>

          {/* Date Example */}
          <div className="text-center bg-orange-500 text-white px-6 py-4 rounded-lg text-lg">
            <h3 className="text-xl font-bold">{currentDate.day}</h3>
            <p>{currentDate.month}</p>
          </div>
        </div>

        {/* Table of Existing Entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th
                  style={{ fontFamily: "Poppins" }}
                  className="px-6 py-3"
                >
                  #
                </th>
                <th
                  style={{ fontFamily: "Poppins" }}
                  className="px-6 py-3"
                >
                  Date
                </th>
                <th
                  style={{ fontFamily: "Poppins" }}
                  className="px-6 py-3"
                >
                  Start
                </th>
                <th
                  style={{ fontFamily: "Poppins" }}
                  className="px-6 py-3"
                >
                  End
                </th>
                <th
                  style={{ fontFamily: "Poppins" }}
                  className="px-6 py-3"
                >
                  Location
                </th>
                <th
                  style={{ fontFamily: "Poppins" }}
                  className="px-6 py-3"
                >
                  Break
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((entry, index) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td
                    style={{ fontFamily: "Poppins" }}
                    className="px-6 py-4"
                  >
                    {/* Calculate actual row number across pages */}
                    {(currentPage - 1) * entriesPerPage + (index + 1)}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-4">
            <ul className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li key={page}>
                    <button
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-1 rounded ${
                        page === currentPage
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;