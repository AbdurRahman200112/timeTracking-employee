// React Component (Adhoc.js)
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Profiles from "../../../img/icons.png";
import { UserGroupIcon, TrashIcon } from "@heroicons/react/24/solid";
import Loader from "./Loader";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [toggleExport, setToggleExport] = useState(false);

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

    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.text("Weekly Timesheet", 14, 10);
      doc.autoTable({
        startY: 20,
        head: [
          [
            "Employee Name",
            "Email",
            "Employment Type",
            "Entry Date",
            "Start Time",
            "End Time",
            "Working Hours",
            "OT1 Rate",
          ],
        ],
        body: timeData.map((data) => [
          data.employee_name,
          data.email,
          data.employment_type,
          data.entry_date,
          data.start_time,
          data.end_time,
          data.working_hours,
          data.ot1_3_rate,
        ]),
      });
      doc.save("employees.pdf");
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
  const exportToCSV = () => {
    const headers = ["Employee Name", "Email", "Employment Type", "Entry Date", "Start Time", "End Time", "Working Hours", "Overtime"];
    const rows = timeData.map((data) => [
      data.employee_name,
      data.email,
      data.employment_type,
      data.entry_date,
      data.start_time,
      data.end_time,
      data.working_hours,
      data.overtime,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employees.csv";
    link.click();
    URL.revokeObjectURL(url); // Clean up URL object
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
    return <Loader />; // Display loader while loading is true
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
      <div className="bg-white rounded-lg shadow-xl p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Weekly Timesheet</h2>
          <div className="relative">
            <button
              onClick={() => setToggleExport(!toggleExport)}
              className="text-orange-400 py-2 px-4 rounded"
            >
              Export Timesheet
            </button>
            {toggleExport && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={exportToCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full ">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Employee Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Entry Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Start Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">End Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Break</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">OT1</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">OT2</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeData.map((data) => {
                // Function to calculate total hours
                const calculateTotalHours = (startTime, endTime, breakDuration) => {
                  // Split start and end times into hours and minutes
                  const [startHour, startMinute] = startTime.split(":").map(Number);
                  const [endHour, endMinute] = endTime.split(":").map(Number);

                  // Convert times to total minutes
                  const startTotalMinutes = startHour * 60 + startMinute;
                  const endTotalMinutes = endHour * 60 + endMinute;

                  // Calculate the difference in minutes
                  let totalMinutesWorked = endTotalMinutes - startTotalMinutes;

                  // Adjust for overnight shifts
                  if (totalMinutesWorked < 0) {
                    totalMinutesWorked += 24 * 60; // Add 24 hours in minutes
                  }

                  // Subtract break duration
                  totalMinutesWorked -= breakDuration;

                  // Convert back to hours and return
                  const totalHours = totalMinutesWorked / 60;
                  return totalHours > 0 ? totalHours.toFixed(2) : "0.00"; // Ensure no negative values
                };

                // Example usage
                const totalHours = calculateTotalHours(data.start_time, data.end_time, data.break_duration);


                return (
                  <tr key={data.employee_id} className="border-b">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{data.employee_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{data.entry_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{data.start_time}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{data.end_time}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{data.break_duration} mins</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{totalHours} hours</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{data.ot1_3_rate}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{data.ot1_3_rate}</td>
                    <td className="px-6 py-4 text-center">
                      <TrashIcon
                        className="w-6 h-6 text-red-500 cursor-pointer inline-block"
                        onClick={() => deleteEmployee(data.employee_id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
