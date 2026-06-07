import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

const Default = () => {
  return (
    <>
      <div
        style={{ minHeight: "100vh", flexDirection: "column" }}
      >
        <Navbar />
        <div >
          <Outlet />
        <Footer />
        </div>
      </div>
    </>
  );
};

export default Default;
