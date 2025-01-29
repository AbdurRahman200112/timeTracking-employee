import React, { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { UserGroupIcon, TrashIcon } from "@heroicons/react/24/solid";
import Loader from "./Loader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFileCsv, FaFilePdf } from "react-icons/fa";
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export function PartTimeEmployees() {
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleExport, setToggleExport] = useState(false);
  const dropdownRef = useRef(null);

  const [chartData, setChartData] = useState({
    fullTime: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/part-time");
        const fullTimeCount = response.data.length;

        setChartData({
          fullTime: {
            labels: [],
            datasets: [
              {
                data: [fullTimeCount, 100 - fullTimeCount],
                backgroundColor: ["#FFA500", "#F3F3F3"],
                borderWidth: 0,
              },
            ],
            count: fullTimeCount,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggleExport(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const exportToCSV = () => {
    const headers = ["Employee Name",
      "Email",
      "Employment Type",
      "Entry Date",
      "Start Time",
      "End Time",
      "Working Hours",
      "Daily Start Time",
      "Daily Rate",
      "Weekly Overtime Start",
      "Weekly Rate",
      "monthly_overtime_start",
      "Monthly Rate",];
    const rows = timeData.map((data) => [
      data.employee_name,
      data.email,
      data.employment_type,
      data.entry_date,
      data.start_time,
      data.end_time,
      data.working_hours,
      data.daily_start_time,
      data.daily_rate,
      data.weekly_overtime_start,
      data.weekly_rate,
      data.monthly_overtime_start,
      data.monthly_rate
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
    URL.revokeObjectURL(url);
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
          "Daily Start Time",
          "Daily Rate",
          "Weekly Overtime Start",
          "Weekly Rate",
          "monthly_overtime_start",
          "Monthly Rate",
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
        data.daily_start_time,
        data.daily_rate,
        data.weekly_overtime_start,
        data.weekly_rate,
        data.monthly_overtime_start,
        data.monthly_rate
      ]),
    });
    doc.save("employees.pdf");
  };

  const renderChart = (data, title) => (
    <div className="bg-white rounded-xl shadow-xl p-4 flex flex-col justify-center items-center text-center w-full">
      <div className="flex items-center space-x-2">
        <div className="p-3 rounded-md bg-yellow-100 flex items-center justify-center">
          <UserGroupIcon className="w-5 h-5 text-black" />
        </div>
        <h3 style={{ fontFamily: 'Poppins' }} className="text-sm font-medium">{title}</h3>
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
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
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
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8" style={{ width: "100%", padding: 0, margin: 0 }}>
      <div className="p-8 min-h-screen">
        <h2 style={{ fontFamily: 'Poppins' }} className="text-xl font-semibold mb-6">Full-Time Employees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chartData.fullTime && renderChart(chartData.fullTime, "Full Time Employees")}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center w-full">
            <h3 style={{ fontFamily: 'Poppins' }} className="text-lg font-semibold mb-4">Weekly Overview</h3>
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

        <div className="bg-white rounded-lg shadow-xl p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Weekly Timesheet</h2>
            <div ref={dropdownRef} className="relative">
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
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <FaFileCsv className="mr-2 text-green-600" />
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToPDF}
                    style={{ fontFamily: 'Poppins' }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <FaFilePdf className="mr-2 text-red-600" />
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                <th style={{ fontFamily: 'Poppins' }} className="px-6 py-3 text-left text-sm font-medium text-gray-500">Employee Name</th>
                  {/* <th style={{ fontFamily: 'Poppins' }} className="px-6 py-3 text-left text-sm font-medium text-gray-500">Entry Date</th> */}
                  <th style={{ fontFamily: 'Poppins' }} className="px-6 py-3 text-left text-sm font-medium text-gray-500">Start Time</th>
                  <th style={{ fontFamily: 'Poppins' }} className="px-6 py-3 text-left text-sm font-medium text-gray-500">End Time</th>
                  <th style={{ fontFamily: 'Poppins' }} className="px-6 py-3 text-left text-sm font-medium text-gray-500">Break</th>
                  <th style={{ fontFamily: 'Poppins' }} className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th style={{ fontFamily: 'Poppins' }} className="px-6 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeData.map((data) => {
                  const calculateTotalHours = (startTime, endTime, breakDuration) => {
                    const [startHour, startMinute] = startTime.split(":").map(Number);
                    const [endHour, endMinute] = endTime.split(":").map(Number);
                    const startTotalMinutes = startHour * 60 + startMinute;
                    const endTotalMinutes = endHour * 60 + endMinute;
                    let totalMinutesWorked = endTotalMinutes - startTotalMinutes;

                    if (totalMinutesWorked < 0) {
                      totalMinutesWorked += 24 * 60;
                    }

                    totalMinutesWorked -= breakDuration;

                    const totalHours = totalMinutesWorked / 60;
                    return totalHours > 0 ? totalHours.toFixed(2) : "0.00";
                  };

                  const totalHours = calculateTotalHours(data.start_time, data.end_time, data.break_duration);

                  return (
                    <tr key={data.employee_id} className="border-b">
                      <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4 text-sm font-medium text-gray-900">{data.employee_name}</td>
                      {/* <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4 text-sm text-gray-500">{data.entry_date}</td> */}
                      <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4 text-sm text-gray-500">{data.start_time}</td>
                      <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4 text-sm text-gray-500">{data.end_time}</td>
                      <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4 text-sm text-gray-500">{data.break_duration} mins</td>
                      <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4 text-sm text-gray-500">{data.working_hours} hrs</td>
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
    </div>
  );
}
