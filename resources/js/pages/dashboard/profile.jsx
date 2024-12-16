import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import Profiles from "../../../img/icons.png";
import { UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/solid";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export function Profile() {
  const [timeData, setTimeData] = useState([]);
  const [chartData, setChartData] = useState({
    fullTime: null,
    partTime: null,
    adhoc: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/time-trackings");

        const fullTimeCount = response.data.filter(
          (item) => item.employment_type === "Full-Time"
        ).length;
        const partTimeCount = response.data.filter(
          (item) => item.employment_type === "Part-Time"
        ).length;
        const adhocCount = response.data.filter(
          (item) => item.employment_type === "Adhoc"
        ).length;

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
          partTime: {
            labels: [],
            datasets: [
              {
                data: [partTimeCount, 100 - partTimeCount],
                backgroundColor: ["#A52A2A", "#F3F3F3"],
                borderWidth: 0,
              },
            ],
            count: partTimeCount,
          },
          adhoc: {
            labels: [],
            datasets: [
              {
                data: [adhocCount, 100 - adhocCount],
                backgroundColor: ["#8B4513", "#F3F3F3"],
                borderWidth: 0,
              },
            ],
            count: adhocCount,
          },
        });

        setTimeData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const renderChart = (data, title, icon) => (
    <div
      className="bg-white rounded-xl shadow-xl p-4 flex flex-col justify-center items-center text-center"
    >
      {/* Title Row */}
      <div className="flex items-center space-x-2">
        <div
          className="p-3 rounded-md bg-yellow-100 flex items-center justify-center"
          style={{ color: 'black' }}
        >
          <UserGroupIcon className="w-5 h-5 text-black" />
        </div>
        <h3 className="text-sm" style={{ fontFamily: 'Poppins' }}>
          {title}
        </h3>
      </div>
  
      {/* Chart */}
      <div className="flex justify-center items-center" style={{ flexGrow: 1 }}>
        <Doughnut
          data={data}
          options={{
            cutout: "70%",
            maintainAspectRatio: false,
            responsive: false,
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
  
                // Set font for center text
                const fontSize = (height / 100).toFixed(2);
                ctx.font = `bold ${fontSize}em Poppins`; // Add "bold" before the font size
                ctx.textBaseline = "middle";
  
                const text = chart.config.options.plugins.centerText.text;
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
  
                ctx.fillStyle = "#000"; // Set text color
                ctx.fillText(text, textX, textY);
                ctx.save();
              },
            },
          ]}
        />
      </div>
    </div>
  );
  


  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-6">Employees</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center">
        {chartData.fullTime &&
          renderChart(
            chartData.fullTime,
            "Full Time Employees",
            "https://via.placeholder.com/40"
          )}
        {chartData.partTime &&
          renderChart(
            chartData.partTime,
            "Part Time Employees",
            "https://via.placeholder.com/40"
          )}
        {chartData.adhoc &&
          renderChart(
            chartData.adhoc,
            "Adhoc Employees",
            "https://via.placeholder.com/40"
          )}
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Weekly Timesheet</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-6 border-b text-left" style={{fontFamily: 'Poppins'}}>Employee</th>
                <th className="py-3 px-6 border-b text-left" style={{fontFamily: 'Poppins'}}>Entry Date</th>
                <th className="py-3 px-6 border-b text-left" style={{fontFamily: 'Poppins'}}>Start Time</th>
                <th className="py-3 px-6 border-b text-left" style={{fontFamily: 'Poppins'}}>End Time</th>
                <th className="py-3 px-6 border-b text-left" style={{fontFamily: 'Poppins'}}>Employment Type</th>
              </tr>
            </thead>
            <tbody>
              {timeData.map((data, index) => (
                <tr key={index}>
                  <td className="py-3 px-6 border-b flex items-center gap-4">
                    <img
                      src={Profiles}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border"
                    />
                    <span>{data.employee_name}</span>
                  </td>
                  <td className="py-3 px-6 border-b" style={{fontFamily: 'Poppins'}}>{data.entry_date}</td>
                  <td className="py-3 px-6 border-b" style={{fontFamily: 'Poppins'}}>{data.start_time}</td>
                  <td className="py-3 px-6 border-b" style={{fontFamily: 'Poppins'}}>{data.end_time}</td>
                  {/* <td className="py-3 px-6 border-b" style={{fontFamily: 'Poppins'}}>{data.employment_type}</td> */}


                  <td className="py-3 px-6 border-b">
                      <span className={`px-5 py-3 rounded-lg text-sm font-semibold ${data.employment_type === 'Adhoc' ? 'bg-brown-100 text-brown-600' :
                        data.employment_type === 'Full-Time' ? 'bg-yellow-100 text-orange-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                        {data.employment_type}
                      </span>
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
