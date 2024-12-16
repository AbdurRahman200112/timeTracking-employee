import React, { useEffect, useState } from "react";
import axios from "axios";
import Rectange from "../../../img/Rectangle.png";
import Profile from "../../../img/profile.png";
import EditProfile from "./EditProfile";

export function Tables({ organizationId }) {
  const [employees, setEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loader visibility

  useEffect(() => {
    axios
    .get(`/api/organization/6/employees`)
    .then((response) => {
        setEmployees(response.data);
        setLoading(false); // Stop the loader when data is loaded
      })
      .catch((error) => {
        console.error("There was an error fetching the data:", error);
        setLoading(false); // Stop the loader even if there is an error
      });
  }, [organizationId]);

  return (
    <>
      <div className={`min-h-screen bg-gray-100 ${loading ? "opacity-50" : ""}`}>
        {loading ? (
          <div className="text-center mt-20">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="text-center mt-20">No employees found.</div>
        ) : (
          employees.map((employee, index) => (
            <div
              key={index}
              className="profile-container w-full p-4 md:p-10 flex flex-col md:flex-row items-start justify-start space-y-6 md:space-y-0 md:space-x-8"
            >
              {/* Left Column: Profile Image and Info */}
              <div className="animate-fadeInLeft rounded-lg mb-4 pb-8 shadow-md bg-white w-full md:w-1/4">
                <img
                  src={Rectange}
                  alt="Organization Logo"
                  className="w-full rounded-t-lg mb-2 h-32 object-cover"
                />
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full -mt-8 z-10">
                    <img
                      src={Profile}
                      alt="Profile Icon"
                      className="h-15 w-15"
                    />
                  </div>
                  <p
                    style={{ fontFamily: "Poppins" }}
                    className="text-center font-semibold text-base md:text-lg mt-2"
                  >
                    {employee.company_name || "Employee Name"}
                  </p>
                </div>
              </div>

              {/* Right Column: Profile Details */}
              <div className="animate-fadeInRight profile-details bg-white rounded-lg p-6 md:p-10 shadow-md w-full md:w-3/4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      style={{ fontFamily: "Poppins" }}
                      className="block font-semibold text-sm md:text-base text-gray-600"
                    >
                      Name
                    </label>
                    <p
                      style={{ fontFamily: "Poppins" }}
                      className="mt-1 text-sm md:text-base"
                    >
                      {employee.company_name}
                    </p>
                  </div>
                  <div>
                    <label
                      style={{ fontFamily: "Poppins" }}
                      className="block font-semibold text-sm md:text-base text-gray-600"
                    >
                      Email
                    </label>
                    <p
                      style={{ fontFamily: "Poppins" }}
                      className="mt-1 text-sm md:text-base"
                    >
                      {employee.contact_email}
                    </p>
                  </div>
                  <div>
                    <label
                      style={{ fontFamily: "Poppins" }}
                      className="block font-semibold text-sm md:text-base text-gray-600"
                    >
                      Phone Number
                    </label>
                    <p
                      style={{ fontFamily: "Poppins" }}
                      className="mt-1 text-sm md:text-base"
                    >
                      {employee.contact_phone}
                    </p>
                  </div>
                  {/* <div className="col-span-1 md:col-span-2">
                    <label
                      style={{ fontFamily: "Poppins" }}
                      className="block font-semibold text-sm md:text-base text-gray-600"
                    >
                      Address
                    </label>
                    <p
                      style={{ fontFamily: "Poppins" }}
                      className="mt-1 text-sm md:text-base"
                    >
                      {employee.location}
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Tables;
