import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState(null); // Store selected file
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file); // Update the file state
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = signupInfo;

    // Validation: Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      return handleError("All fields are required");
    }

    // Validation: Check if password matches confirmPassword
    if (password !== confirmPassword) {
      return handleError("Passwords do not match");
    }

    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        body: formData, // Send form data
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message || "An error occurred";
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup} encType="multipart/form-data">
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            placeholder="Enter your name..."
            value={signupInfo.name}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={signupInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password..."
            value={signupInfo.password}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password..."
            value={signupInfo.confirmPassword}
          />
        </div>
        <div>
          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange} // Handle file input
          />
        </div>
        <button type="submit">Signup</button>
        <span>
          Already have an account?
          <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
