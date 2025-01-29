import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Checkbox } from "@material-tailwind/react";
import img from "../../../img/logo.png";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import backgroundImage from "../../../img/bg-2.jpg";
import { Link } from "react-router-dom";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Countdown timer logic
  useEffect(() => {
    let countdown;
    if (isCodeSent && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [isCodeSent, timer]);

  // Handle login and send OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user_id } = response.data;
        const now = new Date().getTime();
        const expiryTime = now + 60 * 100000; // 1 minute from current time
        localStorage.setItem("token", token);
        localStorage.setItem("token_expiry", expiryTime);
        localStorage.setItem("user_id", user_id);

        setIsCodeSent(true);
        setTimer(60);
        setSuccess("Verification code sent. Please check your email.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    if (!/^\d*$/.test(value)) return;
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Verify OTP
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (timer === 0) {
      alert("Verification code expired. Please request a new code.");
      return;
    }

    try {
      const verificationCode = otp.join("");
      const response = await axios.post("/api/verify-code", {
        code: verificationCode,
        email,
      });

      if (response.status === 200) {
        navigate("/dashboard/home");
      } else {
        setError(response.data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setError("Invalid verification code.");
    }
  };

  // Format timer for display
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex min-h-screen">
      <div
        className={`w-full ${
          isCodeSent ? "lg:w-full" : "lg:w-[60%]"
        } flex flex-col items-center justify-center px-10`}
        style={isCodeSent ? { backgroundImage: `url(${backgroundImage})` } : {}}
      >
        <div className="w-full max-w-md flex items-center justify-center flex-col">
          <Typography variant="h2" className="text-3xl text-center mb-2">
            Account Log In
          </Typography>
          <Typography
            variant="paragraph"
            style={{ color: "#FC8C10" }}
            className="text-center text-lg mb-6"
          >
            {isCodeSent
              ? `Enter the 6-digit code sent to your email.`
              : "Log in to your account"}
          </Typography>

          <form className="space-y-6 w-full">
            {!isCodeSent ? (
              <>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 font-medium"
                  >
                    Email
                  </Typography>
                  <input
                    type="email"
                    placeholder="name@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 font-medium"
                  >
                    Password
                  </Typography>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 mt-6"
                  >
                    {showPassword ? (
                      <RxEyeOpen className="h-7 w-7" />
                    ) : (
                      <RxEyeClosed className="h-7 w-7" />
                    )}
                  </button>
                </div>
                {error && (
                  <Typography
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </Typography>
                )}
                <div className="flex items-center justify-between">
                  <Checkbox
                    label={
                      <Typography variant="small" color="gray">
                        Remember Me
                      </Typography>
                    }
                  />
                  <Link to="/auth/forgotPassword">
                    <button type="button" className="text-sm hover:underline">
                      Forgot Password?
                    </button>
                  </Link>
                </div>
                <p style={{ textAlign: "center" }}>
                  Don't have an account?{" "}
                  <Link to="/auth/sign-up">
                    <span style={{ color: "#FC8C10" }}>Sign Up</span>
                  </Link>
                </p>
              </>
            ) : (
              <div className="flex justify-center space-x-2 mt-4">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-12 h-12 text-center text-lg font-medium bg-gray-100 rounded-lg focus:outline-none"
                  />
                ))}
              </div>
            )}
            {isCodeSent && (
              <div className="text-center text-sm mt-3">
                {/* <span>Resend code in: {formatTime()}</span> */}
              </div>
            )}
            {!isCodeSent ? (
              <Button
                onClick={handleLogin}
                fullWidth
                disabled={loading}
                className="hover:bg-orange-700 text-white font-medium mt-5 py-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fc8c11" }}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
                ) : null}
                {loading ? "Processing..." : "Log In"}
              </Button>
            ) : (
              <Button
                onClick={handleVerifyCode}
                fullWidth
                className="hover:bg-orange-700 text-white font-medium mt-5 py-5 rounded-full"
                style={{ backgroundColor: "#fc8c11" }}
              >
                Verify Code
              </Button>
            )}
          </form>
        </div>
      </div>

      {!isCodeSent && (
        <div
          className="hidden lg:flex w-[40%] items-center justify-center text-white p-12"
          style={{ backgroundColor: "#FC8C10", position: "relative" }}
        >
          <div
            className="absolute top-12 right-0 bg-white p-2 flex"
            style={{
              width: "60%",
              padding: "40px",
              borderTopLeftRadius: "50px",
              borderBottomLeftRadius: "50px",
            }}
          >
            <img src={img} alt="Logo" className="w-60" />
          </div>
        </div>
      )}
    </div>
  );
}
