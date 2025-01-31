import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

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
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Grid Layout for Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        
        {/* Tasks Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="70 100" />
            </svg>
            <span className="absolute text-xl font-bold">20</span>
          </div>
          <div className="flex gap-3 text-sm mt-3">
            <span className="text-orange-500">● Pending</span>
            <span className="text-gray-500">● Completed</span>
          </div>
        </div>

        {/* Create Task Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Create Task</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Upload Section */}
            <label className="border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center w-full md:w-1/2 h-32 cursor-pointer">
              <IoCloudUploadOutline className="w-12 h-12 text-gray-400" />
              <p className="text-gray-500 text-center text-sm">
                {selectedFile ? selectedFile.name : "Upload Documents"}
              </p>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>

            {/* Create Button Section */}
            <div className="flex flex-col items-center md:w-1/2">
              <button className="bg-orange-500 text-white py-2 px-6 rounded-lg w-full">
                Create
              </button>
              <p className="text-gray-400 text-sm mt-2 text-center">
                Supported formats: PDF, JPG, JPEG, WEBP, PNG
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Table */}
      <div className="mt-6 w-full max-w-5xl">
        <h2 className="text-lg font-semibold mb-4">Recent</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Entry Time</th>
                  <th className="p-3 text-left">End Time</th>
                  <th className="p-3 text-left">Break Time</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasksData.map((task, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{task.date}</td>
                    <td className="p-3">{task.entryTime}</td>
                    <td className="p-3">{task.endTime}</td>
                    <td className="p-3">{task.breakTime}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          task.status === "Approved"
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

    </div>
  );
};

export default LiveMetrics;
