import React, { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams, useNavigate } from "react-router-dom";

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
    designation: "",
    department: "",
    employment_type: "",
    profile: null,
    employee_card: null,
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({}); // Validation errors

  useEffect(() => {
    console.log("Employee ID:", id); // Print the ID to the console
    axios
      .get(`/api/employeeShow/${id}`)
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneChange = (phone) => {
    setFormData({ ...formData, contact: phone });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) errors.email = "Email is required";
    return errors;
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    try {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        await axios.put(`/api/employee/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Employee updated successfully");
        navigate("/dashboard/employeeDetails");
    } catch (error) {
        console.error("Error updating employee:", error.response?.data || error.message);
    }
};


  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg border" style={{ marginTop: "100px", width: "100%" }}>
      <h1 className="text-2xl font-semibold mb-6">Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile and Employee Card Upload */}
          <div className="col-span-1">
            <label htmlFor="profile" className="block text-sm font-semibold mb-2">
              Upload Profile Picture
            </label>
            <div className="mb-8 border-dashed border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center h-40">
              <input type="file" id="profile" name="profile" onChange={handleChange} />
            </div>
            <label htmlFor="employee_card" className="block text-sm font-semibold mb-2">
              Upload Employee Card
            </label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center h-40">
              <input type="file" id="employee_card" name="employee_card" onChange={handleChange} />
            </div>
          </div>

          {/* Form Fields */}
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-semibold mb-2">
                Phone No.
              </label>
              <PhoneInput
                country={"us"}
                value={formData.contact}
                onChange={handlePhoneChange}
                inputStyle={{
                  width: "100%",
                  border: "none",
                  borderRadius: "999px",
                  backgroundColor: "#f4f4f4",
                  height: "55px",
                  paddingLeft: "15px",
                }}
                buttonStyle={{
                  borderRadius: "999px 0 0 999px",
                  backgroundColor: "#f4f4f4",
                }}
              />
              {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="joining_date" className="block text-sm font-semibold mb-2">
                Joining Date
              </label>
              <input
                type="date"
                name="joining_date"
                id="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="cnic" className="block text-sm font-semibold mb-2">
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                id="cnic"
                value={formData.cnic}
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="designation" className="block text-sm font-semibold mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                id="designation"
                value={formData.designation}
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-semibold mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="employment_type" className="block text-sm font-semibold mb-2">
                Employment Type
              </label>
              <select
                name="employment_type"
                id="employment_type"
                value={formData.employment_type}
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
