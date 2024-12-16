import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    joining_date: "",
    cnic: "",
    designation: "",
    department: "",
    employment_type: "", // Added employment_type
    profile: "",
    employee_card: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post("/api/add-employee", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg border" style={{marginTop: '100px' , width: '100%'}}>
      <h1 className="text-2xl font-semibold mb-6">Add Employee</h1>
      <form onSubmit={handleSubmit}>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Upload Fields */}
          <div className="col-span-1">
            <label
              htmlFor="profile"
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "Poppins" }}
            >
              Upload Profile Picture
            </label>
            <div className="mb-8 border-dashed border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center h-40">
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={handleChange}
              />
              <label
                htmlFor="profile_picture"
                className="text-center cursor-pointer text-sm text-gray-600"
                style={{ fontFamily: "Poppins" }}
              >
                Choose a file
              </label>
            </div>

            <label
              htmlFor="employee_card"
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "Poppins" }}
            >
              Upload Employee Card
            </label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center h-40">
              <input
                type="file"
                id="employee_card"
                name="employee_card"
                onChange={handleChange}
              />
              <label
                htmlFor="employee_card"
                className="text-center cursor-pointer text-sm text-gray-600"
                style={{ fontFamily: "Poppins" }}
              >
                Choose a file
              </label>
            </div>
          </div>

          {/* Right Column: Input Fields */}
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
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
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location"
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="joining_date"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="joining_date"
                id="joining_date"
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="cnic"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                id="cnic"
                placeholder="CNIC"
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
                Designation
              </label>
              <input
                type="text"
                name="designation"
                id="designation"
                placeholder="Designation"
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                id="department"
                placeholder="Department"
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="employement_type"
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "Poppins" }}
              >
                Employment Type
              </label>
              <select
                name="employment_type"
                id="employment_type"
                onChange={handleChange}
                className="rounded-full px-6 py-4 w-full bg-gray-100"
              >
                <option value="" disabled selected>
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
          style={{ fontFamily: "Poppins" }}
        >
          Add New
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
