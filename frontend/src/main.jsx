import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

const user = JSON.parse(localStorage.getItem("user"));
axios.interceptors.request.use(
  (request) => {
    if (user?.access_token) {
      request.headers.Authorization = `Bearer ${user.access_token}`;
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
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            success: "bg-green-500 text-white",
            error: "bg-red-500 text-white",
            warning: "bg-yellow-500 text-black",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
