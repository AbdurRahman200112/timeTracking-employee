import React, { useState, useEffect } from 'react';
import axios from 'axios';
import img from '../../../img/img-3.png';
import img2 from '../../../img/Vector.png';

export default function EditOrganization({ organization, onBack, onSave }) {
  const [formData, setFormData] = useState({
    company_name: organization.company_name || '',
    contact_email: organization.contact_email || '',
    contact_phone: organization.contact_phone || '',
    monthly_plan: organization.monthly_plan || 'Pending',
    manager_name: organization.manager_name || '',
    manager_phone: organization.manager_phone || '',
    website: organization.website || '',
    address: organization.address || '',
    address2: organization.address2 || '',
    state: organization.state || '',
    city: organization.city || '',
    country: organization.country || '',
    zip_code: organization.zip_code || '',
    date_signed_up: organization.date_signed_up || '',
  });

  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    axios
      .get('/api/organizations')
      .then((response) => setOrganizations(response.data))
      .catch((error) => console.error('Error fetching organizations:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios
      .put(`/api/organizations/${organization.id}`, formData)
      .then((response) => {
        console.log(response.data.message);
        onSave(response.data.organization);
      })
      .catch((error) => {
        console.error('Error updating organization:', error);
      });
  };

  return (
    <div className="p-8 rounded-xl w-full">
      <h2 className="text-xl font-semibold mb-6">Organization Information</h2>

      <div className="flex gap-6">
        <div className="mx-auto animate-fadeInLeft" style={{ width: '25%' }}>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <img
              src={img}
              alt="Organization Logo"
              className="w-full rounded-t-lg mb-2 h-32 object-cover"
            />
            <div className="flex flex-col items-center">
              <div className="bg-white p-2 rounded-full -mt-8 z-10">
                <img src={img2} alt="Logo Icon" className="h-10 w-10" />
              </div>
              <p className="text-center font-semibold text-lg mt-2">
                {organization.company_name || 'Organization Name'}
              </p>
              <p className="text-center text-gray-500">
                {organization.address || 'Organization Address'}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-dashed border-2 border-gray-300 p-4 rounded-lg flex flex-col items-center">
            <p className="mb-2 font-medium text-gray-600">License</p>
            <label
              htmlFor="licenseUpload"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-24 border border-gray-300 rounded-lg border-dashed p-4 text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6 mb-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 16v-6a9 9 0 0118 0v6M5 16v6a2 2 0 002 2h10a2 2 0 002-2v-6M10 8h4M8 12h8"
                />
              </svg>
              <span className="font-medium">Browse to upload</span>
              <input type="file" id="licenseUpload" className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 animate-fadeInRight" style={{ width: '75%' }}>
          {[ 
            { name: 'company_name', placeholder: "Organization's Name" },
            { name: 'contact_email', placeholder: 'Contact Email' },
            { name: 'contact_phone', placeholder: 'Contact Phone' },
            { name: 'monthly_plan', placeholder: 'Monthly Plan' },
            { name: 'manager_name', placeholder: "Manager's Name" },
            { name: 'manager_phone', placeholder: "Manager's Phone Number" },
            { name: 'website', placeholder: "Organization's Website" },
            { name: 'address', placeholder: 'Address' },
            { name: 'address2', placeholder: 'Address 2' },
            { name: 'state', placeholder: 'State' },
            { name: 'city', placeholder: 'City' },
            { name: 'country', placeholder: 'Country' },
            { name: 'zip_code', placeholder: 'Zip Code' },
            { name: 'date_signed_up', placeholder: 'Date Signed Up' },
          ].map(({ name, placeholder }) => (
            <input
              key={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="border border-gray-300 p-3 mt-2 rounded-lg"
              style={{
                backgroundColor: '#f4f4f4',
                borderRadius: '50px',
                padding: '20px',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSave}
          className="text-white py-3 px-7 rounded-full"
          style={{ backgroundColor: '#fc8c11' }}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
