import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

export function AddEmployee() {
  const [loading, setLoading] = useState(false); // Loader state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employment_type: "",
    break_type: "",
    break_duration: "",
    contact: "",
    location: "",
    joining_date: "",
    cnic: "",
    designation: "",
    department: "",
    profile: "",
    employee_card: "",
    additional_file: "",
    additional_expiry_date: "",
    additional_description: "",
  });

  const [profileFileName, setProfileFileName] = useState(""); // State for Profile Picture
  const [employeeCardFileName, setEmployeeCardFileName] = useState(""); // State for Employee Card
  const [additionalInfo, setAdditionalInfo] = useState(false); // Checkbox state

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      // Show the file name for respective upload fields
      if (name === "profile") setProfileFileName(file.name);
      if (name === "employee_card") setEmployeeCardFileName(file.name);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneChange = (phone) => {
    setFormData({ ...formData, contact: phone });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("/api/add-employee", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      setFormData({
        name: "",
        email: "",
        contact: "",
        location: "",
        joining_date: "",
        cnic: "",
        designation: "",
        department: "",
        employment_type: "",
        profile: "",
        employee_card: "",
        additional_file: "",
        additional_expiry_date: "",
        additional_description: "",
      });
      setProfileFileName("");
      setEmployeeCardFileName("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding employee. Please try again."
      );
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8" style={{ width: "100%", padding: 0, margin: 0 }}>
      <div className="w-100 mx-auto bg-white px-6 lg:px-12 py-10">
        <ToastContainer />
        <h1 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'Poppins' }}>Add</h1>
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <ClipLoader color="#fb9102" size={60} speedMultiplier={1.5} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <label
                  htmlFor="profile"
                  className="block text-sm font-semibold mb-2"
                  style={{ fontFamily: "Poppins" }}
                >
                  Upload Profile Picture (JPG, PNG)
                </label>
                <div className="mb-8 border-dashed border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center h-40 relative">
                  <input
                    type="file"
                    id="profile"
                    name="profile"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span
                    className="text-center text-sm text-gray-600"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {profileFileName || "Choose a file"}
                  </span>
                </div>

                <label
                  htmlFor="employee_card"
                  className="block text-sm font-semibold mb-2"
                  style={{ fontFamily: "Poppins" }}
                >
                  Upload Employee Card (JPG, PNG)
                </label>
                <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center h-40 relative">
                  <input
                    type="file"
                    id="employee_card"
                    name="employee_card"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span
                    className="text-center text-sm text-gray-600"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {employeeCardFileName || "Choose a file"}
                  </span>
                </div>
              </div>

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
                    value={formData.name}
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
                    value={formData.email}
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
                    enableAreaCodes={false}
                    disableDropdown={false}
                    countryCodeEditable={true}
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    inputStyle={{
                      width: "100%",
                      border: "none",
                      borderRadius: "999px",
                      backgroundColor: "#f4f4f4",
                      height: "55px",
                      fontSize: "16px",
                    }}
                    buttonStyle={{
                      borderRadius: "999px 0 0 999px",
                      backgroundColor: "#f4f4f4",
                      border: "1px solid #ccc",
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
                    value={formData.location}
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
                    Joining Date
                  </label>
                  <input
                    type="date"
                    name="joining_date"
                    id="joining_date"
                    value={formData.joining_date}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]} // Restricts to today's date
                    className="rounded-full px-6 py-4 w-full bg-gray-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="National ID"
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Poppins" }}
                  >
                    National ID
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    id="cnic"
                    placeholder="National ID"
                    value={formData.cnic}
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
                    value={formData.designation}
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
                    value={formData.department}
                    onChange={handleChange}
                    className="rounded-full px-6 py-4 w-full bg-gray-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="employment_type"
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Poppins" }}
                  >
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
                <div>
                  <label
                    htmlFor="employment_type"
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Break Type
                  </label>
                  <select
                    name="break_type"
                    id="break_type"
                    value={formData.break_type}
                    onChange={handleChange}
                    className="rounded-full px-6 py-4 w-full bg-gray-100"
                  >
                    <option value="" disabled>
                      Select Break Type
                    </option>
                    <option value="Self Paid">Self Paid</option>
                    <option value="Paid by Organization">Paid by Organization</option>
                  </select>
                </div>
                <div>
                  {(formData.break_type === "Paid by Organization" || formData.break_type === "Self Paid") && (
                    <div>
                      <label
                        htmlFor="break_duration"
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "Poppins" }}
                      >
                        Break Duration
                      </label>
                      <input
                        type="number"
                        name="break_duration"
                        id="break_duration"
                        value={formData.break_duration}
                        onChange={handleChange}
                        min="1" // Minimum value
                        max="120" // Maximum value, adjust as needed
                        step="1" // Increment by 1 minute
                        className="rounded-full px-6 py-4 w-full bg-gray-100 border border-gray-300"
                        placeholder="Enter minutes (e.g., 5, 15, 30)"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={additionalInfo}
                  onChange={() => setAdditionalInfo(!additionalInfo)}
                  className="form-checkbox h-5 w-5 text-orange-500"
                />
                <span className="ml-2 text-sm" style={{ fontFamily: "Poppins" }}>
                  Do you want to add more information?
                </span>
              </label>
            </div>

            {additionalInfo && (
              <div className="mt-6 grid grid-cols-1 gap-6">
                <div className="col-span-1">
                  <label
                    htmlFor="additional_file"
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Upload Additional File (PDF)
                  </label>
                  <input
                    type="file"
                    name="additional_file"
                    id="additional_file"
                    onChange={handleChange}
                    className="rounded-full px-6 py-4 w-full bg-gray-100"
                  />

                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="additional_expiry_date"
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Expiry Date of the National ID
                  </label>
                  <input
                    type="date"
                    name="additional_expiry_date"
                    id="additional_expiry_date"
                    value={formData.additional_expiry_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]} // Restricts to future and current dates
                    className="rounded-full px-6 py-4 w-full bg-gray-100"
                  />

                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="additional_description"
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Description
                  </label>
                  <textarea
                    name="additional_description"
                    id="additional_description"
                    placeholder="Add a description..."
                    value={formData.additional_description}
                    onChange={handleChange}
                    className="rounded-lg px-8 py-6 w-full bg-gray-100 border border-gray-300"
                  ></textarea>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-8 bg-orange-500 text-white font-semibold py-5 w-full sm:w-72 rounded-full hover:bg-orange-600 mx-auto block"
              style={{ fontFamily: "Poppins" }}
            >
              Add New
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddEmployee;
