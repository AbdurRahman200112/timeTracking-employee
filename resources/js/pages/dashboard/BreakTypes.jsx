import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdKeyboardArrowDown, MdLocalPhone, MdOutlineMailOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import Rectange from "../../../img/Rectangle.png";
import Profile from "../../../img/profile.png";
import Loader from './Loader';

export function BreakTypes() {
  const [employees, setEmployees] = useState([]);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true); // State for loader

  useEffect(() => {
    // Simulate 2-second loader
    setTimeout(() => {
      axios
        .get("/api/break-details")
        .then((response) => {
          setEmployees(response.data);
          setLoading(false); // Turn off loader after data is fetched
        })
        .catch((error) => {
          console.error(error);
          setLoading(false); // Turn off loader even if there's an error
        });
    }, 2000);
  }, []);

  const toggleExpand = (id) => {
    setExpandedEmployeeId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return <Loader />; // Display loader while loading is true
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-lg md:text-2xl font-semibold mb-4 md:mb-6">Employees</h2>
      <div className="flex flex-col gap-4">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white shadow-md rounded-xl overflow-hidden">
            {/* Top Section */}
            <div
              className="flex flex-wrap items-center justify-between px-4 py-5 md:py-7 cursor-pointer hover:shadow-lg"
              onClick={() => toggleExpand(employee.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={Profile}
                  alt={employee.name}
                  className="rounded-full border-4 border-orange-400 w-14 h-14 sm:w-16 sm:h-16"
                />
                <div>
                  <h4 className="text-sm md:text-lg font-semibold text-gray-800">{employee.name}</h4>
                  <p className="text-xs md:text-md text-gray-500">{employee.designation}</p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex justify-end items-center flex-1 gap-4">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-lg ${
                    employee.status === "Approve"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {employee.status}
                </span>
                <MdKeyboardArrowDown className="text-gray-500 text-2xl" />
              </div>
            </div>

            {/* Expanded Section */}
            {expandedEmployeeId === employee.id && (
              <div className="p-4 md:p-6 bg-white shadow-lg rounded-b-lg flex flex-wrap items-center justify-between gap-6">
                {/* Profile Card */}
                <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md" style={{ height: "300px" }}>
                  <div
                    className="relative h-32 bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url(${Rectange})` }}
                  ></div>
                  <div className="flex flex-col items-center -mt-12">
                    <img
                      src={Profile}
                      alt="Profile"
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white z-10"
                    />
                    <h4 className="text-sm md:text-lg font-semibold mt-2">{employee.name}</h4>
                    <p className="text-xs md:text-md text-gray-500">{employee.designation}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-600 text-sm md:text-md">Hourly Rate</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.hourly_rate ? `$${employee.hourly_rate}` : "$0 / hr"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 text-sm md:text-md">Full Time Hours Per Month</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.full_time_hours_per_month ?? "160"} / hrs
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 text-sm md:text-md">Break Duration</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.break_duration || "7 minutes"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 text-sm md:text-md">Saturday Working</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.saturday_working ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 text-sm md:text-md">Daily Overtime Rate</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.daily_overtime_rate ? `${employee.daily_overtime_rate} $ / hr` : "10 $ / hr"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 text-sm md:text-md">OT1-3 Rate</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.ot1_3_rate ?? "20 $ / hr"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 text-sm md:text-md">Employment Type</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.employment_type || "Full-Time"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 text-sm md:text-md">Monthly Overtime rate</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.monthly_overtime_rate || "7.00"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BreakTypes;
