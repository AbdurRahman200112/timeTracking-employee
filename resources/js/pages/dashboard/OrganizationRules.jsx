import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { CSVLink } from "react-csv";

export function OrganizationRules() {
  const [employeeRules, setEmployeeRules] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const componentRef = useRef();

  // Fetch rules where employement_type exists
  useEffect(() => {
    axios
      .get("/api/organization/overTimeRules")
      .then((response) => {
        const updatedRules = response.data.map((rule) => ({
          ...rule,
          total_calculated_hours: rule.total_work_hours
            ? rule.total_work_hours - (rule.break_duration || 0) / 60
            : null, // Calculate total hours minus break
        }));
        setEmployeeRules(updatedRules);
      })
      .catch((error) => console.error("Error fetching rules:", error));
  }, []);

  // Export as PDF
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Rules List",
    onAfterPrint: () => alert("PDF Export Successful!"),
  });

  // CSV Headers
  const headers = [
    { label: "Break Duration (mins)", key: "break_duration" },
    { label: "Subtract Break", key: "subtract_from_total" },
    { label: "Total Work Hours", key: "total_work_hours" },
    { label: "Calculated Hours", key: "total_calculated_hours" },
    { label: "Toggle Overtime", key: "toggle_overtime" },
    { label: "Monthly Rate", key: "monthly_rate" },
    { label: "Weekly Rate", key: "weekly_rate" },
    { label: "Saturday Working Day", key: "saturday_is_working_day" },
    { label: "Saturday Rate", key: "saturday_rate" },
    { label: "Employment Type", key: "employement_type" },
  ];

  const csvData = employeeRules.map((rule) => ({
    break_duration: rule.break_duration || "N/A",
    subtract_from_total: rule.subtract_from_total ? "Yes" : "No",
    total_work_hours: rule.total_work_hours ? `${rule.total_work_hours} hrs` : "N/A",
    total_calculated_hours: rule.total_calculated_hours
      ? `${rule.total_calculated_hours.toFixed(2)} hrs`
      : "N/A",
    toggle_overtime: rule.toggle_overtime ? "Enabled" : "Disabled",
    monthly_rate: rule.monthly_rate ? `$${rule.monthly_rate}` : "N/A",
    weekly_rate: rule.weekly_rate ? `$${rule.weekly_rate}` : "N/A",
    saturday_is_working_day: rule.saturday_is_working_day ? "Yes" : "No",
    saturday_rate: rule.saturday_rate ? `$${rule.saturday_rate}` : "0",
    employement_type: rule.employement_type || "N/A",
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-7xl mx-auto rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Rules Overview</h1>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-md"
            >
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                <button
                  onClick={handlePrint}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename="Rules_List.csv"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </CSVLink>
              </div>
            )}
          </div>
        </div>

        {/* Table Layout */}
        <div ref={componentRef} className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Break Duration</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Subtract Break</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Total Work Hours</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Calculated Hours</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Toggle Overtime</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Monthly Rate</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Weekly Rate</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Saturday Working Day</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Saturday Rate</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Employment Type</th>
              </tr>
            </thead>
            <tbody>
              {employeeRules.length > 0 ? (
                employeeRules.map((rule, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white border-b" : "bg-gray-50 border-b"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{rule.break_duration || "N/A"} mins</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{rule.subtract_from_total ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rule.total_work_hours ? `${rule.total_work_hours} hrs` : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rule.total_calculated_hours
                        ? `${rule.total_calculated_hours.toFixed(2)} hrs`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rule.toggle_overtime ? "Enabled" : "Disabled"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rule.monthly_rate ? `$${rule.monthly_rate}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rule.weekly_rate ? `$${rule.weekly_rate}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rule.saturday_is_working_day ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rule.saturday_rate ? `$${rule.saturday_rate}` : "0"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{rule.employement_type || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-sm text-gray-700">
                    No rules available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrganizationRules;
