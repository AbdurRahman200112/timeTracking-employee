import React, { useState } from "react";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup-employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setFormData({
          name: "",
          email: "",
          contact: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  
  return (
    <section className="m-8 flex">
      <div
        className="h-screen hidden lg:block rounded-2xl"
        style={{ backgroundColor: "#FC8C10", width: "50%" }}
      ></div>

      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Create an Account
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Please create your profile.
          </Typography>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          <div className="mb-4">
            <Input
              name="name"
              size="lg"
              placeholder="Organization Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="email"
              type="email"
              size="lg"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="contact"
              size="lg"
              placeholder="Phone Number"
              value={formData.contact}
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="password"
              type="password"
              size="lg"
              placeholder="Password"
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="confirmPassword"
              type="password"
              size="lg"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button
            className="mt-6 rounded-full py-5 px-7"
            fullWidth
            type="submit"
            style={{ backgroundColor: "#FC8C10", fontFamily: "Poppins" }}
          >
            Create Account
          </Button>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}

export default SignUp;
