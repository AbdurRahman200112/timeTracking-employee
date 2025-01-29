import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdKeyboardArrowDown, MdLocalPhone, MdOutlineMailOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { EditEmployee } from "./EditEmployee";
import Loader from "./Loader";
import Profile from "../../../img/profile.png";
import { ToastContainer, toast } from "react-toastify";
import Rectange from "../../../img/Rectangle.png";

export function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [toggleStates, setToggleStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/employee-details")
      .then((response) => {
        setEmployees(response.data);
        const initialStates = {};
        response.data.forEach((employee) => {
          initialStates[employee.id] = true;
        });
        setToggleStates(initialStates);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
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
    setShowModal(false); // Close the modal after deletion
  };


  const toggleEmployeeStatus = (id) => {
    setToggleStates((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      toast.success(newState[id] ? "Account is activated" : "Account is disabled");
      return newState;
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const pageNumbers = [];
  const maxPageNumbersToShow = 3;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (editingEmployeeId) {
    return <EditEmployee id={editingEmployeeId} onClose={() => setEditingEmployeeId(null)} />;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <ToastContainer />
      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4 md:mb-6">Employees</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-4">
            {currentEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white shadow-md rounded-xl overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-4 py-5 md:py-7 cursor-pointer hover:shadow-lg"
                  onClick={() => toggleExpand(employee.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* <img
                      src={Profile}
                      alt={employee.name}
                      className="rounded-full border-4 border-orange-400 w-14 h-14 sm:w-16 sm:h-16"
                    /> */}
                    <img
                      src={employee.profile || Profile} // Use the employee's profile picture if available
                      alt="Profile"
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white z-10"
                    />

                    <div>
                      <h4 className="text-sm md:text-lg font-semibold text-gray-800">
                        {employee.name}
                      </h4>
                      <p className="text-xs md:text-md text-gray-500">
                        {employee.designation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex justify-center items-center flex-1 gap-8 text-center">
                      <p
                        style={{ fontFamily: "Poppins" }}
                        className="text-xs md:text-md text-gray-500"
                      >
                        {employee.designation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex justify-center items-center flex-1 gap-8 text-center">
                      <p
                        style={{ fontFamily: "Poppins" }}
                        className="text-xs md:text-md text-gray-500"
                      >
                        {employee.joining_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="toggle-switch"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEmployeeStatus(employee.id);
                      }}
                      style={{
                        width: "40px",
                        height: "20px",
                        backgroundColor: toggleStates[employee.id] ? "orange" : "gray",
                        borderRadius: "10px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          position: "absolute",
                          top: "1px",
                          left: toggleStates[employee.id] ? "20px" : "1px",
                          transition: "all 0.3s",
                        }}
                      />
                    </div>
                    <MdKeyboardArrowDown className="text-gray-500 text-2xl" />
                  </div>
                </div>

                {expandedEmployeeId === employee.id && (
                  <div className="p-4 md:p-6 bg-white shadow-lg rounded-b-lg flex flex-wrap items-center justify-between gap-6">
                    {/* Profile Card */}
                    <div
                      className="w-full md:w-1/3 bg-white rounded-lg shadow-md"
                      style={{ height: "300px" }}
                    >
                      <div
                        className="relative h-32 bg-cover bg-center rounded-t-lg"
                        style={{ backgroundImage: `url(${Rectange})` }}
                      ></div>
                      <div className="flex flex-col items-center -mt-12">
                        <img
                          src={employee.profile || Profile} // Use the employee's profile picture if available
                          alt="Profile"
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white z-10"
                        />
                        <h4
                          style={{ fontFamily: "Poppins" }}
                          className="text-sm md:text-lg font-semibold mt-2"
                        >
                          {employee.name}
                        </h4>
                        <p
                          style={{ fontFamily: "Poppins" }}
                          className="text-xs md:text-md text-gray-500"
                        >
                          {employee.designation}
                        </p>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4
                          style={{ fontFamily: "Poppins" }}
                          className="font-semibold text-gray-600 text-sm md:text-md"
                        >
                          Designation
                        </h4>
                        <p
                          style={{ fontFamily: "Poppins" }}
                          className="text-gray-500 text-sm md:text-md"
                        >
                          {employee.designation}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{ fontFamily: "Poppins" }}
                          className="font-semibold text-gray-600 text-sm md:text-md"
                        >
                          Joining Date
                        </h4>
                        <p
                          style={{ fontFamily: "Poppins" }}
                          className="text-gray-500 text-sm md:text-md"
                        >
                          {employee.joining_date}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{ fontFamily: "Poppins" }}
                          className="font-semibold text-gray-600 text-sm md:text-md"
                        >
                          Contact Information
                        </h4>
                        <div className="flex gap-2 items-center text-gray-500 text-sm md:text-md">
                          <MdLocalPhone /> {employee.contact}
                        </div>
                        <div className="flex gap-2 items-center text-gray-500 text-sm md:text-md">
                          <MdOutlineMailOutline /> {employee.email}
                        </div>
                      </div>

                      <div>
                        <h4
                          style={{ fontFamily: "Poppins" }}
                          className="font-semibold mt-4 text-gray-600 text-sm md:text-md"
                        >
                          Status
                        </h4>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-lg ${toggleStates[employee.id]
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                          style={{ fontFamily: "Poppins" }}
                        >
                          {toggleStates[employee.id] ? "Active" : "Deactivated"}
                        </span>
                      </div>
                      <div>
                        <h4
                          style={{ fontFamily: "Poppins" }}
                          className="font-semibold text-gray-600 text-sm md:text-md"
                        >
                          Break Type
                        </h4>
                        <p
                          style={{ fontFamily: "Poppins" }}
                          className="text-gray-500 text-xs md:text-md"
                        >
                          {employee.break_type}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{ fontFamily: "Poppins" }}
                          className="font-semibold text-gray-600 text-sm md:text-md"
                        >
                          Daily Rate
                        </h4>
                        <p
                          style={{ fontFamily: "Poppins" }}
                          className="text-gray-500 text-xs md:text-md"
                        >
                          {employee.daily_rate}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{ fontFamily: "Poppins" }}
                          className="font-semibold text-gray-600 text-sm md:text-md"
                        >
                          Monthly Rate
                        </h4>
                        <p
                          style={{ fontFamily: "Poppins" }}
                          className="text-gray-500 text-sm md:text-md"
                        >
                          {employee.monthly_rate}
                        </p>
                      </div>
                      {employee.additional_file && (
                        <div>
                          <h4
                            style={{ fontFamily: "Poppins" }}
                            className="font-semibold text-gray-600 text-sm md:text-md"
                          >
                            Documents
                          </h4>
                          <a
                            href={`/api/employees/${employee.id}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline text-sm md:text-md"
                          >
                            Download Document
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="w-full flex flex-col sm:flex-row justify-end items-center gap-4 mt-auto">
                      <button
                        style={{ fontFamily: "Poppins" }}
                        className="bg-orange-500 text-white text-xs md:text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition"
                        onClick={() =>
                          navigate(`/dashboard/edit-employee/${employee.id}`)
                        }
                      >
                        Edit Profile
                      </button>

                      <button className="bg-orange-100 text-orange-600 p-2 md:p-3 rounded-full hover:bg-orange-200 transition">
                        <RiDeleteBin6Line
                          onClick={() => {
                            setShowModal(true);
                            setEmployeeToDelete(employee.id);
                          }}
                          className="text-lg md:text-xl"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-6">
          {startPage > 1 && (
            <button
              onClick={() => paginate(1)}
              className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
            >
              1
            </button>
          )}
          {startPage > 2 && <span className="px-2">...</span>}

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 mx-1 rounded-md ${currentPage === number
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          {endPage < totalPages && (
            <button
              onClick={() => paginate(totalPages)}
              className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
            >
              {totalPages}
            </button>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to delete this employee?
              </h3>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => deleteEmployee(employeeToDelete)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetails;
