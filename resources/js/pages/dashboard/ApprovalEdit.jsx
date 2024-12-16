import React, { useEffect, useState } from "react";
import axios from "axios";

export function ApprovalEdit({ employeeId }) {
  const [employeeData, setEmployeeData] = useState(null);

  // Fetch employee data by ID
  useEffect(() => {
    if (!employeeId) return;

    axios
      .get(`/api/showApproval/${employeeId}`)
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, [employeeId]);

  const handleStatusChange = (status) => {
    if (!employeeData) return;

    // Update employee status in the database
    axios
      .put(`/api/approval/update-status/${employeeData.employee_id}`, {
        status: status,
      })
      .then(() => {
        alert(`Status updated to '${status}'`);
        setEmployeeData({ ...employeeData, status: status });
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  if (!employeeData) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl bg-white mx-auto p-6 rounded-xl shadow-lg">
      <form className="space-y-6">
        {/* Title and Sub-Title */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              value={employeeData.employee_name}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Sub-Title</label>
            <input
              type="text"
              value={employeeData.sub_title || "Optional"}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
        </div>

        {/* Start Time, End Time, Total Hours */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Start Time</label>
            <input
              type="text"
              value={employeeData.start_time}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">End Time</label>
            <input
              type="text"
              value={employeeData.end_time}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Total Hours</label>
            <input
              type="text"
              value={employeeData.working_hours}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            value={employeeData.description}
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
            rows="4"
          ></textarea>
        </div>

        {/* Employee's Comment */}
        <div>
          <label className="block text-gray-700 font-medium">Employee's Comment</label>
          <textarea
            value={employeeData.comments}
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
            rows="3"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={() => handleStatusChange("Approve")}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("Resubmit for Approval")}
            className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-md hover:bg-yellow-500"
          >
            Resubmit for Approval
          </button>
          <span className="text-gray-700 font-medium">
            Current Status: {employeeData.status}
          </span>
        </div>
      </form>
    </div>
  );
}

export default ApprovalEdit;
