import React, { useState, useEffect } from "react";
import axios from "axios";
import ApprovalEdit from "./ApprovalEdit"; // Import the ApprovalEdit component
import { FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
export function Approval() {
  const [timeTrackingData, setTimeTrackingData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null); // To track which dropdown is open
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null); // To track the selected employee for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for Disapproval
  const [comment, setComment] = useState(""); // Comment for Disapproval
  const [loading, setLoading] = useState(true); // State for loader
  // Fetch data from the API when the component loads
  useEffect(() => {
    fetchTimeTrackingData();
  }, []);

  const fetchTimeTrackingData = () => {
    axios
      .get("/api/approval")
      .then((response) => {
        setTimeTrackingData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error fetching time tracking data.");
      });
  };

  // Handle opening the edit view
  const handleEdit = (employeeId) => {
    setSelectedEmployeeId(employeeId); // Set the employee ID for editing
  };

  // Handle disapproval logic (open the modal)
  const handleDisapproval = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setIsModalOpen(true); // Open the modal
  };

  // Handle resubmission logic
  const handleResubmit = (employeeId) => {
    axios
      .post(`/api/approval/resubmit/${employeeId}`)
      .then((response) => {
        toast.success(response.data.message || "Resubmitted for approval successfully.");
        fetchTimeTrackingData(); // Refresh the data
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error resubmitting for approval.");
        console.error("Error resubmitting for approval:", error);
      });
  };

  // Submit the disapproval with a comment
  const handleSubmitDisapproval = () => {
    if (!selectedEmployeeId || !comment.trim()) {
      toast.warn("Please provide a comment for disapproval.");
      return;
    }
  
    axios
      .post(`/api/approval/disapprove/${selectedEmployeeId}`, {
        status: "Disapprove",
        comment: comment, // Include the comment for the backend
      })
      .then((response) => {
        toast.success(response.data.message || "Status updated successfully.");
        setIsModalOpen(false); // Close the modal
        setComment(""); // Reset the comment
        setSelectedEmployeeId(null); // Reset the selected employee ID to prevent redirection
        fetchTimeTrackingData(); // Refresh the data
      })
      .catch((error) => {
        toast.error("Error updating status.");
        console.error("Error updating status:", error);
      });
  };
  

  // Render the ApprovalEdit component if an employee is being edited
  if (selectedEmployeeId && !isModalOpen) {
    return <ApprovalEdit employeeId={selectedEmployeeId} />;
  }
  
  if (loading) {
    return <Loader />; // Display loader while the form submission is processing
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-semibold mb-4">Approvals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500">
              <th className="px-6 py-3" style={{ fontFamily: "Poppins" }}>
                Employee
              </th>
              <th className="px-6 py-3" style={{ fontFamily: "Poppins" }}>
                Entry Date
              </th>
              <th className="px-6 py-3" style={{ fontFamily: "Poppins" }}>
                Start Time
              </th>
              <th className="px-6 py-3" style={{ fontFamily: "Poppins" }}>
                End Time
              </th>
              <th className="px-6 py-3" style={{ fontFamily: "Poppins" }}>
                Total Hours
              </th>
              <th className="px-6 py-3" style={{ fontFamily: "Poppins" }}>
                Status
              </th>
              <th className="px-6 py-3" style={{ fontFamily: "Poppins" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {timeTrackingData.map((entry, index) => (
              <tr
                key={index}
                className={`text-md ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-6 py-4">{entry.employee_name}</td>
                <td className="px-6 py-4">{entry.entry_date}</td>
                <td className="px-6 py-4">{entry.start_time}</td>
                <td className="px-6 py-4">{entry.end_time}</td>
                <td className="px-6 py-4">{entry.working_hours}</td>
                <td className="px-6 py-4">{entry.status}</td>
                <td className="px-6 py-4 relative">
                  {activeDropdown === index && (
                    <div className="bg-white shadow-xl absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50">
                      <ul className="py-2">
                        <li
                          style={{ fontFamily: "Poppins" }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleEdit(entry.employee_id); // Call handleEdit to render ApprovalEdit
                            setActiveDropdown(null);
                          }}
                        >
                          Approve
                        </li>
                        <li
                          style={{ fontFamily: "Poppins" }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleResubmit(entry.employee_id); // Call handleResubmit
                            setActiveDropdown(null);
                          }}
                        >
                          Resubmit for Approval
                        </li>
                        <li
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleDisapproval(entry.employee_id); // Open the disapproval modal
                            setActiveDropdown(null);
                          }}
                        >
                          Disapprove
                        </li>
                      </ul>
                    </div>
                  )}
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() =>
                      setActiveDropdown((prev) => (prev === index ? null : index))
                    }
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Disapproval */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Comment for Disapproval</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-500"
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDisapproval}
                className="px-4 py-2 text-white bg-orange-500 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Approval;
