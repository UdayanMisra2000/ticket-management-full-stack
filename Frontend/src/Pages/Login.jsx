import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import logo from "../Images/logo_full.png";
import img1 from "../Images/Login.png";
import { UserContext } from "../UserContext";

function Login() {
  const navigate = useNavigate();
  const { setUserId } = useContext(UserContext);

  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form fields
    if (!email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
      } else {
        // Show success toast
        setUserId(data.user.id); // Save user ID in context
        toast.success("Login successful! Redirecting...");
        setError(""); // Clear any previous errors
        localStorage.setItem("token", data.token);

        // Redirect after a short delay to allow the user to see the toast
        setTimeout(() => {
          navigate("/member");
        }, 2000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* TOP-LEFT: LOGO */}
      <div className="logo-container">
        <img src={logo} alt="Hubly Logo" className="logo" />
      </div>

      {/* LEFT: FORM */}
      <div className="auth-form-container">
        <h1>Sign in to your Plexify</h1>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <label>Email/Username</label>
          <input
            type="text"
            placeholder="Enter your email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          <br />
          <button type="submit">Log in</button>
        </form>
        <br />
        <p className="toggle-link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      {/* RIGHT: IMAGE */}
      <div className="auth-image-container">
        <img src={img1} alt="Login Illustration" className="auth-image" />
      </div>
    </div>
  );
}

export default Login;