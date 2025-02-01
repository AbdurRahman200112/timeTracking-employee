import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

export function Approval() {
  const [timeTrackingData, setTimeTrackingData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPageButtons = 5;

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

  // ✅ Handle Resubmission & Update Only That Entry
  const handleResubmit = (employeeId) => {
    axios
      .post(`/api/approval/resubmit/${employeeId}`)
      .then((response) => {
        toast.success(response.data.message || "Resubmitted successfully.");

        // **Update status locally instead of fetching again**
        setTimeTrackingData((prevData) =>
          prevData.map((entry) =>
            entry.employee_id === employeeId ? { ...entry, status: "Approve" } : entry
          )
        );
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error resubmitting.");
        console.error("Error resubmitting:", error);
      });
  };

  // **Filter Entries by Status**
  const filteredData = timeTrackingData.filter((entry) => {
    if (statusFilter === "all") return true;
    return entry.status === statusFilter;
  });

  // **Pagination Logic**
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="w-full mx-auto px-4 lg:px-8 py-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="text-xl font-semibold mb-4 text-center lg:text-left" style={{ fontFamily: "Poppins" }}>
          Approvals
        </h2>

        {/* Filters Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-2 block w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none"
            >
              <option value="all">All</option>
              <option value="Approve">Approve</option>
              <option value="Disapprove">Disapprove</option>
              <option value="Resubmit">Resubmit</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left text-sm font-semibold">
                <th className="px-6 py-3">Entry Date</th>
                <th className="px-6 py-3">Start Time</th>
                <th className="px-6 py-3">End Time</th>
                <th className="px-6 py-3">Total Hours</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((entry, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-6 py-4">{entry.entry_date}</td>
                  <td className="px-6 py-4">{entry.start_time}</td>
                  <td className="px-6 py-4">{entry.end_time}</td>
                  <td className="px-6 py-4">{entry.working_hours}</td>
                  <td className={`px-6 py-4 font-bold ${entry.status === "Approve" ? "text-green-600" : "text-red-600"}`}>
                    {entry.status}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className={`px-4 py-2 text-sm flex items-center gap-2 ${
                        entry.status === "Approve"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                      }`}
                      onClick={() => entry.status !== "Approve" && handleResubmit(entry.employee_id)}
                    >
                      <FaEdit className="w-5 h-5 inline-block" />
                      Resubmit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Approval;
