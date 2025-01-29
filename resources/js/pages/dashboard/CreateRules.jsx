import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function CreateRules() {
  const [formData, setFormData] = useState({
    toggle_overtime: false,
    monthly_rate: 0,
    weekly_rate: 0,
    monthly_overtime_start: "",
    weekly_overtime_start: "",
    daily_start_time: "08:00",
    daily_rate: 0,
    early_start_time: "08:00",
    early_start_rate: 0,
    saturday_rate: 0,
    saturday_is_working_day: false,
    employement_type: "",
    break_duration: 0,
  });

  const [disabledOptions, setDisabledOptions] = useState([]);

  useEffect(() => {
    // Fetch existing rules to determine which employment types are already created
    axios
      .get("/api/organization/overTimeRules")
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          const existingTypes = response.data.map((rule) => rule.employement_type);
          setDisabledOptions(existingTypes);
        }
      })
      .catch((error) => {
        console.error("Error fetching existing rules:", error);
        toast.error("Failed to load existing rules. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/organization/storeRules", formData)
      .then(() => {
        toast.success("Rules added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormData({
          toggle_overtime: false,
          monthly_rate: 0,
          weekly_rate: 0,
          monthly_overtime_start: "",
          weekly_overtime_start: "",
          daily_start_time: "08:00",
          daily_rate: 0,
          early_start_time: "08:00",
          early_start_rate: 0,
          saturday_rate: 0,
          saturday_is_working_day: false,
          employement_type: "",
          break_duration: 0,
        });
      })
      .catch((error) => {
        toast.error("Failed to add rules. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Error adding rules:", error);
      });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <ToastContainer />
        <h1 className="text-3xl font-semibold text-center text-black mb-8">
          Employee Rules Management
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium">Employment Type</label>
              <select
                style={{ backgroundColor: "#f4f4f4", borderRadius: "25px" }}
                name="employement_type"
                value={formData.employement_type}
                onChange={handleChange}
                className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
              >
                <option value="">Select Employment Type</option>
                <option value="Full-Time" disabled={disabledOptions.includes("Full-Time")}>
                  Full-Time {disabledOptions.includes("Full-Time") && "(Rules Set)"}
                </option>
                <option value="Part-Time" disabled={disabledOptions.includes("Part-Time")}>
                  Part-Time {disabledOptions.includes("Part-Time") && "(Rules Set)"}
                </option>
                <option value="Adhoc" disabled={disabledOptions.includes("Adhoc")}>
                  Adhoc {disabledOptions.includes("Adhoc") && "(Rules Set)"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium">Saturday Is Working Day</label>
              <input
                style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                type="checkbox"
                name="saturday_is_working_day"
                checked={formData.saturday_is_working_day}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 border-gray-300"
              />
            </div>


            {formData.saturday_is_working_day && (
              <div>
                <label className="block text-gray-600 font-medium">Saturday Rate $</label>
                <input
                  style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                  type="number"
                  name="saturday_rate"
                  value={formData.saturday_rate}
                  onChange={handleChange}
                  className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                />
              </div>
            )}

            <label className="block text-gray-600 font-medium">Break Duration (Minutes)</label>
            <input
              style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
              type="number"
              name="break_duration"
              value={formData.break_duration}
              onChange={handleChange}
              className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
            />
          </div>


          {/* Right Column */}
          <div className="space-y-4">
            {(formData.employement_type === "Full-Time" || formData.employement_type === "Part-Time") && (
              <>
                <div>
                  <label className="block text-gray-600 font-medium">Monthly Rate $</label>
                  <input
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                    type="number"
                    name="monthly_rate"
                    value={formData.monthly_rate}
                    onChange={handleChange}
                    className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Weekly Rate $</label>
                  <input
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                    type="number"
                    name="weekly_rate"
                    value={formData.weekly_rate}
                    onChange={handleChange}
                    className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Monthly Overtime Start (hrs)</label>
                  <input
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                    type="number"
                    name="monthly_overtime_start"
                    value={formData.monthly_overtime_start}
                    onChange={handleChange}
                    className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Weekly Overtime Start (hrs)</label>
                  <input
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                    type="number"
                    name="weekly_overtime_start"
                    value={formData.weekly_overtime_start}
                    onChange={handleChange}
                    className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Daily Start Time</label>
                  <input
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                    type="time"
                    name="daily_start_time"
                    value={formData.daily_start_time}
                    onChange={handleChange}
                    className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Daily Rate $</label>
                  <input
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                    type="number"
                    name="daily_rate"
                    value={formData.daily_rate}
                    onChange={handleChange}
                    className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Early Start Time</label>
                  <input
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                    type="time"
                    name="early_start_time"
                    value={formData.early_start_time}
                    onChange={handleChange}
                    className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium">Early Start Rate $</label>
                  <input
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '25px' }}
                    type="number"
                    name="early_start_rate"
                    value={formData.early_start_rate}
                    onChange={handleChange}
                    className="mt-2 block w-full px-6 py-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
                  />
                </div>
              </>
            )}

          </div>

          <button
            type="submit"
            className="col-span-2 mt-8 w-full px-6 py-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
            style={{ borderRadius: '25px' }}
          >
            Add Rules
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRules;
