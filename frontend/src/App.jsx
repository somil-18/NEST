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
import EmailVerification from "./pages/verification/EmailVerification";
import ForgotPassword from "./pages/forgot_password/ForgotPassword";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerLayout from "./layouts/OwnerLayout";
import AddListingPage from "./pages/owner/AddListing";
import UserLayout from "./layouts/UserLayout";
import UserProfile from "./pages/user/UserProfile";
import UserFavourites from "./pages/user/UserFavourites";
import Terms from "./components/public/terms_privacy_pages/Terms";
import Policy from "./components/public/terms_privacy_pages/Policy";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
        <Route path="terms" element={<Terms />} />
        <Route path="policy" element={<Policy />} />
        <Route path="verify-email/:token" element={<EmailVerification />} />
        <Route path="forgot-password/:token" element={<ForgotPassword />} />
      </Route>
      <Route
        path="/owner"
        element={
          <ProtectedRoute roles={["owner"]}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="add-listing" element={<AddListingPage />} />
      </Route>
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={["user"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/user/:id/favourites" element={<UserFavourites />} />
      </Route>
    </Routes>
  );
};

export default App;
