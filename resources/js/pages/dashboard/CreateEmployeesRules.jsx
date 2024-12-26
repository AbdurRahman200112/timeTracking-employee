import React, { useState, useEffect } from "react";
import axios from "axios";

export function CreateEmployeesRules() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_name: "",
    break_rules: [{ type: "self_paid", duration: 30, subtract_from_total: true }],
    overtime_rules: {
      toggle_overtime: true,
      monthly_rate: 1.5,
      weekly_rate: 1.5,
      daily_start_time: "18:00",
      daily_rate: 2.0,
      early_start_time: "05:00",
      early_start_rate: 1.5,
      saturday_rate: 2.0,
      saturday_is_working_day: false,
    },
  });

  // Fetch employees for dropdown
  useEffect(() => {
    axios
      .get("/api/employees/getAllEmployees")
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle nested input changes (e.g., break rules and overtime rules)
  const handleNestedChange = (e, field, index = null) => {
    const { name, value, type, checked } = e.target;

    if (field === "break_rules") {
      const updatedBreakRules = [...formData.break_rules];
      if (type === "checkbox") {
        updatedBreakRules[index][name] = checked;
      } else {
        updatedBreakRules[index][name] = type === "number" ? parseInt(value, 10) : value;
      }
      setFormData({ ...formData, break_rules: updatedBreakRules });
    } else if (field === "overtime_rules") {
      setFormData({
        ...formData,
        overtime_rules: {
          ...formData.overtime_rules,
          [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
        },
      });
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/employees/storeRules", formData)
      .then(() => {
        alert("Rules added successfully!");
        setFormData({
          employee_name: "",
          break_rules: [{ type: "self_paid", duration: 30, subtract_from_total: true }],
          overtime_rules: {
            toggle_overtime: true,
            monthly_rate: 1.5,
            weekly_rate: 1.5,
            daily_start_time: "18:00",
            daily_rate: 2.0,
            early_start_time: "05:00",
            early_start_rate: 1.5,
            saturday_rate: 2.0,
            saturday_is_working_day: false,
          },
        });
      })
      .catch((error) => console.error("Error adding rules:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#fb9102]">
          Employee Rules Management
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Employee Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Select Employee:</label>
              <select
                name="employee_name"
                value={formData.employee_name}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb9102]"
              >
                <option value="">-- Select Employee --</option>
                {employees.map((employee) => (
                  <option key={employee.name} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Break Rules */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Break Rules</h3>
              {/* <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Break Type:</label>
                <select
                  name="type"
                  value={formData.break_rules[0].type}
                  onChange={(e) => handleNestedChange(e, "break_rules", 0)}
                  required
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb9102]"
                >
                  <option value="self_paid">Self-Paid</option>
                  <option value="organization_paid">Organization-Paid</option>
                </select>
              </div> */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Duration (minutes):</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.break_rules[0].duration}
                  onChange={(e) => handleNestedChange(e, "break_rules", 0)}
                  required
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb9102]"
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  name="subtract_from_total"
                  checked={formData.break_rules[0].subtract_from_total}
                  onChange={(e) => handleNestedChange(e, "break_rules", 0)}
                  className="h-5 w-5 text-[#fb9102] focus:ring-[#fb9102] border-gray-300 rounded-lg"
                />
                <label className="text-gray-700 font-semibold">Subtract from Total</label>
              </div>
            </div>

            {/* Overtime Rules */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Overtime Rules</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Enable Overtime:</label>
                <input
                  type="checkbox"
                  name="toggle_overtime"
                  checked={formData.overtime_rules.toggle_overtime}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="h-5 w-5 text-[#fb9102] focus:ring-[#fb9102] border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Monthly Overtime Rate:</label>
                <input
                  type="number"
                  name="monthly_rate"
                  value={formData.overtime_rules.monthly_rate}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb9102]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Weekly Overtime Rate:</label>
                <input
                  type="number"
                  name="weekly_rate"
                  value={formData.overtime_rules.weekly_rate}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb9102]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Daily Start Time:</label>
                <input
                  type="time"
                  name="daily_start_time"
                  value={formData.overtime_rules.daily_start_time}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb9102]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Saturday Rate:</label>
                <input
                  type="number"
                  name="saturday_rate"
                  value={formData.overtime_rules.saturday_rate}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fb9102]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 mt-6 bg-[#fb9102] text-white font-semibold rounded-lg shadow-lg hover:bg-[#e88002] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb9102]"
          >
            Add Rules
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEmployeesRules;
