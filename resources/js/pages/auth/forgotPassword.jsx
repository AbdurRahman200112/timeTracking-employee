import React, { useState } from "react";
import axios from "axios";
import backgroundImage from "../../../img/bg-2.jpg"; // Replace with the correct path to your background image

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/forgot-password", { email });
      setMessage(response.data.message); // Show success message
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong"); // Show error message
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="rounded-lg p-8 w-full max-w-md">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter your email, and we will send you a reset link.
          </p>
        </div>
        {message && (
          <p className="text-center text-green-500 mt-4">{message}</p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none focus:ring-0 focus:shadow-none"
              style={{
                border: 'none',
                borderRadius: '50px',
              }} />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-5 rounded-full text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1"
            style={{ fontFamily: 'Poppins', backgroundColor: '#fc8c11', letterSpacing: '2px', fontSize: '14px' }} // Ensure the button width is limited to 80% and centered

          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
