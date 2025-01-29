import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFileCsv, FaFilePdf } from "react-icons/fa";

export function OrganizationRules() {
  const [employeeRules, setEmployeeRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRuleId, setDeleteRuleId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can change this to control the number of items per page
  const [breakDurationFilter, setBreakDurationFilter] = useState([0, 600]); // min to max range for break duration in minutes
  const [workHoursFilter, setWorkHoursFilter] = useState([0, 24]); // min to max range for total work hours
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Handle clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportMenu(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowExportMenu]);

  const csvHeaders = [
    { label: "Break Duration", key: "break_duration" },
    { label: "Subtract Break", key: "subtract_from_total" },
    { label: "Total Work Hours", key: "total_work_hours" },
    { label: "Calculated Hours", key: "total_calculated_hours" },
    { label: "Monthly Overtime Start", key: "monthly_overtime_start" },
    { label: "Monthly Rate", key: "monthly_rate" },
    { label: "Weekly Overtime Start", key: "weekly_overtime_start" },
    { label: "Weekly Rate", key: "weekly_rate" },
    { label: "Saturday Working Day", key: "saturday_is_working_day" },
    { label: "Saturday Rate", key: "saturday_rate" },
    { label: "Employment Type", key: "employement_type" },
  ];

  useEffect(() => {
    axios
      .get("/api/organization/overTimeRules")
      .then((response) => {
        const updatedRules = response.data.map((rule) => ({
          ...rule,
          total_calculated_hours: rule.total_work_hours
            ? rule.total_work_hours - (rule.break_duration || 0) / 60
            : null,
        }));
        setEmployeeRules(updatedRules);
        setFilteredRules(updatedRules); // Initially, filteredRules is the same as all employeeRules
      })
      .catch((error) => console.error("Error fetching rules:", error));
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = employeeRules;
    // Apply break duration filter
    filtered = filtered.filter((rule) =>
      rule.break_duration >= breakDurationFilter[0] && rule.break_duration <= breakDurationFilter[1]
    );
    // Apply total work hours filter
    filtered = filtered.filter((rule) =>
      rule.total_work_hours >= workHoursFilter[0] && rule.total_work_hours <= workHoursFilter[1]
    );
    // Apply employment type filter
    if (employmentTypeFilter) {
      filtered = filtered.filter((rule) => rule.employement_type === employmentTypeFilter);
    }
    // Set filtered rules
    setFilteredRules(filtered);
  }, [employeeRules, breakDurationFilter, workHoursFilter, employmentTypeFilter]);

  // Handle search filter
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filtered = employeeRules.filter((rule) =>
        rule.break_duration.toString().toLowerCase().includes(query.toLowerCase()) ||
        rule.total_work_hours?.toString().includes(query)
      );
      setFilteredRules(filtered);
    } else {
      setFilteredRules(employeeRules); // Reset filter if query is empty
    }
  };

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRules = filteredRules.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenDeleteModal = (id) => {
    setDeleteRuleId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteRuleId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteRule = () => {
    axios
      .delete(`/api/organization/deleteRules/${deleteRuleId}`)
      .then(() => {
        setEmployeeRules((prevRules) =>
          prevRules.filter((rule) => rule.id !== deleteRuleId)
        );
        setFilteredRules((prevRules) =>
          prevRules.filter((rule) => rule.id !== deleteRuleId)
        );
        setShowDeleteModal(false);
        setDeleteRuleId(null);
        toast.success("Rule deleted successfully!");
      })
      .catch((error) => console.error("Error deleting rule:", error));
  };
  const generatePagination = () => {
    const totalPages = Math.ceil(filteredRules.length / itemsPerPage);
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 2) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Rules Overview", 20, 10);
    const tableData = employeeRules.map((rule) => [
      rule.break_duration || "N/A",
      rule.subtract_from_total ? "Yes" : "No",
      rule.total_work_hours || "N/A",
      rule.total_calculated_hours?.toFixed(2) || "N/A",
      rule.monthly_overtime_start || "N/A",
      rule.monthly_rate || "N/A",
      rule.weekly_overtime_start || "N/A",
      rule.weekly_rate || "N/A",
      rule.saturday_is_working_day ? "Yes" : "No",
      rule.saturday_rate || "0",
      rule.employement_type || "N/A",
    ]);
    doc.autoTable({
      head: [csvHeaders.map((header) => header.label)],
      body: tableData,
    });
    doc.save("organization_rules.pdf");
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-white">
      <ToastContainer />
      <div className="w-100 mx-auto px-6 lg:px-12 py-10">
        <div className="shadow-lg bg-white rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1
              style={{ fontFamily: "Poppins" }}
              className="text-2xl font-bold text-gray-800"
            >
              Rules Overview
            </h1>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu((prev) => !prev)}
                style={{ fontFamily: "Poppins" }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-2xl shadow-md"
              >
                Export
              </button>
              {showExportMenu && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg"
                >
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaFilePdf className="mr-2 text-red-600" />
                    Export as PDF
                  </button>
                  <CSVLink
                    data={employeeRules}
                    headers={csvHeaders}
                    filename={"organization_rules.csv"}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaFileCsv className="mr-2 text-green-600" />
                    Export as CSV
                  </CSVLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-600 mb-2">Break Duration (Min)</label>
            <div style={{ position: "relative" }}>
              {/* Displaying the value outside the range slider */}
              <div
                style={{
                  color: "#ff7f00", // Orange color for the text
                  textAlign: "center",
                  marginBottom: "8px",
                }}
              >
                {breakDurationFilter[0]} min
              </div>
              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max="600"
                value={breakDurationFilter[0]}
                onChange={(e) =>
                  setBreakDurationFilter([parseInt(e.target.value), breakDurationFilter[1]])
                }
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  appearance: "none",
                  outline: "none",
                  background: `linear-gradient(to right, #ff7f00 ${(breakDurationFilter[0] / 600) * 100
                    }%, #ddd ${(breakDurationFilter[0] / 600) * 100}%)`, // Dynamic gray to orange background
                  cursor: "pointer",
                }}
              />
              {/* Custom Thumb Styling */}
              <style>
                {`
                    input[type="range"]::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ff7f00; /* Orange color */
                      cursor: pointer;
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ff7f00; /* Orange color */
                      cursor: pointer;
                    }
                    input[type="range"]::-ms-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ff7f00; /* Orange color */
                      cursor: pointer;
                    }
                    `}
              </style>
            </div>
          </div>

          {/* Total Work Hours */}
          <div>
            <label className="block text-gray-600 mb-2">Total Work Hours</label>
            <div style={{ position: "relative" }}>
              {/* Displaying the value outside the range slider */}
              <div
                style={{
                  color: "#ff7f00", // Orange color for the text
                  textAlign: "center",
                  marginBottom: "8px",
                }}
              >
                {workHoursFilter[0]} hrs
              </div>
              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max="24"
                value={workHoursFilter[0]}
                onChange={(e) =>
                  setWorkHoursFilter([parseInt(e.target.value), workHoursFilter[1]])
                }
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  appearance: "none",
                  outline: "none",
                  background: `linear-gradient(to right, #ff7f00 ${(workHoursFilter[0] / 24) * 100
                    }%, #ddd ${(workHoursFilter[0] / 24) * 100}%)`, // Dynamic gray to orange background
                  cursor: "pointer",
                }}
              />
              {/* Custom Thumb Styling */}
              <style>
                {`
                    input[type="range"]::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ff7f00; /* Orange color */
                      cursor: pointer;
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ff7f00; /* Orange color */
                      cursor: pointer;
                    }
                    input[type="range"]::-ms-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #ff7f00; /* Orange color */
                      cursor: pointer;
                    }
                  `}
              </style>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Employment Type</label>
            <select
              value={employmentTypeFilter}
              onChange={(e) => setEmploymentTypeFilter(e.target.value)}
              style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
              className="mt-2 block w-full px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"

            >
              <option value="">All</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Break Duration</th>
                <th className="px-6 py-4 text-left">Subtract From Total</th>
                <th className="px-6 py-4 text-left">Total Work Hours</th>
                <th className="px-6 py-4 text-left">Calculated Hours</th>
                <th className="px-6 py-4 text-left">Monthly Overtime Start</th>
                <th className="px-6 py-4 text-left">Monthly Rate</th>
                <th className="px-6 py-4 text-left">Weekly Overtime Start</th>
                <th className="px-6 py-4 text-left">Weekly Rate</th>
                <th className="px-6 py-4 text-left">Saturday Work Day</th>
                <th className="px-6 py-4 text-left">Saturday Rate</th>
                <th className="px-6 py-4 text-left">Employment Type</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">{rule.break_duration} min</td>
                  <td className="px-6 py-4 border-b">
                    {rule.subtract_from_total ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 border-b">{Math.round(rule.total_work_hours)}</td>
                  <td className="px-6 py-4 border-b">{Math.round(rule.total_calculated_hours)}</td>

                  <td className="px-6 py-4 border-b">{rule.monthly_overtime_start || 0} /hrs </td>
                  <td className="px-6 py-4 border-b">{rule.monthly_rate}</td>
                  <td className="px-6 py-4 border-b">{rule.weekly_overtime_start || 0} /hrs</td>
                  <td className="px-6 py-4 border-b">{rule.weekly_rate}</td>
                  <td className="px-6 py-4 border-b">
                    {rule.saturday_is_working_day ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 border-b">{rule.saturday_rate}</td>
                  <td className="px-6 py-4 border-b">{rule.employement_type}</td>
                  <td className="px-6 py-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/edit/${rule.id}`)
                        }
                        className="text-blue-600"
                      >
                        <LiaEdit />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(rule.id)}
                        className="text-red-600"
                      >
                        <RiDeleteBin5Line />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end space-x-2 mt-4">
          {generatePagination().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-4 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => paginate(page)}
                className={`px-4 py-2 rounded-md ${currentPage === page ? "bg-orange-500 text-white" : "bg-gray-300"
                  }`}
              >
                {page}
              </button>
            )
          )}
        </div>


        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl mb-4">
                Are you sure you want to delete this rule?
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteRule}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
                <button
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
