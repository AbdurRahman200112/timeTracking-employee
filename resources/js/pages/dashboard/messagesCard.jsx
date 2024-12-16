import React, { useEffect, useState } from "react";
import axios from "axios";
import Messages from "../../../img/messages.png"; // Ensure the path is correct
import { IoMailOutline } from "react-icons/io5";

export function MessagesCard() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("thisWeek");

  // Fetch messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/organizations");
        // Transform data to extract messages with a created_at date
        const messages = response.data.map((org) => ({
          id: org.id,
          message: "Organization added successfully!",
          companyName: org.company_name,
          created_at: org.created_at, // Ensure the API provides this field
        }));
        setMessages(messages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Filter messages based on selected filter
  useEffect(() => {
    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfLastWeek = new Date();
    startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
    const endOfLastWeek = new Date(startOfWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);

    let filtered;
    if (filter === "thisWeek") {
      filtered = messages.filter((msg) => {
        const messageDate = new Date(msg.created_at);
        return messageDate >= startOfWeek && messageDate <= now;
      });
    } else if (filter === "lastWeek") {
      filtered = messages.filter((msg) => {
        const messageDate = new Date(msg.created_at);
        return messageDate >= startOfLastWeek && messageDate <= endOfLastWeek;
      });
    }

    setFilteredMessages(filtered);
  }, [filter, messages]);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="custom-select"
          style={{
            backgroundColor: '#fff2d4',
            color: 'black',
            border: 'none',
            padding: '20px 30px', // Adjusted padding to reduce spacing
            borderRadius: '40px',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            position: 'relative',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj48cGF0aCBkPSJNMyAzLjVoNi41bC01IDUtNS01eiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')`, // Inline SVG arrow
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'calc(100% - 10px) center', // Adjusted position for less gap
            backgroundSize: '8px', // Reduced size for the arrow
          }}
        >
          <option value="thisWeek">This Week</option>
          <option value="lastWeek">Last Week</option>
        </select>


      </div>
      <div className="flex flex-col gap-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="w-full border border-gray-300 rounded-xl p-4 shadow-md bg-white flex items-center justify-between"
              style={{ padding: "30px" }}
            >
              {/* Left: Circle with Image and Text */}
              <div className="flex items-center">
                {/* Circle with Icon */}
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
                    {msg.companyName}
                  </h4>
                  <p className="text-gray-600">{msg.message}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(msg.created_at)}
                  </p>
                </div>
              </div>

              {/* Right: Mail Icon */}
              <IoMailOutline
                className="text-3xl"
                style={{ color: "#161616" }}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No messages found for the selected period.</p>
        )}
      </div>
    </div>
  )
}

export default MessagesCard;
