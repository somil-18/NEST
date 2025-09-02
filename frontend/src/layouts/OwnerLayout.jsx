import React from "react";
import { Outlet } from "react-router-dom";

const OwnerLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default OwnerLayout;
