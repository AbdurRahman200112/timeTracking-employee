import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function EditRules() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    break_duration: 0,
    subtract_from_total: false,
    toggle_overtime: false,
    monthly_overtime_start: "",
    weekly_overtime_start: "",
    monthly_rate: "",
    weekly_rate: "",
    daily_start_time: "",
    daily_rate: "",
    early_start_time: "",
    early_start_rate: "",
    saturday_rate: "",
    saturday_is_working_day: false,
    employement_type: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch rule data
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/organization/getRules/${id}`)
        .then((response) => {
          setFormData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching rule:", error);
          toast.error("Failed to fetch rule data.");
          setLoading(false);
        });
    }
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/organization/updateRule/${id}`, formData)
      .then(() => {
        toast.success("Rule updated successfully!");
        setTimeout(() => navigate("/dashboard/organization-rules"), 2000);
      })
      .catch((error) => {
        console.error("Error updating rule:", error);
        toast.error("Failed to update the rule. Please try again.");
      });
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Edit Rule</h2>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          {[
            { label: "Break Duration (minutes)", name: "break_duration", type: "number" },
            { label: "Monthly Overtime Start", name: "monthly_overtime_start", type: "number" },
            { label: "Weekly Overtime Start", name: "weekly_overtime_start", type: "number" },
            { label: "Monthly Rate", name: "monthly_rate", type: "number" },
            { label: "Weekly Rate", name: "weekly_rate", type: "number" },
            { label: "Daily Start Time", name: "daily_start_time", type: "time" },
            { label: "Daily Rate", name: "daily_rate", type: "number" },
            { label: "Early Start Time", name: "early_start_time", type: "time" },
            { label: "Early Start Rate", name: "early_start_rate", type: "number" },
            { label: "Saturday Rate", name: "saturday_rate", type: "number" },
            { label: "Employment Type", name: "employement_type", type: "text" },
          ].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-600 font-medium">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          ))}

          {/* Checkbox Fields */}
          {[
            { label: "Subtract from Total", name: "subtract_from_total" },
            { label: "Toggle Overtime", name: "toggle_overtime" },
            { label: "Saturday Working Day", name: "saturday_is_working_day" },
          ].map((checkbox, index) => (
            <div key={index} className="mb-4 flex items-center">
              <input
                type="checkbox"
                name={checkbox.name}
                checked={formData[checkbox.name] || false}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label>{checkbox.label}</label>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard/organization-rules")}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRules;
