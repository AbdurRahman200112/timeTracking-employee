import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import React from "react";
const tasksData = [
  { date: "04 Sep 2024", entryTime: "8:30", endTime: "19:30", breakTime: "00:40", status: "Approved" },
  { date: "03 Sep 2024", entryTime: "8:30", endTime: "19:30", breakTime: "00:40", status: "Pending" },
  { date: "02 Sep 2024", entryTime: "8:30", endTime: "19:30", breakTime: "00:40", status: "Correction" },
  { date: "01 Sep 2024", entryTime: "8:30", endTime: "19:30", breakTime: "00:40", status: "Approved" },
  { date: "01 Sep 2024", entryTime: "8:30", endTime: "19:30", breakTime: "00:40", status: "Pending" },
  { date: "01 Sep 2024", entryTime: "8:30", endTime: "19:30", breakTime: "00:40", status: "Correction" },
];

export function LiveMetrics() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Tasks Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <div className="relative flex justify-center items-center my-4">
            <div className="relative w-100 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="70 100" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">20</span>
            </div>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-orange-500" style={{fontFamily: 'Poppins'}}>● Pending</span>
            <span className="text-gray-500" style={{fontFamily: 'Poppins'}}>● Completed</span>
          </div>
        </div>

        {/* Create Task Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3" style={{fontFamily: 'Poppins'}}>Create Task</h2>

      {/* Flexbox for Two-Column Layout */}
      <div className="flex items-center justify-center gap-6 h-40">
        {/* Upload Section */}
        <label
          className="border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center w-1/2 h-32 cursor-pointer"
        >
          <IoCloudUploadOutline className="w-16 h-16 text-gray-400" />
          <p className="text-gray-500">
            {selectedFile ? selectedFile.name : "Upload Documents"}
          </p>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>

        {/* Create Button Section */}
        <div className="flex flex-col items-center justify-center w-1/2 h-32">
          <button style={{fontFamily: 'Poppins'}} className="bg-orange-500 text-white py-2 px-6 rounded-lg">
            Create
          </button>
          <p style={{fontFamily: 'Poppins'}} className="text-gray-400 text-sm mt-2 text-center">
            Supported formats: PDF, JPG, JPEG, WEBP, PNG
          </p>
        </div>
      </div>
    </div>

      </div>


      {/* Recent Table */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4" style={{fontFamily: 'Poppins'}}>Recent</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{backgroundColor: '#fcfcfc'}}>
                <th style={{fontFamily: 'Poppins'}} className="p-3 text-left">Date</th>
                <th style={{fontFamily: 'Poppins'}} className="p-3 text-left">Entry Time</th>
                <th style={{fontFamily: 'Poppins'}} className="p-3 text-left">End Time</th>
                <th style={{fontFamily: 'Poppins'}} className="p-3 text-left">Break Time</th>
                <th style={{fontFamily: 'Poppins'}} className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasksData.map((task, index) => (
                <tr key={index} className="border-b">
                  <td style={{fontFamily: 'Poppins'}} className="p-3">{task.date}</td>
                  <td style={{fontFamily: 'Poppins'}} className="p-3">{task.entryTime}</td>
                  <td style={{fontFamily: 'Poppins'}} className="p-3">{task.endTime}</td>
                  <td style={{fontFamily: 'Poppins'}} className="p-3">{task.breakTime}</td>
                  <td style={{fontFamily: 'Poppins'}} className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${task.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;
