import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdKeyboardArrowDown,
  MdLocalPhone,
  MdOutlineMailOutline,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import Rectange from "../../../img/Rectangle.png";
import Profile from "../../../img/profile.png";
import { useNavigate } from "react-router-dom"; // Import React Router navigation
import { EditEmployee } from "./EditEmployee";

export function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/employee-details")
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error(error));
  }, []);

  const toggleExpand = (id) => {
    setExpandedEmployeeId((prev) => (prev === id ? null : id));
  };
  const deleteEmployee = async (id) => {
    try {
      const response = await axios.delete(`/api/employee/${id}`);
      const deletedEmployee = response.data.employee;

      // Filter out deleted employee
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id)
      );

      // Navigate to new page and pass deleted employee details
      navigate("/dashboard/employeeDetails", { state: { deletedEmployee } });
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  }
  if (editingEmployeeId) {
    // Render EditEmployee if an employee is being edited
    return <EditEmployee id={editingEmployeeId} onClose={() => setEditingEmployeeId(null)} />;
  }
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
        Employees
      </h2>
      <div className="flex flex-col gap-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white shadow-md rounded-xl overflow-hidden"
          >
            {/* Top Section */}
            <div
              className="flex items-center justify-between px-4 py-5 md:py-7 cursor-pointer hover:shadow-lg"
              onClick={() => toggleExpand(employee.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={Profile}
                  alt={employee.name}
                  className="rounded-full border-4 border-orange-400"
                  style={{ height: "70px", width: "70px" }}
                />
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-gray-800">
                    {employee.name}
                  </h4>
                  <p className="text-md md:text-md text-gray-500">
                    {employee.designation}
                  </p>
                </div>
              </div>

              {/* Center Section */}
              <div className="flex justify-center items-center flex-1 gap-8 text-center">
                <p className="text-md md:text-md text-gray-500">
                  {employee.designation}
                </p>
              </div>
              <div className="flex justify-center items-center flex-1 gap-8 text-center">

                <p className="text-md md:text-md text-gray-500">
                  {employee.joining_date}
                </p>
              </div>

              {/* Right Section */}
              <div className="flex justify-end items-center flex-1 gap-4">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-lg ${employee.status === "Approve"
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
                <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md" style={{ height: '300px' }}>
                  <div
                    className="relative h-32 bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url(${Rectange})` }}
                  ></div>
                  <div className="flex flex-col items-center -mt-12">
                    <img
                      src={Profile}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-white z-10"
                    />
                    <h4 className="text-lg md:text-xl font-semibold mt-2">
                      {employee.name}
                    </h4>
                    <p className="text-md md:text-md text-gray-500">
                      {employee.designation}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-600">Designation</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.designation}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600">Joining Date</h4>
                    <p className="text-gray-500 text-md md:text-md">
                      {employee.joining_date}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600">
                      Contact Information
                    </h4>
                    <div className="flex gap-2 items-center text-gray-500 text-md md:text-md">
                      <MdLocalPhone /> {employee.contact}
                    </div>
                    <div className="flex gap-2 items-center text-gray-500 text-md md:text-md">
                      <MdOutlineMailOutline /> {employee.email}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600">Status</h4>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-lg ${employee.status === "Approve"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {employee.status}
                    </span>
                  </div>
                </div>

                {/* Buttons on the Right */}
                <div className="w-full flex justify-end items-center gap-4 mt-auto">
                  <button
                    className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
                    onClick={() => navigate(`/dashboard/edit-employee/${employee.id}`)}
                  >
                    Edit Profile
                  </button>

                  <button className="bg-orange-100 text-orange-600 p-3 rounded-full hover:bg-orange-200 transition">
                    <RiDeleteBin6Line onClick={() => deleteEmployee(employee.id)} className="text-xl" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeDetails;
