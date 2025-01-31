import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Rectange from "../../../img/Rectangle.png";
import Profile from "../../../img/profile.png";
import Loader from "./Loader";
export function Tables() {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch organization data
  useEffect(() => {
    const userId = localStorage.getItem('user_id'); // Retrieve user_id from localStorage

    axios
      .get(`/api/organization/data/${userId}`, { withCredentials: true }) // Pass user_id dynamically
      .then((response) => {
        setOrganization(response.data); // Save organization data
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error fetching organization data:", error);
        setLoading(false);
      });
  }, []);


  const handleEdit = () => {
    if (organization && organization.id) {
      navigate(`/dashboard/edit-profile/${organization.id}`);
    }
  };
  if (loading) {
    return <Loader />; // Display loader while loading is true
  }

  return (
    <div className="min-h-screen bg-white">
      {loading ? (
        <div style={{ fontFamily: 'Poppins' }} className="text-center mt-20 text-lg font-semibold">Loading...</div>
      ) : !organization ? (
        <div style={{ fontFamily: 'Poppins' }} className="text-center mt-20 text-lg font-semibold">Organization not found.</div>
      ) : (
        <div className="profile-container w-full p-4 md:p-10 flex flex-col md:flex-row items-start justify-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="rounded-lg mb-4 pb-8 shadow-md bg-white w-full md:w-1/4">
            <img
              src={Rectange}
              alt="Organization Logo"
              className="w-full rounded-t-lg mb-2 h-32 object-cover"
            />
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full -mt-8 z-10">
                <img
                  // src={organization.profile || Profile}
                  src={Profile}
                  alt="Profile Icon"
                  className="h-14 w-14 rounded-full"
                />

              </div>
              <p style={{ fontFamily: 'Poppins' }} className="text-center font-semibold text-base md:text-lg mt-2">
                {organization.name || "Employee Name"}
              </p>
            </div>
          </div>

          <div className="profile-details bg-white rounded-lg p-6 md:p-10 shadow-md w-full md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ fontFamily: 'Poppins' }} className="block font-semibold text-gray-600">Name</label>
                <p style={{ fontFamily: 'Poppins' }} className="mt-1">{organization.name}</p>
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins' }} className="block font-semibold text-gray-600">Email</label>
                <p style={{ fontFamily: 'Poppins' }}
                  className="mt-1">{organization.email}</p>
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins' }} className="block font-semibold text-gray-600">Phone Number</label>
                <p style={{ fontFamily: 'Poppins' }} className="mt-1">{organization.contact}</p>
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins' }} className="block font-semibold text-gray-600">Designation</label>
                <p style={{ fontFamily: 'Poppins' }} className="mt-1">{organization.designation || 'Developer'}</p>
              </div>
            </div>

            <div className="text-right mt-4">
              <button
                className="text-white px-7 py-5 rounded-full bg-orange-500 hover:bg-orange-600 transition"
                style={{ fontFamily: 'Poppins' }}
                onClick={handleEdit}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tables;
