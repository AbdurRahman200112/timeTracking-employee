import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import MapPin from '../../../img/map-pin.png';
import Loader from "./Loader";
// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

export function Home() {
  const [employeeData, setEmployeeData] = useState([]);
  const [fullTimeCount, setFullTimeCount] = useState(0);
  const [partTimeCount, setPartTimeCount] = useState(0);
  const [adHocCount, setAdHocCount] = useState(0);
  const [employeeLocations, setEmployeeLocations] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true); // State for loader


  const customIcon = new L.Icon({
    iconUrl: MapPin,
    iconSize: [40, 70],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const containerStyle = {
    width: "100%",
    height: "100%", // Ensures the map takes the full height of the parent container
    margin: 0,
  };

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const response = await axios.get("/api/employee-counts");
        const data = response.data;

        setFullTimeCount(
          data.find((item) => item.employment_type === "Full-Time")?.count || 0
        );
        setPartTimeCount(
          data.find((item) => item.employment_type === "Part-Time")?.count || 0
        );
        setAdHocCount(
          data.find((item) => item.employment_type === "Adhoc")?.count || 0
        );
        setLoading(false)
      } catch (error) {
        console.error("Error fetching employee data", error);
      }
    };
    fetchEmployeeCount();
  }, []);

  useEffect(() => {
    const fetchEmployeeLocations = async () => {
      try {
        const response = await axios.get("/api/employees/locations");
        setEmployeeLocations(response.data);
      } catch (error) {
        console.error("Error fetching employee locations:", error);
      }
    };

    fetchEmployeeLocations();
  }, []);

  // Doughnut Chart Data for Employee Distribution
  const pieData = {
    labels: ["Full Time", "Part Time", "AdHoc"],
    datasets: [
      {
        data: [fullTimeCount, partTimeCount, adHocCount],
        backgroundColor: ["#FFBB00", "#FF7A00", "#6B3E26"],
        borderWidth: 0,
      },
    ],
  };

  // Line Chart Data for Real Time Metrics
  const lineData = {
    labels: ["July", "August", "Sept", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Employees Over Time",
        data: [
          fullTimeCount,
          fullTimeCount + partTimeCount,
          fullTimeCount + partTimeCount + adHocCount,
          fullTimeCount,
          partTimeCount,
          adHocCount,,
          fullTimeCount + partTimeCount + adHocCount,
        ], // Dynamically use employee count
        borderColor: "#FFBB00",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const totalActiveUsers = fullTimeCount + partTimeCount + adHocCount;
  const activeUsers = fullTimeCount + partTimeCount + adHocCount;
  const inactiveUsers = totalActiveUsers - activeUsers;

  // Doughnut Chart Data for Active Users
  const activeUserData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [activeUsers, inactiveUsers],
        backgroundColor: ["#FF7A00", "#F3F3F3"],
        borderWidth: 0,
      },
    ],
  };
  if (loading) {
    return <Loader />; // Display loader while loading is true
  }
  return (
    <div className="p-8 space-y-8">
      {/* Main Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Time Metrics */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins' }}>Real Time Metrics</h2>
            <Line className="mt-3" data={lineData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Total Employees */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-center relative">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins' }}>Total Employees</h2>
            <Doughnut
              data={pieData}
              options={{
                responsive: true,
                cutout: "70%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                    },
                  },
                },
              }}
              height={240}
              width={240}
              className="mt-5"
            />
            {/* Display Total Employees Count in Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold" style={{ fontFamily: 'Poppins' }}>
              {fullTimeCount + partTimeCount + adHocCount}
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-center relative">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins' }}>Active Users</h2>
            <Doughnut
              data={activeUserData}
              options={{
                responsive: true,
                cutout: "70%", // Only part of the doughnut is filled
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                    },
                  },
                },
              }}
              height={240}
              width={240}
              className="mt-5"
            />
            {/* Display Active Users Count in Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold" style={{ fontFamily: 'Poppins' }}>
              {activeUsers}
            </div>
          </div>
        </div>
      </div>


      <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins' }}>Add Employee</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20">
        {/* Add Employee */}        
        <div className="bg-white p-6 rounded-2xl shadow-xl py-6" style={{ height: '300px' }}>
          <div className="flex justify-center items-center space-x-6 mt-4 h-full">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 p-4 flex items-center justify-center w-1/2">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                id="fileInput"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer text-gray-500 flex flex-col items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm">Upload Employee Card</span>
              </label>
              {file && <div className="mt-2 text-sm text-gray-500">Selected: {file.name}</div>}
            </div>

            {/* Add New Employee Button */}
            <div className="w-1/2">
              <button className="w-full px-6 py-3 text-white rounded-full shadow-md hover:bg-orange-600" style={{ backgroundColor: '#fc8c11', fontFamily: 'Poppins' }}>
                Add New Employee
              </button>
              <div className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Poppins' }}>
                Supported formats: JPG, JPEG, WEBP, PNG
              </div>
            </div>
          </div>
        </div>


        {/* GPS Tracking */}
        <div className="bg-white p-6 rounded-lg shadow-md" style={{ height: "300px" }}>
          <h2 className="text-xl font-semibold text-gray-800">GPS Tracking</h2>
          <div className="w-full h-full">
            <MapContainer
              style={{ height: "100%", width: "100%" }} // Make map fill the parent div height
              center={[37.0902, -95.7129]} // Initial center of the map (default view)
              zoom={5}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MarkerClusterGroup>
                {employeeLocations.map((employee) => (
                  <Marker
                    key={employee.id}
                    position={[employee.latitude, employee.longitude]}
                    icon={customIcon}
                  >
                    <Popup>
                      <strong style={{ fontFamily: "Poppins" }}>{employee.name}</strong>
                      <br />
                      {employee.location}
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
              {/* Fit the map bounds to all the markers */}
              {/* <FitBounds locations={employeeLocations} /> */}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
