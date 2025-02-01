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
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cityName, setCityName] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two-digit format
    const month = today.toLocaleString("default", { month: "long" }); // Get full month name

    setCurrentDate({ day, month });
  }, []);

  // Helper: format time as HH:MM:SS (24-hour)
  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour12: false }); // e.g. "08:30:00"
  };

  // Start timer interval
  const startTimerInterval = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          let { hours, minutes, seconds } = prevTime;
          seconds++;
          if (seconds === 60) {
            seconds = 0;
            minutes++;
          }
          if (minutes === 60) {
            minutes = 0;
            hours++;
          }
          return { hours, minutes, seconds };
        });
      }, 1000);
    }
  };

  // Clear timer interval
  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle start with geolocation
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

        // Start local timer
        setIsRunning(true);
        setIsPaused(false);
        startTimerInterval();
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

  // Handle pause
  const handlePause = async () => {
    const pauseTimeString = getCurrentTimeString();

    try {
      // POST to /api/time-tracking/pause
      await axios.post(
        "/api/time-tracking/pause",
        { pause_time: pauseTimeString },
        { withCredentials: true }
      );
      console.log("Timer paused in DB successfully.");
    } catch (err) {
      console.error("Error pausing timer in DB:", err);
    }

    // Pause local timer
    setIsPaused(true);
    clearTimerInterval();
  };

  // Handle resume
  const handleResume = async () => {
    const resumeTimeString = getCurrentTimeString();

    try {
      // POST to /api/time-tracking/resume
      await axios.post(
        "/api/time-tracking/resume",
        { resume_time: resumeTimeString },
        { withCredentials: true }
      );
      console.log("Timer resumed in DB successfully.");
    } catch (err) {
      console.error("Error resuming timer in DB:", err);
    }

    // Resume local timer
    setIsPaused(false);
    startTimerInterval();
  };

  // Handle stop
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

    // Stop local timer
    setIsRunning(false);
    setIsPaused(false);
    clearTimerInterval();
    setTime({ hours: 0, minutes: 0, seconds: 0 });
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
  };

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
      <div className="flex bg-white flex-col md:flex-row justify-between items-center mt-6 gap-4">
        {/* Start/Stop Button */}
        <Button
          onClick={isRunning ? handleStop : handleStartWithGeo}
          className={`${
            isRunning ? "bg-red-500" : "bg-orange-500"
          } px-14 py-4 text-white text-lg`}
          style={{ borderRadius: '28px' }}
        >
          {isRunning ? "Stop" : "Start"}
        </Button>

        {/* Pause/Resume Button */}
        {(isRunning || isPaused) && (
          <Button
            onClick={isPaused ? handleResume : handlePause}
            className="bg-blue-500 px-14 py-4 text-white text-lg"
            style={{ borderRadius: '28px' }}
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        )}

        {/* Timer Display */}
        <div className="text-3xl font-bold border-dashed border-2 px-8 py-4">
          {`${String(time.hours).padStart(2, "0")} : ${String(time.minutes).padStart(2, "0")} : ${String(time.seconds).padStart(2, "0")}`}
        </div>

        {/* Date Display */}
        <div className="text-center bg-orange-500 text-white px-6 py-6 rounded-lg text-lg">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>{currentDate.day}</h3>
          <p className="text-lg" style={{ fontFamily: 'Poppins' }}>{currentDate.month}</p>
        </div>
      </div>

      {/* Table of Existing Entries */}
      <div className="bg-white p-6 shadow-lg overflow-x-auto mt-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2" style={{ fontFamily: 'Poppins' }}>Date</th>
              <th style={{ fontFamily: 'Poppins' }}>Start</th>
              <th style={{ fontFamily: 'Poppins' }}>End</th>
              <th style={{ fontFamily: 'Poppins' }}>Break</th>
              <th className="text-right" style={{ fontFamily: 'Poppins' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, index) => (
              <tr key={index} className="border-b text-black">
                <td className="py-2" style={{ fontFamily: 'Poppins' }}>{`${currentDate.day}/${new Date().getMonth() + 1}/2024`}</td>
                <td style={{ fontFamily: 'Poppins' }}>8:30</td>
                <td style={{ fontFamily: 'Poppins' }}>19:30</td>
                <td style={{ fontFamily: 'Poppins' }}>00:30</td>
                <td className="text-right">
                  <Button style={{ fontFamily: 'Poppins' }} className="bg-orange-900 text-white px-4 py-2 rounded-lg">
                    11 Hours
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;