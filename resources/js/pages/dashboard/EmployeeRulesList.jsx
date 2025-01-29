import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import { FaFileCsv, FaFilePdf, FaEdit, FaTrash } from "react-icons/fa";
import { jsPDF } from "jspdf";

export function EmployeeRulesList() {
  const [employeeRules, setEmployeeRules] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRuleId, setDeleteRuleId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const dropdownRef = useRef(); // Ref for dropdown container

  // Fetch employee rules
  useEffect(() => {
    axios
      .get("/api/employees/overTimeRules")
      .then((response) => setEmployeeRules(response.data))
      .catch((error) => console.error("Error fetching employee rules:", error));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Export as PDF using jsPDF
  const handleExportPdf = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Employee Rules List", 14, 20);

    // Define headers and rows
    const headers = [
      [
        "Employee Name",
        "Break Type",
        "Break Duration (mins)",
        "Subtract Break",
        "Total Work Hours",
        "Toggle Overtime",
        "Monthly Rate",
        "Weekly Rate",
      ],
    ];

    const rows = employeeRules.map((rule) => [
      rule.employee_name || "N/A",
      rule.break_type || "N/A",
      rule.break_duration || "N/A",
      rule.subtract_from_total ? "Yes" : "No",
      rule.total_work_hours
        ? `${parseFloat(rule.total_work_hours).toFixed(2)} hrs`
        : "N/A",
      rule.toggle_overtime ? "Enabled" : "Disabled",
      rule.monthly_rate ? `$${rule.monthly_rate}` : "N/A",
      rule.weekly_rate ? `$${rule.weekly_rate}` : "N/A",
    ]);

    // Use autoTable to create a table
    doc.autoTable({
      startY: 30,
      head: headers,
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [255, 165, 0] }, // Optional: Customize header colors
    });

    // Save the PDF
    doc.save("Employee_Rules_List.pdf");
  };


  // Open delete confirmation modal
  const handleOpenDeleteModal = (id) => {
    setDeleteRuleId(id);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setDeleteRuleId(null);
    setShowDeleteModal(false);
  };

  // Handle delete action
  const handleDelete = () => {
    axios
      .delete(`/api/employees/overTimeRules/${deleteRuleId}`)
      .then(() => {
        setEmployeeRules(employeeRules.filter((rule) => rule.id !== deleteRuleId));
        handleCloseDeleteModal();
      })
      .catch((error) => console.error("Error deleting rule:", error));
  };

  // Pagination logic
  const totalPages = Math.ceil(employeeRules.length / itemsPerPage);
  const currentItems = employeeRules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // CSV Headers
  const headers = [
    { label: "Employee Name", key: "employee_name" },
    { label: "Break Type", key: "break_type" },
    { label: "Break Duration (mins)", key: "break_duration" },
    { label: "Subtract Break", key: "subtract_from_total" },
    { label: "Total Work Hours", key: "total_work_hours" },
    { label: "Toggle Overtime", key: "toggle_overtime" },
    { label: "Monthly Rate", key: "monthly_rate" },
    { label: "Weekly Rate", key: "weekly_rate" },
  ];

  const csvData = employeeRules.map((rule) => ({
    employee_name: rule.employee_name,
    break_type: rule.break_type || "N/A",
    break_duration: rule.break_duration || "N/A",
    subtract_from_total: rule.subtract_from_total ? "Yes" : "No",
    total_work_hours: rule.total_work_hours
      ? `${parseFloat(rule.total_work_hours).toFixed(2)} hrs`
      : "N/A",
    toggle_overtime: rule.toggle_overtime ? "Enabled" : "Disabled",
    monthly_rate: rule.monthly_rate ? `$${rule.monthly_rate}` : "N/A",
    weekly_rate: rule.weekly_rate ? `$${rule.weekly_rate}` : "N/A",
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Employee Rules</h1>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2"
            >
              <span>Export Timesheet</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-xl z-50 transition-all duration-300">
                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename="Employee_Rules_List.csv"
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FaFileCsv className="text-green-600" />
                  <span>Export as CSV</span>
                </CSVLink>
                <button
                  onClick={handleExportPdf}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FaFilePdf className="text-red-600" />
                  <span>Export as PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {currentItems.length > 0 ? (
            currentItems.map((rule, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-white shadow-lg rounded-2xl transition-transform hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-orange-600">
                      {rule.employee_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{rule.employee_name}</p>
                    <p className="text-sm text-gray-500">
                      Entry Date: {new Date().toISOString().split("T")[0]}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Break Type: </span>
                    {rule.break_type || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Break Duration: </span>
                    {rule.break_duration || "N/A"} mins
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Subtract Break: </span>
                    {rule.subtract_from_total ? "Yes" : "No"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Working Hours: </span>
                    {rule.total_work_hours
                      ? `${parseFloat(rule.total_work_hours).toFixed(2)} hrs`
                      : "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Start Time: </span>
                    {rule.daily_start_time || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">End Time: </span>
                    {rule.daily_rate ? "16:00:00" : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Overtime: </span>
                    {rule.toggle_overtime ? "Enabled" : "Disabled"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Monthly Rate: </span>
                    {rule.monthly_rate ? `$${rule.monthly_rate}` : "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Weekly Rate: </span>
                    {rule.weekly_rate ? `$${rule.weekly_rate}` : "N/A"}
                  </p>
                  <button
                    onClick={() => navigate(`/edit-employee-rules/${rule.id}`)}
                    className="text-blue-500 hover:text-blue-700 mt-4 flex items-center space-x-1"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-700 font-semibold">No rules available.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-6 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default EmployeeRulesList;
