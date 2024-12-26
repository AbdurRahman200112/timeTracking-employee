import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileImage from "../../../img/profile.png"; // Default profile image

export function EditProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    company_name: "",
    contact_email: "",
    contact_phone: "",
    company_address: "",
    profile: "", // Profile image URL
  });
  const [profileImage, setProfileImage] = useState(null); // Profile image state
  const [imagePreview, setImagePreview] = useState(ProfileImage); // Default preview image

  // Fetch data on load
  useEffect(() => {
    axios
      .get(`/api/admins/${id}`)
      .then((response) => {
        setFormData(response.data); // Fetch the profile data and store it
        setImagePreview(response.data.profile || ProfileImage); // Set the preview image URL
      })
      .catch(() => toast.error("Error fetching organization data."));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes (Profile Image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    // Create a preview of the uploaded image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Update preview to the selected image
    };
    if (file) {
      reader.readAsDataURL(file); // Load file into FileReader
    }
  };

  // Update profile
  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      // Append form data fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // If a new profile image is uploaded, append it to FormData
      if (profileImage) {
        formDataToSend.append("profile", profileImage);
      }

      // Send the update request to the backend
      await axios.post(`/api/admins/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Error updating profile.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer />
      <div className="rounded-lg max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Profile Section */}
        <div className="w-full md:w-1/3 border-r border-gray-200">
          <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{height: '200px'}}>
            {/* Profile image display */}
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Profile Icon"
                className="h-32 w-32 mt-5 rounded-full object-cover mx-auto border-4 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="w-full md:w-2/3 p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map(
              (key) =>
                key !== "profile" && (
                  <div key={key} className="col-span-1">
                    <label className="block text-gray-700 font-semibold mb-2">
                      {key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border rounded-full bg-gray-100"
                    />
                  </div>
                )
            )}
          </div>

          {/* Upload Image Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Profile Image</h3>
            <div className="relative group w-full h-48 border-2 border-dashed border-gray-300 flex justify-center items-center rounded-lg cursor-pointer hover:border-orange-500 transition duration-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer" // Hide the input
              />
              <div className="flex flex-col items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 group-hover:text-orange-500 transition duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m0-7l-9-5m9 5l9-5m-9 5v7"
                    />
                  </svg>
                )}
                <span className="mt-2 text-gray-600 group-hover:text-orange-500 text-sm">
                  Browse to upload
                </span>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleUpdate}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition duration-300"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
