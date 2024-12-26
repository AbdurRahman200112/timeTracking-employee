import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.error("Failed to fetch employee data.");
      });
  }, [employeeId]);

  const handleStatusChange = (status) => {
    if (!employeeData) return;

    axios
      .put(`/api/approval/update-status/${employeeData.employee_id}`, {
        status: status,
      })
      .then(() => {
        toast.success(`Status updated to '${status}' successfully!`);
        setEmployeeData({ ...employeeData, status: status }); // Update local state
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        toast.error("Failed to update status. Please try again.");
      });
  };

  const handleCommentChange = (e) => {
    if (!employeeData) return;
    setEmployeeData({ ...employeeData, comments: e.target.value });
  };

  const handleSaveComment = () => {
    if (!employeeData || !employeeData.comments) return;

    axios
      .put(`/api/approval/update-comment/${employeeData.employee_id}`, {
        comments: employeeData.comments,
      })
      .then(() => {
        toast.success("Comment saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving comment:", error);
        toast.error("Failed to save comment.");
      });
  };

  if (!employeeData) return <div>Loading...</div>;

  return (
    <div className="max-w-8xl bg-white mx-auto p-8 rounded-2xl shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <form className="space-y-6">
        {/* Title and Sub-Title */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              value={employeeData.employee_name}
              className="w-full px-6 py-5 border rounded-full bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Sub-Title</label>
            <input
              type="text"
              value={employeeData.sub_title || "Optional"}
              className="w-full px-6 py-5 border rounded-full bg-gray-100"
              readOnly
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
              className="w-full px-6 py-5 border rounded-full bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">End Time</label>
            <input
              type="text"
              value={employeeData.end_time}
              className="w-full px-6 py-5 border rounded-full bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Total Hours</label>
            <input
              type="text"
              value={employeeData.working_hours}
              className="w-full px-6 py-5 border rounded-full bg-gray-100"
              readOnly
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            value={employeeData.description}
            className="w-full px-6 py-5 border rounded-full bg-gray-100"
            rows="4"
            readOnly
          ></textarea>
        </div>

        {/* Employee's Comment */}
        <div>
          <label className="block text-gray-700 font-medium">Employee's Comment</label>
          <textarea
            value={employeeData.comments}
            onChange={handleCommentChange}
            className="w-full px-6 py-5 border rounded-full bg-gray-100"
            rows="3"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={() => handleStatusChange("Approve")}
            className="px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("Resubmit for Approval")}
            className="px-6 py-4 bg-yellow-400 text-gray-800 rounded-full hover:bg-yellow-500"
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
