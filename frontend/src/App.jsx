import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Auth from "./pages/auth/Auth";

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/register" element={<Auth type="register" />} />
      <Route path="/login" element={<Auth type="login" />} />
    </Routes>
  );
};

export default App;
