import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navigation/Navbar";
import Footer from "./components/navigation/Footer";

const token = localStorage.getItem("token");
axios.interceptors.request.use(
  (request) => {
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <App />
      <Footer />
    </BrowserRouter>
  </StrictMode>
);
