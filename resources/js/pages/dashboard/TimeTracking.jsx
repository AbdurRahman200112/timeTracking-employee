import React, { useState, useEffect } from "react";
import axios from "axios";
import Profiles from "../../../img/icons.png";
import {Link}  from "react-router-dom";
export function TimeTracking() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/time-tracking")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching time tracking data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-100">
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-xl p-6 mb-8 flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center w-full md:w-auto">
                        <img
                            src={Profiles}
                            alt="Employee Avatar"
                            className="rounded-full w-16 h-16 mr-4"
                        />
                        <div>
                            <h2 className="text-lg font-semibold">Brandon Korsgaard</h2>
                            <p className="text-sm text-gray-500">Designer</p>
                            <div className="flex text-sm text-gray-500 mt-1">
                                <span className="mr-4">📞</span>
                                <span>✉️</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center border-2 border-dashed border-black p-4 w-full md:w-auto">
                        <h1 className="text-4xl font-semibold">10 : 00 : 00</h1>
                        <span className="text-sm text-gray-500">Hr's Min Sec</span>
                    </div>
                    <div className="text-right w-full md:w-auto">
                        <p className="text-sm text-gray-500">Over Time</p>
                        <h1 className="text-2xl font-semibold text-red-500">0h:30min</h1>
                    </div>
                    <div className="text-center bg-orange-100 text-orange-600 px-4 py-2 rounded-lg w-full md:w-auto">
                        <p className="text-sm">04</p>
                        <p>September</p>
                    </div>
                </div>

                {/* Weekly Timesheet Section */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Weekly Timesheet</h2>
                        <div className="flex space-x-4 text-sm text-gray-500">
                            <button className="hover:text-black">Month</button>
                            <button className="hover:text-black">Week</button>
                            <button className="hover:text-black">2024</button>
                            <button className="hover:text-black">Export</button>
                        </div>
                    </div>

                    {/* Responsive Table */}
                    <div className="overflow-hidden">
                        {data.map((item, index) => (
                            <Link to="/employeeDetails">
                            <div
                                key={index}
                                className="bg-gray-50 border-b last:border-b-0 p-4 rounded-lg flex flex-col gap-4 md:grid md:grid-cols-5 md:gap-6 items-center mb-4"
                            >
                                <div className="flex items-center gap-4 md:col-span-1">
                                    <img
                                        src={Profiles}
                                        alt="Employee"
                                        className="rounded-full w-10 h-10"
                                    />
                                    <span className="font-medium text-gray-700">
                                        {item.employee_name || "Employee"}
                                    </span>
                                </div>
                                <div className="text-sm md:col-span-1">
                                    <p className="text-gray-600">Entry Date:</p>
                                    <p className="font-medium">{item.entry_date}</p>
                                </div>
                                <div className="text-sm md:col-span-1">
                                    <p className="text-gray-600">Start Time:</p>
                                    <p className="font-medium">{item.start_time}</p>
                                </div>
                                <div className="text-sm md:col-span-1">
                                    <p className="text-gray-600">End Time:</p>
                                    <p className="font-medium">{item.end_time}</p>
                                </div>
                                <div className="text-sm md:col-span-1">
                                    <p className="text-gray-600">Working Hours:</p>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${item.working_hours < "8:00"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-orange-100 text-orange-600"
                                            }`}
                                    >
                                        {item.working_hours}
                                    </span>
                                </div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimeTracking;
