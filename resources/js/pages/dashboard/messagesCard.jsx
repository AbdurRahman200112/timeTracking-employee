import React, { useEffect, useState } from "react";
import axios from "axios";
import Messages from "../../../img/messages.png";
import { IoMailOutline } from "react-icons/io5";

export function MessagesCard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent employees from the API
  useEffect(() => {
    const fetchRecentEmployees = async () => {
      try {
        const response = await axios.get("/api/recent-employees");
        // Transform data to display relevant messages
        const transformedMessages = response.data.map((employee) => ({
          id: employee.id,
          message: `New Employee Created: ${employee.name}`,
          created_at: employee.created_at,
        }));
        setMessages(transformedMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recent employees:", error);
        setLoading(false);
      }
    };

    fetchRecentEmployees();
  }, []);

  // Format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateString));
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading messages...</p>;
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      <div className="flex flex-col gap-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="w-full border border-gray-300 rounded-xl p-10 shadow-md bg-white flex items-center justify-between"
            >
              {/* Left: Circle with Icon and Text */}
              <div className="flex items-center">
                <div
                  className="w-14 h-14 rounded-full mr-4"
                  style={{
                    backgroundColor: "#fff2d4",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={Messages} alt="Message Icon" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    {msg.message}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(msg.created_at)}
                  </p>
                </div>
              </div>

              {/* Right: Mail Icon */}
              <IoMailOutline className="text-3xl" style={{ color: "#161616" }} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No new employees added in the past week.</p>
        )}
      </div>
    </div>
  );
}

export default MessagesCard;
