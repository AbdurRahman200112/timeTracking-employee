import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rectange from '../../../img/Rectangle.png';
import Profile from '../../../img/profile.png';

export function EditProfile({ admin, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    dob: '',
    phone: '',
    departments: '',
    designation: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  useEffect(() => {
    setFormData(admin);
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSave = () => {
    axios.put(`/api/admins/${admin.id}`, formData)
      .then(response => {
        onSave(response.data);
        onClose();
      })
      .catch(error => console.error("There was an error updating the profile:", error));
  };

  return (
    <div className="edit-profile-container rounded-lg p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="flex space-x-8">
        {/* Left Column: Profile Image and Upload Section */}
        <div className="w-1/4 animate-fadeInLeft">
        <div className="p-4 rounded-lg mb-4 shadow-md bg-white w-full pb-20">
            <img
              src={Rectange}
              alt="Organization Logo"
              className="w-full rounded-t-lg mb-2 h-32 object-cover"
            />
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full -mt-8 z-10">
                <img src={Profile} alt="Logo Icon" className="h-10 w-10" />
              </div>
              <p style={{fontFamily: 'Poppins'}} className="text-center font-semibold text-lg mt-2">{admin.name || 'Admin Name'}</p>
              <p style={{fontFamily: 'Poppins'}} className="text-center text-gray-500">{admin.designation || 'Designation'}</p>
            </div>
          </div>
          {/* File Uploads */}
          <div className="bg-white p-4 rounded-lg mb-4 text-center">
            <p style={{fontFamily: 'Poppins'}} className="font-semibold mb-2">ID Card</p>
            <label className="block border border-dashed border-gray-400 rounded-md py-4 cursor-pointer text-gray-500">
              <input type="file" className="hidden" />
              <span style={{fontFamily: 'Poppins'}}>Browse to upload</span>
            </label>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p style={{fontFamily: 'Poppins'}} className="font-semibold mb-2">Address Proof</p>
            <label className="block border border-dashed border-gray-400 rounded-md py-4 cursor-pointer text-gray-500">
              <input type="file" className="hidden" />
              <span style={{fontFamily: 'Poppins'}}>Browse to upload</span>
            </label>
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="flex-1 animate-fadeInRight">
          <div className="grid grid-cols-2 gap-4">
            {['name', 'employeeId', 'dob', 'phone', 'departments', 'designation', 'address', 'address2', 'city', 'state', 'zip', 'country'].map((field, index) => (
              <div key={index} className={field === 'address' || field === 'address2' ? 'col-span-2' : ''}>
                <label className="block font-semibold text-gray-600 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                  className="input-field mt-1 w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  placeholder=""
                  style={{ backgroundColor: '#f4f4f4', borderRadius: '50px', padding: '20px' }}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
              onClick={handleSave}
              style={{fontFamily: 'Poppins'}}
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
