import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function EditEmployeeRules() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_name: "",
    break_duration: 0,
    subtract_from_total: false,
    toggle_overtime: false,
    monthly_overtime_start: "",
    weekly_overtime_start: "",
    monthly_rate: 0,
    weekly_rate: 0,
    daily_start_time: "",
    daily_rate: 0,
    early_start_time: "",
    early_start_rate: 0,
    saturday_rate: 0,
    saturday_is_working_day: false,
  });

  useEffect(() => {
    axios
      .get(`/api/employees/getRule/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rule:", error);
        toast.error("Failed to fetch rule data.");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/employees/updateRule/${id}`, formData)
      .then(() => {
        toast.success("Rules updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating rules:", error);
        toast.error("Failed to update rules.");
      });
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", padding: 0 }}>
      <ToastContainer />
      <div className="w-100 mx-auto px-6 lg:px-12 py-10 bg-white">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#fb9102]">
          Edit Employee Rules
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Employee Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Employee Name:
              </label>
              <input
                type="text"
                name="employee_name"
                value={formData.employee_name}
                disabled
                className="block w-full px-4 py-3 bg-gray-200 border rounded-lg"
              />
            </div>

            {/* Start Time */}
            {/* Break Duration */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Break Duration (minutes):
              </label>
              <input
                type="number"
                name="break_duration"
                value={formData.break_duration}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 bg-gray-50 border rounded-lg"
              />
            </div>

            {/* Subtract from Total */}
            <div className="flex items-center gap-4 mb-4">
              <input
                type="checkbox"
                name="subtract_from_total"
                checked={formData.subtract_from_total}
                onChange={handleInputChange}
                className="h-5 w-5 text-[#fb9102] focus:ring-[#fb9102] border-gray-300 rounded-lg"
              />
              <label className="text-gray-700 font-semibold">
                Subtract from Total
              </label>
            </div>

            {/* Enable Overtime */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Enable Overtime:
              </label>
              <input
                type="checkbox"
                name="toggle_overtime"
                checked={formData.toggle_overtime}
                onChange={handleInputChange}
                className="h-5 w-5 text-[#fb9102] focus:ring-[#fb9102] border-gray-300 rounded-lg"
              />
            </div>

            {/* Monthly Overtime Start */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
               Overtime Start (hrs):
              </label>
              <input
                type="number"
                name="monthly_overtime_start"
                value={formData.monthly_overtime_start}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 bg-gray-50 border rounded-lg"
              />
            </div>

            {/* Weekly Overtime Start */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Daily Rate $
              </label>
              <input
                type="number"
                name="weekly_overtime_start"
                value={formData.daily_rate}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 bg-gray-50 border rounded-lg"
              />
            </div>

            {/* Weekly Rate */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Weekly Rate $
              </label>
              <input
                type="number"
                name="weekly_rate"
                value={formData.weekly_rate}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 bg-gray-50 border rounded-lg"
              />
            </div>
            {/* Monthly Rate */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Monthly Rate $
              </label>
              <input
                type="number"
                name="monthly_rate"
                value={formData.monthly_rate}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 bg-gray-50 border rounded-lg"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 mt-6 bg-[#fb9102] text-white font-semibold rounded-lg shadow-lg hover:bg-[#e88002] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb9102]"
          >
            Update Rules
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEmployeeRules;
