import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import Profile from "../../../img/profile.png";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { PiArrowCircleUpLight } from "react-icons/pi";
import Loader from "./Loader";
import { Link } from "react-router-dom"; 
// import Link from "react-csv/components/Link";
const ToggleSwitch = ({ isEnabled, onToggle }) => (
  <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle switch">
    <input type="checkbox" className="sr-only" checked={isEnabled} onChange={onToggle} />
    <div
      className={`w-10 h-6 bg-gray-200 rounded-full relative transition-colors ${
        isEnabled ? "bg-orange-500" : ""
      }`}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          isEnabled ? "transform translate-x-4" : ""
        }`}
      ></span>
    </div>
  </label>
);

export function Notifications() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true); // State for loader

  useEffect(() => {
    const userId = localStorage.getItem("user_id"); // Retrieve user_id from localStorage

    axios
      .get(`/api/organization/data/${userId}`, { withCredentials: true }) // Pass user_id dynamically
      .then((response) => {
        setAdmin(response.data); // Save admin data
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error fetching organization data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />; // Display loader while loading is true
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8" style={{ width: "100%", padding: 0, margin: 0 }}>
      <div className="w-100 mx-auto bg-white px-6 lg:px-12 py-10">
        {/* Update Notification Section */}
        <div className="flex flex-col lg:flex-row mt-4 p-4 mb-6 rounded-md animate-fadeInLeft">
          <div className="flex items-center w-full lg:w-[70%]">
            {/* Profile Image */}
            <img
              src={admin.profile_image || Profile} // Use fallback if profile image is not available
              alt="Profile"
              className="w-15 h-15 rounded-full mr-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            {/* Profile Text */}
            <div>
              <h2 style={{ fontFamily: "Poppins" }} className="text-lg font-semibold">
                {admin.name || "Admin"}
              </h2>
              <p style={{ fontFamily: "Poppins" }} className="text-sm text-gray-500">
                {admin.designation}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-[30%] p-3 mt-4 bg-white shadow-lg flex justify-between px-4 animate-fadeInRight">
            <div className="space-y-2 p-5 rounded-lg">
              <p style={{ fontFamily: "Poppins" }} className="text-black font-semibold text-lg">
                Update Available!
              </p>
              <p style={{ fontFamily: "Poppins" }} className="text-sm text-gray-500">
                Update to the latest version.
              </p>
            </div>
            <button className="text-orange-500 text-2xl">
              <PiArrowCircleUpLight />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6 animate-fadeInLeft">
            {/* Account Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Account</h3>
              <div className="flex justify-between items-center mb-3">
                <span style={{ fontFamily: "Poppins" }} className="text-sm">
                  Name
                </span>
                <span style={{ fontFamily: "Poppins" }} className="flex items-center text-sm">
                  {admin.name || "Eden Markram"}
                  <button className="ml-2 text-orange-500">
                    <Link to="/dashboard/edit-profile/1">
                    <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                  </button>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontFamily: "Poppins" }} className="text-sm">
                  Email
                </span>
                <span style={{ fontFamily: "Poppins" }} className="text-sm">
                  {admin.email || "example@mail.com"}
                </span>
              </div>
            </div>

            {/* Language Section */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "Poppins" }}>
                Language
              </h3>
              <div className="flex justify-between items-center">
                <span style={{ fontFamily: "Poppins" }} className="text-sm">
                  Current language of App
                </span>
                <span style={{ fontFamily: "Poppins" }} className="flex items-center text-sm">
                  English
                  <button className="ml-2 text-orange-500">
                    <FaPlus />
                  </button>
                </span>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="mt-8">
              <h3 style={{ fontFamily: "Poppins" }} className="text-sm font-semibold text-gray-600 mb-2">
                Privacy
              </h3>
              <div className="flex justify-between items-center mb-3">
                <span style={{ fontFamily: "Poppins" }} className="text-sm">
                  Password protected
                </span>
                <button style={{ fontFamily: "Poppins" }} className="text-orange-500 text-sm">
                  Change
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontFamily: "Poppins" }} className="text-sm">
                  Two Factor Authentication
                </span>
                <ToggleSwitch
                  isEnabled={isTwoFactorAuthEnabled}
                  onToggle={() => setIsTwoFactorAuthEnabled(!isTwoFactorAuthEnabled)}
                />
              </div>
            </div>

            {/* Remove Account */}
            <div className="mt-8">
              <h3 style={{ fontFamily: "Poppins" }} className="text-sm font-semibold text-gray-600 mb-2">
                Remove Account
              </h3>
              <button style={{ fontFamily: "Poppins" }} className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-sm">
                Remove
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 animate-fadeInRight">
            {/* Theme Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Theme</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm">Customize the App theme</span>
                <ToggleSwitch isEnabled={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
              </div>
            </div>

            {/* Notifications Section */}
            <div className="mt-8">
              <h3 style={{ fontFamily: "Poppins" }} className="text-sm font-semibold text-gray-600 mb-2">
                Notifications
              </h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm">Enable notifications</span>
                <ToggleSwitch
                  isEnabled={isNotificationsEnabled}
                  onToggle={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
                />
              </div>
              <button style={{ fontFamily: "Poppins" }} className="text-orange-500 text-sm">
                Notifications Setting
              </button>
            </div>

            {/* Accessibility Section */}
            <div className="mt-8">
              <h3 style={{ fontFamily: "Poppins" }} className="text-sm font-semibold text-gray-600 mb-2">
                Accessibility
              </h3>
              <div style={{ fontFamily: "Poppins" }} className="flex justify-between items-center">
                <span className="text-sm">Allow manager to approve or reject entries</span>
                <ToggleSwitch isEnabled={true} onToggle={() => {}} />
              </div>
            </div>

            {/* Support and Feedback */}
            <div className="mt-8">
              <h3 style={{ fontFamily: "Poppins" }} className="text-sm font-semibold text-gray-600 mb-2">
                Support and Feedback
              </h3>
              <div className="text-orange-500 space-y-1 text-sm">
                <p style={{ fontFamily: "Poppins" }} className="cursor-pointer">Contact</p>
                <p style={{ fontFamily: "Poppins" }} className="cursor-pointer">Report</p>
                <p style={{ fontFamily: "Poppins" }} className="cursor-pointer">Submit</p>
              </div>
            </div>
          </div>
        </div>

        {/* App Version */}
        <div className="mt-8">
          <span style={{ fontFamily: "Poppins" }} className="text-gray-600 text-sm">App version</span>
          <span style={{ fontFamily: "Poppins" }} className="ml-2 text-gray-800 text-sm font-semibold">
            Version 2.0.13
          </span>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
