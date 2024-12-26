import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function EditEmployee() {
  const { id } = useParams(); // Get employee ID from route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    joining_date: "",
    cnic: "",
    Designation: "",
    department: "",
    employment_type: "",
  });

  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch existing employee data
    axios
      .get(`/api/employeeShow/${id}`)
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load employee data.");
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      toast.error(Object.values(validationErrors).join(" "));
      return;
    }

    try {
      const response = await axios.put(`/api/updateEmployee/${id}`, formData); // API endpoint
      toast.success(response.data.message);
      navigate("/dashboard/employeeDetails");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div
      className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg border"
      style={{ marginTop: "100px", width: "100%" }}
    >
      {/* Toastify Container */}
      <ToastContainer />

      <h1 className="text-2xl font-semibold mb-6">Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Employee Card Section */}
          <div className="col-span-1">
            <div className="mt-20 rounded-lg p-6 flex items-center justify-center h-40 w-full">
              {formData.employee_card ? (
                <div className="mb-4 w-full">
                  <img
                    src={
                      typeof formData.employee_card === "string"
                        ? formData.employee_card // URL from backend
                        : URL.createObjectURL(formData.employee_card) // File preview
                    }
                    alt="Employee Card"
                    className="w-full h-auto object-contain"
                  />
                  <p className="text-gray-500 mt-2 text-center">
                    Current Employee Card
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  No Employee Card uploaded
                </p>
              )}
              <input
                type="file"
                id="employee_card"
                name="employee_card"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "Enter name" },
              { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
              { label: "Contact", name: "contact", type: "text", placeholder: "Enter contact" },
              { label: "Location", name: "location", type: "text", placeholder: "Enter location" },
              { label: "Joining Date", name: "joining_date", type: "date" },
              { label: "CNIC", name: "cnic", type: "text", placeholder: "Enter CNIC" },
              { label: "Designation", name: "Designation", type: "text", placeholder: "Enter designation" },
              { label: "Department", name: "department", type: "text", placeholder: "Enter department" },
            ].map((field, idx) => (
              <div key={idx}>
                <label htmlFor={field.name} className="block text-sm font-semibold mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="rounded-full px-6 py-4 w-full bg-gray-100"
                />
              </div>
            ))}
            <div>
              <label htmlFor="employment_type" className="block text-sm font-semibold mb-2">
                Employment Type
              </label>
              <select
                name="employment_type"
                id="employment_type"
                value={formData.employment_type || ""}
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              >
                <option value="" disabled>
                  Select Employment Type
                </option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Adhoc">Adhoc</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-8 bg-orange-500 text-white font-semibold py-5 w-full sm:w-72 rounded-full hover:bg-orange-600 mx-auto block"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;
