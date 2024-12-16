import React, { useState } from "react";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";

export function SignUp() {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactEmail: "",
    phoneNumber: "",
    companyAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(""); // Clear previous errors

    try {
      const response = await fetch("/api/signup-organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationName: formData.organizationName,
          contact_email: formData.contactEmail, // Pass the email field
          phoneNumber: formData.phoneNumber,
          companyAddress: formData.companyAddress,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Show success message
        setFormData({
          organizationName: "",
          contactEmail: "",
          phoneNumber: "",
          companyAddress: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <section className="m-8 flex">
<div 
  className="h-screen hidden lg:block roundex-2xl" 
  style={{ backgroundColor: '#FC8C10', width: '50%' }}
>
  {/* Content here if needed */}
</div>

      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Create an Account</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Please create your profile.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-4">
            <Input
              name="organizationName"
              size="lg"
              placeholder="Organization Name"
              value={formData.organizationName}
              onChange={handleChange}
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="contactEmail"
              type="email"
              size="lg"
              placeholder="Email Address"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="phoneNumber"
              size="lg"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              className="w-full bg-gray-100 px-6 py-5 rounded-full focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              name="companyAddress"
              size="lg"
              placeholder="Company Address"
              value={formData.companyAddress}
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
          {error && <Typography color="red" className="mb-4">{error}</Typography>}
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
          <Button className="mt-6 rounded-full py-5 px-7" fullWidth type="submit" style={{backgroundColor: '#FC8C10', fontFamily: 'Poppins'}}>
            Create Account
          </Button>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
