import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar key={user?.user?.id || "logged-out"} />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
