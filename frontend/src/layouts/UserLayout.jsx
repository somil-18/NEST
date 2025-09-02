import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
