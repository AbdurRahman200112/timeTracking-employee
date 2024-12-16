import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import MapPin from "../../../img/map-pin.png";

const customIcon = new L.Icon({
  iconUrl: MapPin,
  iconSize: [40, 70],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export function EmployeeMap() {
  const [employeeLocations, setEmployeeLocations] = useState([]);

  const fetchEmployeeLocations = async () => {
    try {
      const response = await axios.get("/api/employees/locations"); // Replace with your actual API URL
      setEmployeeLocations(response.data);
    } catch (error) {
      console.error("Error fetching employee locations:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeLocations();
  }, []);

  const containerStyle = {
    width: "100%",
    height: "100vh",
    margin: 0,
    position: "relative", // Ensures proper positioning
    zIndex: 0, // Send the map behind the sidenav
  };

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <MapContainer
        style={containerStyle}
        center={[37.0902, -95.7129]} // Default US center
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
      </MapContainer>
    </div>
  );
}

export default EmployeeMap;
