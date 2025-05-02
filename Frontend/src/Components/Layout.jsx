import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh",  backgroundColor: "white" }}>
      <Navbar />
      <div style={{ flex: 1, marginLeft: "10vw" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;