import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function CreateEmployeesRules() {
  const [employees, setEmployees] = useState([]);
  const [existingRules, setExistingRules] = useState([]); // Store employee IDs with existing rules
  const [formData, setFormData] = useState({
    employee_id: "",
    break_rules: [{ duration: 30, subtract_from_total: true }],
    overtime_rules: {
      toggle_overtime: true,
      monthly_overtime_start: 200.0,
      weekly_overtime_start: 40.0,
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

  useEffect(() => {
    // Fetch all employees
    axios
      .get("/api/employees/getAllEmployees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => console.error("Error fetching employees:", error));

    // Fetch employees with existing rules
    axios
      .get("/api/employees/overTimeRules")
      .then((response) => {
        if (Array.isArray(response.data)) {
          const employeeIdsWithRules = response.data
            .filter((employee) => employee.toggle_overtime !== null) // Ensure rules exist
            .map((employee) => employee.id);
          setExistingRules(employeeIdsWithRules);
        }
      })
      .catch((error) => console.error("Error fetching existing rules:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/employees/storeRules", formData)
      .then(() => {
        toast.success("Rules added successfully!");
        setFormData({
          employee_id: "",
          break_rules: [{ duration: 30, subtract_from_total: true }],
          overtime_rules: {
            toggle_overtime: true,
            monthly_overtime_start: 200.0,
            weekly_overtime_start: 40.0,
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
        // Refresh existing rules
        axios
          .get("/api/employees/overTimeRules")
          .then((response) => {
            if (Array.isArray(response.data)) {
              const employeeIdsWithRules = response.data
                .filter((employee) => employee.toggle_overtime !== null)
                .map((employee) => employee.id);
              setExistingRules(employeeIdsWithRules);
            }
          })
          .catch((error) => console.error("Error refreshing existing rules:", error));
      })
      .catch((error) => {
        console.error("Error adding rules:", error);
        toast.error("Failed to add rules. Please try again.");
      });
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", padding: 0, margin: 0 }}>
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#fb9102]">
          Employee Rules Management
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-3">Select Employee:</label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  required
                  className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                      disabled={existingRules.includes(employee.id)}
                    >
                      {employee.name} {existingRules.includes(employee.id) ? "(Rules Set)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Break Duration (minutes):</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.break_rules[0].duration}
                  onChange={(e) => handleNestedChange(e, "break_rules", 0)}
                  required
                  className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  style={{ backgroundColor: '#f4f4f4', borderRadius: '25px', fontFamily: 'Poppins' }}
                />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <input
                  type="checkbox"
                  name="subtract_from_total"
                  checked={formData.break_rules[0].subtract_from_total}
                  onChange={(e) => handleNestedChange(e, "break_rules", 0)}
                  className="h-5 w-5 text-[#fb9102] border-gray-300 rounded-lg"
                />
                <label className="text-gray-700 font-semibold">Subtract from Total</label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Monthly Overtime Start (hrs)</label>
                <input
                  type="number"
                  name="monthly_overtime_start"
                  value={formData.overtime_rules.monthly_overtime_start}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  style={{ backgroundColor: '#f4f4f4', borderRadius: '25px', fontFamily: 'Poppins' }} />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Monthly Overtime Rate $:</label>
                <input
                  type="number"
                  name="monthly_rate"
                  value={formData.overtime_rules.monthly_rate}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  style={{ backgroundColor: '#f4f4f4', borderRadius: '25px', fontFamily: 'Poppins' }}
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Enable Overtime:</label>
                <input
                  type="checkbox"
                  name="toggle_overtime"
                  checked={formData.overtime_rules.toggle_overtime}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="h-5 w-5"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Weekly Overtime Start (hrs)</label>
                <input
                  type="number"
                  name="weekly_overtime_start"
                  value={formData.overtime_rules.weekly_overtime_start}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  style={{ backgroundColor: '#f4f4f4', borderRadius: '25px', fontFamily: 'Poppins' }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Weekly Overtime Rate $</label>
                <input
                  type="number"
                  name="weekly_rate"
                  value={formData.overtime_rules.weekly_rate}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  style={{ backgroundColor: '#f4f4f4', borderRadius: '25px', fontFamily: 'Poppins' }}

                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Daily Start Time:</label>
                <input
                  type="time"
                  name="daily_start_time"
                  value={formData.overtime_rules.daily_start_time}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  style={{ backgroundColor: '#f4f4f4', borderRadius: '25px', fontFamily: 'Poppins' }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Saturday Working Day:</label>
                <input
                  type="checkbox"
                  name="saturday_is_working_day"
                  checked={formData.overtime_rules.saturday_is_working_day}
                  onChange={(e) => handleNestedChange(e, "overtime_rules")}
                  className="h-5 w-5"
                />
                {formData.overtime_rules.saturday_is_working_day && (
                  <div className="mt-4">
                    <label style={{ fontFamily: 'Poppins' }} className="block text-gray-600 font-medium">Saturday Rate $</label>
                    <input
                      type="number"
                      name="saturday_rate"
                      value={formData.overtime_rules.saturday_rate}
                      onChange={(e) => handleNestedChange(e, "overtime_rules")}
                      required
                      className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                      style={{ backgroundColor: '#f4f4f4', borderRadius: '25px', fontFamily: 'Poppins' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 mt-6 bg-[#fb9102] text-white rounded-full">
            Add Rules
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEmployeesRules;
