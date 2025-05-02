import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/logo.png";
import dashboard from "../Images/dashboard.png";
import contact_center from "../Images/contact_center.png";
import analytics from "../Images/analytics.png";
import chatbot from "../Images/chat_bot.png";
import team from "../Images/team.png";
import setting from "../Images/settings.png";
import logout from "../Images/logout.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Dashboard"); 

  const handleLogout = async () => {
    try {
      // Call the backend logout API
      const response = await fetch(`http://localhost:5000/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Navigate to the home page
        navigate("/");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    { label: "Dashboard", icon: dashboard, route: "/member/dashboard" },
    { label: "Contact Center", icon: contact_center, route: "/member/contact-center" },
    { label: "Analytics", icon: analytics, route: "/member/analytics" },
    { label: "Chatbot", icon: chatbot, route: "/member/chatbot" },
    { label: "Team", icon: team, route: "/member/team" },
    { label: "Setting", icon: setting, route: "/member/setting" },
  ];

  return (
    <div
      style={{
        width: "10vw",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <img src={logo} alt="Logo" />
      </div>

      {/* Navigation Items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginBottom: "30vh" }}>
        {navItems.map((item, index) => (
          <button
            key={index}
            style={{
              ...navButtonStyle,
              backgroundColor:"transparent",
              color: selected === item.label ? "black" : "transparent",
              height: "2rem",
              border: "none"
            }}
            onClick={() => {
              setSelected(item.label);
              navigate(item.route); // Navigate to the route
            }}
          >
            <img
              src={item.icon}
              alt={item.label}
              style={{ width: "20px", marginBottom: "0.1rem" }}
            />
            <span style={{ fontSize: "0.8rem" }}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div style={{ margin: "1rem", textAlign: "center" }}>
        <img
          src={logout}
          alt="Logout"
          style={{ cursor: "pointer", width: "30px" }}
          onClick={handleLogout}
        />
        {/* Green Dot */}
        <span
          style={{
            position: "absolute",
            bottom: "6vh",
            left: "6vw",
            width: "8px",
            height: "8px",
            backgroundColor: "limegreen",
            borderRadius: "50%",
          }}
        ></span>
      </div>
    </div>
  );
};

// Minimal styles for nav buttons
const navButtonStyle = {
  padding: "0.5rem 1rem",
  margin: "0.5rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  outline: "none",
};

export default Navbar;