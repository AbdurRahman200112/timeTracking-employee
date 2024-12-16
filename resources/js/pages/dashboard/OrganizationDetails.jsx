import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import img from '../../../img/img-3.png';
import img2 from '../../../img/Vector.png';
function OrganizationDetails({ organization, onBack }) {
  return (
    <div className="p-6 rounded-lg w-full">
      {/* Header Section with Background and Logo */}
      <div className="relative rounded-t-lg overflow-hidden w-full">
        <img
          src={img} // Replace with the actual header image URL
          alt="Header Background"
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 flex justify-center items-center mt-20">
          <img
            src={img2} // Replace with the organization logo URL
            alt="Organization Logo"
            className="rounded-full border-4 border-white"
          />
        </div>
      </div>

      {/* Organization Title and Location */}
      <div className="text-center mb-15 p-10 rounded-2xls" style={{ backgroundColor: 'white' }}>
        <h1 style={{ fontFamily: 'Poppins' }} className="text-2xl font-semibold">{organization.company_name || "Solar Bright Energy"}</h1>
        <p style={{ fontFamily: 'Poppins' }} className="text-gray-500">{organization.location || "New York, America"}</p>
      </div>

      <div class="bg-white" style={{ backgroundColor: 'white' }}>
        {/* Information Sections */}
        <div className="mt-6 p-6 rounded-lg shadow-md flex justify-between items-start relative w-full" style={{ backgroundColor: 'white' }}>
          {/* Edit Icon */}
          <PencilSquareIcon className="h-6 w-6 text-gray-500 absolute top-4 right-4 cursor-pointer" />

          {/* Basic Information */}
          <div className="w-1/2 pr-4">
            <div className="p-6 rounded-lg  w-full" style={{ backgroundColor: 'white' }}>
              <h3 className="text-lg mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>Organization Name:</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>{organization.company_name || "Organization Name"}</p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>Location:</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>{organization.location || "Location"}</p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>Contact Information:</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>{organization.contact_email || "Contact Information"}</p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>Organization's Website:</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>{organization.website || "Organization's Website"}</p>
                </div>
              </div>
            </div>
          </div>


          {/* Employees Overview */}
          <div className="w-1/2 pl-4">



            <div className="p-6 rounded-lg  w-full" style={{ backgroundColor: 'white' }}>
              <h3 className="text-lg mb-4">Employee Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>Total Employees:</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>100</p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>Active Users:</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>80</p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>Total Hours Worked:</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>20 Hours</p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>Overtime Hours:</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p style={{ fontFamily: 'Poppins' }}>10 Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="p-6 rounded-lg shadow-md w-full" style={{ backgroundColor: 'white' }}>
          <h3 className="text-lg mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-4 bg-white rounded-lg">
              <p style={{ fontFamily: 'Poppins' }}>Account Manager's Name:</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p style={{ fontFamily: 'Poppins' }}>{organization.account_manager || "Account Manager's Name"}</p>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <p style={{ fontFamily: 'Poppins' }}>Account Manager's Contact:</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p style={{ fontFamily: 'Poppins' }}>{organization.account_manager_contact || "+92 363-1192922"}</p>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <p style={{ fontFamily: 'Poppins' }}>Subscription Plan:</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p style={{ fontFamily: 'Poppins' }}>{organization.subscription_plan || "Subscription Plan"}</p>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <p style={{ fontFamily: 'Poppins' }}>Date of Sign Up:</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p style={{ fontFamily: 'Poppins' }}>{organization.date_signed_up || "20/11/2024"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDetails;
