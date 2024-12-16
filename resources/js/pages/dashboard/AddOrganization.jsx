import React, { useState } from 'react';
import axios from 'axios';
import img from '../../../img/img-3.png';
import img2 from '../../../img/Vector.png';
import { useNavigate } from 'react-router-dom';

export function AddOrganization({ organization = {}, onBack, onSave }) {
    const navigate = useNavigate();

    // Initialize form state
    const [formData, setFormData] = useState({
        date_signed_up: '',
        company_name: '',
        contact_email: '',
        password: '',
        contact_phone: '',
        monthly_plan: 'Pending',
        manager_name: '',
        manager_phone: '',
        website: '',
        address: '',
        address2: '',
        state: '',
        city: '',
        country: '',
        zip_code: '',
         // Added password field
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/organizations', formData);
            alert(response.data.message);
            setFormData({
                date_signed_up: '',
                company_name: '',
                contact_email: '',
                password: '',
                contact_phone: '',
                monthly_plan: 'Pending',
                manager_name: '',
                manager_phone: '',
                website: '',
                address: '',
                address2: '',
                state: '',
                city: '',
                country: '',
                zip_code: '',
                password: '', // Reset password field
            });
            navigate('/organizations'); // Redirect after successful submission
        } catch (error) {
            console.error('Error adding organization:', error);
            alert('Failed to add organization');
        }
    };

    return (
        <div className="p-8 rounded-xl w-full">
            <h2 className="text-xl font-semibold mb-6">Organization Information</h2>

            <div className="flex gap-6">
                {/* Organization Info Sidebar */}
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

                {/* Form Section */}
                <div className="grid grid-cols-1 gap-4 animate-fadeInRight" style={{ width: '75%' }}>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700">Date Signed Up</label>
                                <input
                                    type="date"
                                    name="date_signed_up"
                                    value={formData.date_signed_up}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Contact Email</label>
                                <input
                                    type="email"
                                    name="contact_email"
                                    value={formData.contact_email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Contact Phone</label>
                                <input
                                    type="text"
                                    name="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Monthly Plan</label>
                                <select
                                    name="monthly_plan"
                                    value={formData.monthly_plan}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }}                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Manager Name</label>
                                <input
                                    type="text"
                                    name="manager_name"
                                    value={formData.manager_name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Manager Phone</label>
                                <input
                                    type="text"
                                    name="manager_phone"
                                    value={formData.manager_phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Address Line 2</label>
                                <input
                                    type="text"
                                    name="address2"
                                    value={formData.address2}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Zip Code</label>
                                <input
                                    type="text"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 mt-2 rounded-lg"
                                    style={{
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: '50px',
                                        padding: '20px',
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg"
                            style={{ borderRadius: '50px', backgroundColor: '#fc8c11' }}
                        >
                            Submit
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
