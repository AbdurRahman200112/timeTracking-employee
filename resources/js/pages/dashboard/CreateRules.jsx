import React, { useState } from "react";
import axios from "axios";

export function CreateRules() {
  const [formData, setFormData] = useState({
    break_rules: [
      {
        type: "self_paid",
        duration: 30,
        subtract_from_total: true,
      },
      {
        type: "organization_paid",
        duration: 30,
        subtract_from_total: false,
      },
    ],
    overtime_rules: {
      toggle_overtime: false,
      monthly_rate: 0,
      weekly_rate: 0,
      daily_start_time: "",
      daily_rate: 0,
      early_start_time: "",
      early_start_rate: 0,
      saturday_rate: 0,
      saturday_is_working_day: false, // Default set to false (Saturday is not a working day)
      employement_type: "",
    },
  });

  const handleBreakChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedBreakRules = [...formData.break_rules];
    updatedBreakRules[index][name] =
      type === "checkbox" ? checked : type === "number" ? parseInt(value, 10) : value;
    setFormData({ ...formData, break_rules: updatedBreakRules });
  };

  const handleOvertimeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      overtime_rules: {
        ...formData.overtime_rules,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/organization/storeRules", formData)
      .then(() => {
        alert("Rules added successfully!");
        setFormData({
          break_rules: [
            {
              type: "self_paid",
              duration: 30,
              subtract_from_total: true,
            },
            {
              type: "organization_paid",
              duration: 30,
              subtract_from_total: false,
            },
          ],
          overtime_rules: {
            toggle_overtime: false,
            monthly_rate: 0,
            weekly_rate: 0,
            daily_start_time: "",
            daily_rate: 0,
            early_start_time: "",
            early_start_rate: 0,
            saturday_rate: 0,
            saturday_is_working_day: false,
            employement_type: "",
          },
        });
      })
      .catch((error) => console.error("Error adding rules:", error));
  };

  const renderEmploymentSpecificFields = () => {
    const { employement_type } = formData.overtime_rules;

    switch (employement_type) {
      case "Full-Time":
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Monthly Overtime Rate:
              </label>
              <input
                type="number"
                name="monthly_rate"
                value={formData.overtime_rules.monthly_rate}
                onChange={handleOvertimeChange}
                required
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
              />
            </div>
          </>
        );

      case "Part-Time":
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Weekly Overtime Rate:
              </label>
              <input
                type="number"
                name="weekly_rate"
                value={formData.overtime_rules.weekly_rate}
                onChange={handleOvertimeChange}
                required
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
              />
            </div>
          </>
        );

      case "Adhoc":
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Daily Rate:</label>
              <input
                type="number"
                name="daily_rate"
                value={formData.overtime_rules.daily_rate}
                onChange={handleOvertimeChange}
                required
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">
          Employee Rules Management
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Break Rules</h3>
              {formData.break_rules.map((rule, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {rule.type === "self_paid" ? "Self-Paid Break" : "Organization-Paid Break"} Duration
                    (minutes):
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={rule.duration}
                    onChange={(e) => handleBreakChange(e, index)}
                    required
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="subtract_from_total"
                      checked={rule.subtract_from_total}
                      onChange={(e) => handleBreakChange(e, index)}
                      className="h-5 w-5 text-orange-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-gray-700">Subtract from Total</label>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Overtime Rules</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Employment Type:
                </label>
                <select
                  name="employement_type"
                  value={formData.overtime_rules.employement_type}
                  onChange={handleOvertimeChange}
                  required
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Adhoc">Adhoc</option>
                </select>
              </div>
              {renderEmploymentSpecificFields()}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Is Saturday a Working Day?
                </label>
                <input
                  type="checkbox"
                  name="saturday_is_working_day"
                  checked={formData.overtime_rules.saturday_is_working_day}
                  onChange={handleOvertimeChange}
                  className="h-5 w-5 text-orange-600 border-gray-300 rounded"
                />
              </div>
              {formData.overtime_rules.saturday_is_working_day && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Saturday Rate:</label>
                  <input
                    type="number"
                    name="saturday_rate"
                    value={formData.overtime_rules.saturday_rate}
                    onChange={handleOvertimeChange}
                    required
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-6 py-4 bg-orange-600 text-white font-semibold rounded-lg"
          >
            Add Rules
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRules;
