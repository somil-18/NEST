import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import React from "react";

const Auth = ({ type }) => {
  return <div>{type === "login" ? <Login /> : <Register />}</div>;
};

export default Auth;
