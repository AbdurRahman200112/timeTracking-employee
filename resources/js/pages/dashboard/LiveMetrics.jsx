import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdLocalPhone, MdEmail } from "react-icons/md";
import Loader from "./Loader";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import Profiles from "../../../img/icons.png"; // Replace with your actual path

// Register ChartJS components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export function LiveMetrics() {
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true); // State for loader

  const navigate = useNavigate();

  // Static Data for Chart
  const staticChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Work Hours",
        data: [3, 5, 4, 7, 2, 6, 8], // Adjusted for display
        borderColor: "#FFA500",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        pointBackgroundColor: "#FF9F43",
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const handleNavigation = () => {
    navigate("/dashboard/profile");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/time-trackings");
        setTimeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />; // Display loader while loading is true
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Graph Section */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Real-Time Metrics</h3>
        <div className="w-full" style={{ height: "400px" }}>
          <Line
            data={staticChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Allows chart to fill container height
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { family: "Poppins" } },
                },
                y: {
                  grid: { drawBorder: false },
                  ticks: { font: { family: "Poppins" } },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Recent</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="py-2 px-3 sm:py-4 sm:px-4 text-gray-600 font-semibold">
                  Employees
                </th>
                <th className="py-2 px-3 sm:py-4 sm:px-4 text-gray-600 font-semibold">
                  Job Title
                </th>
                <th className="py-2 px-3 sm:py-4 sm:px-4 text-gray-600 font-semibold">
                  Joining Date
                </th>
                <th className="py-2 px-3 sm:py-4 sm:px-4 text-gray-600 font-semibold">
                  Contact
                </th>
                <th className="py-2 px-3 sm:py-4 sm:px-4 text-gray-600 font-semibold">
                  Work Hours
                </th>
                <th className="py-2 px-3 sm:py-4 sm:px-4 text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {timeData.map((data, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="flex items-center py-2 px-3 sm:py-4 sm:px-4">
                    <img
                      src={Profiles}
                      alt="Avatar"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border mr-2 sm:mr-3"
                    />
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      {data.employee_name}
                    </span>
                  </td>
                  <td className="py-2 px-3 sm:py-4 sm:px-4 text-gray-700 text-sm sm:text-base">
                    {data.designation}
                  </td>
                  <td className="py-2 px-3 sm:py-4 sm:px-4 text-gray-700 text-sm sm:text-base">
                    {data.entry_date}
                  </td>
                  <td className="py-2 px-3 sm:py-4 sm:px-4 text-gray-700 flex gap-2 text-lg">
                    <span className="cursor-pointer text-orange-600">
                      <MdLocalPhone />
                    </span>
                    <span className="cursor-pointer text-orange-600">
                      <MdEmail />
                    </span>
                  </td>
                  <td className="py-2 px-3 sm:py-4 sm:px-4">
                    <span className="inline-block bg-orange-100 text-orange-700 px-2 py-1 text-xs sm:text-sm rounded-full">
                      {data.working_hours} Hours
                    </span>
                  </td>
                  <td className="py-2 px-3 sm:py-4 sm:px-4">
                    <button
                      onClick={handleNavigation}
                      className="bg-orange-100 text-orange-600 px-4 py-2 text-xs sm:text-sm rounded-full hover:bg-yellow-300 transition"
                    >
                      View
                    </button>
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
