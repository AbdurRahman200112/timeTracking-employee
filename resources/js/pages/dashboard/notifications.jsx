import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import Profile from "../../../img/profile.png";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { PiArrowCircleUpLight } from "react-icons/pi";
import Loader from "./Loader";
const ToggleSwitch = ({ isEnabled, onToggle }) => (
  <label
    className="relative inline-flex items-center cursor-pointer"
    aria-label="Toggle switch"
  >
    <input
      type="checkbox"
      className="sr-only"
      checked={isEnabled}
      onChange={onToggle}
    />
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
    axios
      .get("/api/admins/6")
      .then((response) => {
        setAdmin(response.data);
        setLoading(false)
      })
      .catch((error) =>
        console.error("There was an error fetching the data:", error)
      );
  }, []);
  if (loading) {
    return <Loader />; // Display loader while loading is true
  }
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md text-gray-800 mt-10">
      {/* Update Notification Section */}
      <div className="flex flex-col lg:flex-row mt-4 p-4 mb-6 rounded-md animate-fadeInLeft">
        <div className="flex items-center w-full lg:w-[70%]">
          {/* Profile Image */}
          <img
            src={Profile}
            alt="Profile"
            className="w-15 h-15 rounded-full mr-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
          {/* Profile Text */}
          <div>
            <h2 className="text-lg font-semibold">{admin.company_name || "Admin"}</h2>
            <p className="text-sm text-gray-500">Organization</p>
          </div>
        </div>

        <div className="w-full lg:w-[30%] p-3 mt-4 bg-white shadow-lg flex justify-between px-4 animate-fadeInRight">
          <div className="space-y-2 p-5 rounded-lg">
            <p className="text-black font-semibold text-lg">Update Available!</p>
            <p className="text-sm text-gray-500">
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
              <span className="text-sm">Name</span>
              <span className="flex items-center text-sm">
                {admin.company_name|| "Eden Markram"}
                <button className="ml-2 text-orange-500">
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Email</span>
              <span className="text-sm">
                {admin.contact_email || "example@mail.com"}
              </span>
            </div>
          </div>

          {/* Language Section */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Language</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm">Current language of App</span>
              <span className="flex items-center text-sm">
                English
                <button className="ml-2 text-orange-500">
                  <FaPlus />
                </button>
              </span>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Privacy</h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm">Password protected</span>
              <button className="text-orange-500 text-sm">Change</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Two Factor Authentication</span>
              <ToggleSwitch
                isEnabled={isTwoFactorAuthEnabled}
                onToggle={() =>
                  setIsTwoFactorAuthEnabled(!isTwoFactorAuthEnabled)
                }
              />
            </div>
          </div>

          {/* Remove Account */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Remove Account
            </h3>
            <button className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-sm">
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
              <ToggleSwitch
                isEnabled={isDarkTheme}
                onToggle={() => setIsDarkTheme(!isDarkTheme)}
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Notifications
            </h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm">Enable notifications</span>
              <ToggleSwitch
                isEnabled={isNotificationsEnabled}
                onToggle={() =>
                  setIsNotificationsEnabled(!isNotificationsEnabled)
                }
              />
            </div>
            <button className="text-orange-500 text-sm">
              Notifications Setting
            </button>
          </div>

          {/* Accessibility Section */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Accessibility
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-sm">
                Allow manager to approve or reject entries
              </span>
              <ToggleSwitch isEnabled={true} onToggle={() => {}} />
            </div>
          </div>

          {/* Support and Feedback */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Support and Feedback
            </h3>
            <div className="text-orange-500 space-y-1 text-sm">
              <p className="cursor-pointer">Contact</p>
              <p className="cursor-pointer">Report</p>
              <p className="cursor-pointer">Submit</p>
            </div>
          </div>
        </div>
      </div>

      {/* App Version */}
      <div className="mt-8">
        <span className="text-gray-600 text-sm">App version</span>
        <span className="ml-2 text-gray-800 text-sm font-semibold">
          Version 2.0.13
        </span>
      </div>
    </div>
  );
}

export default Notifications;
