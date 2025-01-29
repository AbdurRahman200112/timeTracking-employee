import React, { useState } from "react";
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
import { FaClock } from "react-icons/fa";

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
      <div className="p-4  flex flex-col">
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
                  barPercentage: 0.4,  // Adjusts the width of each bar
                  categoryPercentage: 0.6 // Adjusts spacing between bars
                }}
              />
            </div>
          </div>
          <div className="flex flex-col bg-white p-6 shadow-lg rounded-xl">
            <h2 className="font-semibold mb-4">Location</h2>
            <div className="h-60 md:h-80">
              <MapContainer center={[32.7767, -96.797]} zoom={5} className="h-full w-full rounded-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[32.7767, -96.797]}>
                  <Popup>Employee Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-white  flex-col md:flex-row justify-between items-center mt-6">
        <Button className="bg-orange-500 ml-5 px-14 py-4 text-white text-lg" style={{ borderRadius: '28px' }}>Start</Button>
        <div className="text-3xl font-bold border-dashed border-2 px-8 py-4 md:mt-0">{`${time.hours} : ${time.minutes} : ${time.seconds}`}</div>
        <div className="text-center bg-orange-500 text-white px-6 py-6 rounded-lg text-lg mt-4 md:mt-0">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>04</h3>
          <p className="text-lg" style={{ fontFamily: 'Poppins' }}>September</p>
        </div>
      </div>
      <div className="bg-white p-6 shadow-lg  overflow-x-auto">
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
                <td className="py-2" style={{ fontFamily: 'Poppins' }}>04/09/2024</td>
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
