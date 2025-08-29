import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Listings from "./pages/public/Listings";
import ListingDetail from "./pages/public/ListingDetail";
import NotFoundPage from "./pages/public/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="register" element={<Auth type="register" />} />
        <Route path="login" element={<Auth type="login" />} />
        <Route path="about" element={<About />} />
        <Route path="listings" element={<Listings />} />
        <Route path="listings/:id" element={<ListingDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default App;
