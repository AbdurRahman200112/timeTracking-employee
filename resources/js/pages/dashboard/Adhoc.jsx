// React Component (Adhoc.js)
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Profiles from "../../../img/icons.png";
import { UserGroupIcon, TrashIcon } from "@heroicons/react/24/solid";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export function Adhoc() {
  const [timeData, setTimeData] = useState([]);
  const [chartData, setChartData] = useState({
    adhoc: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching Adhoc employees chart data
        const response = await axios.get("/api/adhoc");
        const adhocCount = response.data.length;

        setChartData({
          adhoc: {
            labels: [],
            datasets: [
              {
                data: [adhocCount, 100 - adhocCount],
                backgroundColor: ["#FFA500", "#F3F3F3"],
                borderWidth: 0,
              },
            ],
            count: adhocCount,
          },
        });

        setTimeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`/api/employee/${employeeId}`);
      setTimeData((prevData) => prevData.filter((emp) => emp.employee_id !== employeeId));
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const staticChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Work Hours",
        data: [8, 7, 6, 9, 5, 10, 6],
        borderColor: "#FFA500",
        backgroundColor: "rgba(255, 165, 0, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const renderChart = (data, title) => (
    <div className="bg-white rounded-xl shadow-xl p-4 flex flex-col justify-center items-center text-center w-full">
      <div className="flex items-center space-x-2">
        <div className="p-3 rounded-md bg-yellow-100 flex items-center justify-center">
          <UserGroupIcon className="w-5 h-5 text-black" />
        </div>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>

      <div className="flex justify-center items-center" style={{ flexGrow: 1 }}>
        <Doughnut
          data={data}
          options={{
            cutout: "70%",
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              tooltip: { enabled: false },
              centerText: {
                text: data.count,
              },
            },
          }}
          width={170}
          height={170}
          plugins={[
            {
              id: "centerText",
              beforeDraw(chart) {
                const { width, height } = chart;
                const ctx = chart.ctx;
                ctx.restore();

                const fontSize = (height / 100).toFixed(2);
                ctx.font = `bold ${fontSize}em Poppins`;
                ctx.textBaseline = "middle";

                const text = chart.config.options.plugins.centerText.text;
                const textX = Math.round(
                  (width - ctx.measureText(text).width) / 2
                );
                const textY = height / 2;

                ctx.fillStyle = "#000";
                ctx.fillText(text, textX, textY);
                ctx.save();
              },
            },
          ]}
        />
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-6">Adhoc Employees</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adhoc Employees Doughnut Chart */}
        {chartData.adhoc &&
          renderChart(chartData.adhoc, "Adhoc Employees")}

        {/* Weekly Overview Line Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center w-full">
          <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
          <Line
            data={staticChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { drawBorder: false } },
              },
            }}
            height={80}
          />
        </div>
      </div>

      {/* Weekly Timesheet Section */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Weekly Timesheet</h2>
        <div className="overflow-hidden">
          {timeData.map((data) => (
            <div
              key={data.employee_id}
              className="bg-gray-50 border-b last:border-b-0 p-4 rounded-lg flex flex-col gap-4 mb-4 md:grid md:grid-cols-5 md:gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={Profiles}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border"
                />
                <span className="font-medium">{data.employee_name}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entry Date:</p>
                <p className="font-medium">{data.entry_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Time:</p>
                <p className="font-medium">{data.start_time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Time:</p>
                <p className="font-medium">{data.end_time}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">{data.employment_type}</p>
                <TrashIcon
                  className="w-6 h-6 text-red-500 cursor-pointer"
                  onClick={() => deleteEmployee(data.employee_id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
