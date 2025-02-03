import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

export function Approval() {
  const [timeTrackingData, setTimeTrackingData] = useState([]);
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

  // ✅ Update Only the Specific Tracking ID
  const handleResubmit = (trackingId) => {
    axios
      .put(`/api/approval/resubmit/${trackingId}`)
      .then((response) => {
        toast.success(response.data.message || "Resubmitted successfully.");

        // Update only the specific entry’s status in the state
        setTimeTrackingData((prevData) =>
          prevData.map((entry) =>
            entry.id === trackingId ? { ...entry, status: "Resubmit" } : entry
          )
        );
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error resubmitting.");
        console.error("Error resubmitting:", error);
      });
  };

  // ✅ Filter by Date Range (Last 24 Hours, Last Week, Last Month)
  const filterByDateRange = (entryDate) => {
    if (dateFilter === "all") return true;

    const entryDateTime = new Date(entryDate);
    const now = new Date();

    if (dateFilter === "last_24_hours") {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      return entryDateTime >= last24Hours;
    }
    if (dateFilter === "last_week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return entryDateTime >= lastWeek;
    }
    if (dateFilter === "last_month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return entryDateTime >= lastMonth;
    }
    return true;
  };

  // ✅ Apply Status and Date Filters
  const filteredData = timeTrackingData.filter((entry) => {
    const statusMatch = statusFilter === "all" || entry.status === statusFilter;
    const dateMatch = filterByDateRange(entry.entry_date);
    return statusMatch && dateMatch;
  });

  // ✅ Pagination Logic
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
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              style={{fontFamily: 'Poppins'}}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-2 block w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none"
            >
              <option value="all">All</option>
              <option value="Approve">Approve</option>
              <option value="Disapprove">Disapprove</option>
              <option value="Resubmit">Resubmit</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label style={{fontFamily: 'Poppins'}} htmlFor="dateFilter" className="block text-sm font-medium text-gray-700">
              Filter by Date:
            </label>
            <select
              id="dateFilter"
              value={dateFilter}
              style={{fontFamily: 'Poppins'}}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-2 block w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none"
            >
              <option value="all">All</option>
              <option value="last_24_hours">Last 24 Hours</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr style={{fontFamily: 'Poppins'}} className="bg-gray-100 text-gray-600 text-left text-sm font-semibold">
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
                <tr style={{fontFamily: 'Poppins'}} key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
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
                        entry.status === "Approve" || entry.status === "Resubmit"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                      }`}
                      onClick={() => entry.status !== "Approve" && entry.status !== "Resubmit" && handleResubmit(entry.id)}
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
      </div>
    </div>
  );
}

export default Approval;
