import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Typography } from "@material-tailwind/react";

export function VerifyCode() {
  const [code, setCode] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("user_id");

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-code", {
        user_id: userId,
        code,
      });
      const token = response.data.token;

      // Log in the user
      login(token);

      // Redirect to the dashboard
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Invalid verification code");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <Typography variant="h2" className="text-3xl font-bold text-center mb-6">
          Enter Verification Code
        </Typography>
        <form onSubmit={handleVerification} className="space-y-6">
          <div>
            <Input
              size="lg"
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="!bg-gray-100 !border-0 rounded-full px-4 py-3"
            />
          </div>
          <Button
            type="submit"
            fullWidth
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-full"
          >
            Verify Code
          </Button>
        </form>
      </div>
    </div>
  );
}

export default VerifyCode;
