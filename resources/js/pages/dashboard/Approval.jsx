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
  const [statusFilter, setStatusFilter] = useState("all"); // Status filter state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 5;

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

  // Apply status filter
  const filteredData = timeTrackingData.filter((entry) => {
    if (statusFilter === "all") return true;
    return entry.status === statusFilter;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Render the ApprovalEdit component if an employee is being edited
  if (selectedEmployeeId && !isModalOpen) {
    return <ApprovalEdit employeeId={selectedEmployeeId} />;
  }

  if (loading) {
    return <Loader />; // Display loader while the form submission is processing
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8" style={{ width: "100%", padding: 0, margin: 0 }}>
      <div className="w-100 mx-auto px-6 lg:px-12 py-10">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 style={{ fontFamily: 'Poppins' }} className="text-xl font-semibold mb-4">Approvals</h2>

        {/* Status Filter */}
        <div className="mb-4">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-2 block w-full px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z' clip-rule='evenodd'/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-right-3 pr-12 hover:bg-gray-50 transition duration-300"
          >
            <option value="all">All</option>
            <option value="Approve">Approve</option>
            <option value="Disapprove">Disapprove</option>
            <option value="Resubmit">Resubmit</option>
          </select>


        </div>

        <div className="overflow-x-auto shadow-xl">
          <table className="min-w-full rounded-lg">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500">
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
              {currentItems.map((entry, index) => (
                <tr
                  key={index}
                  className={`text-md ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4">{entry.entry_date}</td>
                  <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4">{entry.start_time}</td>
                  <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4">{entry.end_time}</td>
                  <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4">{entry.working_hours}</td>
                  <td style={{ fontFamily: 'Poppins' }} className="px-6 py-4">{entry.status}</td>
                  <td className="px-6 py-4 relative">
                    {activeDropdown === index && (
                      <div className="bg-white shadow-xl absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50">
                        <ul className="py-2">
                          {/* <li
                            style={{ fontFamily: "Poppins" }}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleEdit(entry.employee_id); // Call handleEdit to render ApprovalEdit
                              setActiveDropdown(null);
                            }}
                          >
                            Approve
                          </li> */}
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
                          {/* <li
                            style={{ fontFamily: 'Poppins' }}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleDisapproval(entry.employee_id); // Open the disapproval modal
                              setActiveDropdown(null);
                            }}
                          >
                            Disapprove
                          </li> */}
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
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 style={{ fontFamily: 'Poppins' }} className="text-lg font-semibold mb-4">Comment for Disapproval</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-500"
              ></textarea>
              <div className="flex justify-end mt-4">
                <button
                  style={{ fontFamily: 'Poppins' }}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  style={{ fontFamily: 'Poppins' }}
                  onClick={handleSubmitDisapproval}
                  className="px-4 py-2 text-white bg-orange-500 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-end mt-6 space-x-2">
          {generatePageNumbers().map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded-lg ${currentPage === page ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && <span className="px-4">...</span>}
        </div>
      </div>
    </div>
  );
}

export default Approval;
