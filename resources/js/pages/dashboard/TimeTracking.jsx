import React, { useState, useEffect, useRef } from "react";
import { Button } from "@material-tailwind/react";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import axios from "axios";

export function TimeTracking() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [timeEntries, setTimeEntries] = useState([]);
  const intervalRef = useRef(null);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const storedTime = JSON.parse(localStorage.getItem("timer")) || {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    const storedIsRunning = JSON.parse(localStorage.getItem("isRunning")) || false;

    setTime(storedTime);
    setIsRunning(storedIsRunning);

    if (storedIsRunning) {
      startTimer();
    }
  }, []);

  useEffect(() => {
    const fetchTimeTrackingData = async () => {
      try {
        const response = await axios.get("/api/time-tracking", { withCredentials: true });
        setTimeEntries(response.data);
      } catch (error) {
        console.error("Error fetching time tracking data:", error);
      }
    };

    fetchTimeTrackingData();
  }, []);

  const startTimer = () => {
    if (!isRunning && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          let { hours, minutes, seconds } = prev;
          seconds++;
          if (seconds === 60) {
            seconds = 0;
            minutes++;
          }
          if (minutes === 60) {
            minutes = 0;
            hours++;
          }
          const newTime = { hours, minutes, seconds };
          localStorage.setItem("timer", JSON.stringify(newTime));
          return newTime;
        });
      }, 1000);
      setIsRunning(true);
      localStorage.setItem("isRunning", JSON.stringify(true));
    }
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    localStorage.setItem("isRunning", JSON.stringify(false));
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setIsRunning(false);
    localStorage.removeItem("timer");
    localStorage.setItem("isRunning", JSON.stringify(false));
  };

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col items-center">
      <h1 className="text-lg font-bold mb-4 text-center">Time Tracking</h1>
      <div className="bg-white p-6 shadow-xl rounded-xl w-full max-w-8xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={isRunning ? stopTimer : startTimer}
              className={`${isRunning ? "bg-red-500" : "bg-orange-500"} w-64 py-3 text-white rounded-full text-lg`}
            >
              {isRunning ? "Stop" : "Start"}
            </Button>
            <FaPlayCircle
              className={`text-5xl cursor-pointer ${isRunning ? "text-blue-500" : "text-orange-500"}`}
              onClick={isRunning ? pauseTimer : startTimer}
            />
          </div>

          <div className="text-3xl font-bold border-dashed border-2 px-6 py-3 text-center">
            {String(time.hours).padStart(2, "0")} : {String(time.minutes).padStart(2, "0")} : {String(time.seconds).padStart(2, "0")}
          </div>

          <div className="text-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg">Over Time</div>
            <p className="text-red-500 font-bold">01h:30min</p>
          </div>

          <div className="text-center bg-orange-500 text-white px-6 py-4 rounded-lg text-lg">
            <h3 className="text-xl font-bold">04</h3>
            <p>September</p>
          </div>
        </div>

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
