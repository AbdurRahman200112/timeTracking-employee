import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { CSVLink } from "react-csv";

export function EmployeeRulesList() {
  const [employeeRules, setEmployeeRules] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const componentRef = useRef();

  // Fetch employee rules
  useEffect(() => {
    axios
      .get("/api/employees/overTimeRules")
      .then((response) => setEmployeeRules(response.data))
      .catch((error) => console.error("Error fetching employee rules:", error));
  }, []);

  // Export as PDF
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Employee Rules List",
    onAfterPrint: () => alert("PDF Export Successful!"),
  });

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
      <div className="max-w-7xl mx-auto rounded-2xl px-10 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Employee Rules</h1>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg shadow-md"
            >
              Export Timesheet
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-xl z-50">
                                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename="Employee_Rules_List.csv"
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </CSVLink>
                <button
                  onClick={handlePrint}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>

        <div ref={componentRef} className="space-y-8">
          {employeeRules.length > 0 ? (
            employeeRules.map((rule, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 px-10 py-8 bg-white shadow-lg rounded-2xl"
              >
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-orange-600">
                      {rule.employee_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-800">
                      {rule.employee_name}
                    </p>
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
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-700 font-semibold">
              No rules available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeRulesList;
