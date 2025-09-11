/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Plus,
  Home,
  DollarSign,
  ArrowLeft,
  Calendar,
  IndianRupee,
  BookAIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/owner/StatsCard";
import ListingCard from "@/components/owner/ListingCard";
import BookingCard from "@/components/owner/BookingCard";
import { colors } from "@/utils/colors";
import { Link, useNavigate } from "react-router-dom";
import ChangePassword from "@/components/owner/ChangePassword";
import { API_URL } from "@/utils/constants";
import { toast } from "sonner";
import axios from "axios";

// Main Dashboard Component
export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Extract data from API response
  const bookings = dashboardData?.all_bookings || [];
  const listings = dashboardData?.my_listings || [];
  const summaryStats = dashboardData?.summary_stats || {};

  // Dashboard Stats
  const stats = {
    totalListings: summaryStats.total_listings || 0,
    totalBookings: summaryStats.total_bookings || 0,
    totalRevenue: summaryStats.total_revenue || 0,
    availableListings: listings.filter(
      (l) => l.availability_status === "Available"
    ).length,
    occupiedListings: listings.filter(
      (l) => l.availability_status === "Occupied"
    ).length,
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      if (!user || !user.access_token) {
        toast.error("User not authenticated");
        navigate("/");
        return;
      }
      const response = await axios.get(`${API_URL}/owner/dashboard`, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });
      console.log(response);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update booking status
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      console.log(newStatus);
      await axios.post(
        `${API_URL}/bookings/${bookingId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log();

      // Update local state
      setDashboardData((prev) => ({
        ...prev,
        all_bookings: prev.all_bookings.map((booking) =>
          booking.booking_id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        ),
      }));

      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  // Cancel/Delete booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = user?.access_token;
      console.log(token);
      if (!token) {
        toast.error("User not authenticated");
        return;
      }
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from local state
      setDashboardData((prev) => ({
        ...prev,
        all_bookings: prev.all_bookings.filter(
          (booking) => booking.booking_id !== bookingId
        ),
      }));

      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  // Listing Management Functions
  const handleAddListing = () => {
    navigate("/owner/add-listing");
  };

  const handleEditListing = (listing) => {
    navigate(`/owner/edit-listing/${listing.id}`);
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      // Implementation for deleting listing
      try {
        const response = await axios.delete(
          `${API_URL}/listings/${listingId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          }
        );
        console.log(response);
        setDashboardData((prev) => ({
            ...prev,
            my_listings: prev.my_listings.filter(
              (listing) => listing.id !== listingId
            ),
            summary_stats: {
              ...prev.summary_stats,
              total_listings: prev.summary_stats.total_listings - 1,
            },
          }));
          toast.success("Listing deleted successfully");
      } catch (error) {
        console.log(error);
      }
      console.log("Delete listing:", listingId);
    }
  };

  const handleViewListing = (listing) => {
    navigate(`/listings/${listing.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ChangePassword
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="flex items-center"
                style={{ color: colors.primary }}
              >
                <Button
                  onClick={() => navigate(-1)}
                  style={{ background: colors.primary }}
                >
                  <ArrowLeft size={16} />
                </Button>
                <span className="ml-4 sm:text-4xl text-xl font-bold bg-clip-text">
                  Dashboard
                </span>
              </h1>
              <p className="text-gray-600 mt-1 hidden sm:block">
                Manage your properties, bookings and tenants
              </p>
            </div>
            <div className="flex-col sm:flex-row items-center space-x-4">
              <Button
                style={{ background: colors.primary }}
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            icon={<Home size={24} />}
            value={stats.totalListings}
            label="Total Properties"
            color="blue"
          />
          <StatsCard
            icon={<Calendar size={24} />}
            value={stats.totalBookings}
            label="Confirmed Bookings"
            color="purple"
          />
          <StatsCard
            icon={<BookAIcon size={24} />}
            value={`${dashboardData?.all_bookings.length}`}
            label="Total Bookings"
            color="green"
          />
          <Link to={"/"}>
            <StatsCard
              icon={<DollarSign size={24} />}
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              label="Total Revenue"
              color="green"
            />
          </Link>
        </div>

        {/* Bookings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="sm:text-3xl text-2xl font-bold text-gray-800 mb-2">
                Bookings ({bookings.length})
              </h2>
              <p className="text-gray-600 max-sm:text-sm">
                Manage and monitor property bookings
              </p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-16 text-center">
                <Calendar size={64} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-3 text-gray-700">
                  No bookings yet
                </h3>
                <p className="text-gray-500 mb-6 text-lg">
                  Bookings will appear here when tenants book your properties
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.booking_id}
                  booking={booking}
                  onUpdateStatus={handleUpdateBookingStatus}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Listings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="sm:text-3xl text-2xl font-bold text-gray-800 mb-2">
                Property Listings{" "}
                <span className="hidden sm:inline">({listings.length})</span>
              </h2>
              <p className="text-gray-600 hidden sm:block">
                Manage and monitor your property portfolio
              </p>
              <p className="text-gray-600 sm:hidden">
                {listings.length}{" "}
                {listings.length > 1 ? "properties" : "property"} listed
              </p>
            </div>
            <Button
              onClick={handleAddListing}
              className="text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: colors.primary }}
            >
              <Plus size={18} className="" />
              Add Property
            </Button>
          </div>

          {listings.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-16 text-center">
                <Home size={64} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-3 text-gray-700">
                  No properties yet
                </h3>
                <p className="text-gray-500 mb-6 text-lg">
                  Start building your property portfolio today
                </p>
                <Button
                  onClick={handleAddListing}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
                >
                  <Plus size={20} className="mr-2" />
                  Add Your First Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={{
                    ...listing,
                    price: listing.monthlyRent,
                    location: `${listing.city}, ${listing.state}`,
                    image: listing.image_urls?.[0] || "/placeholder-image.jpg",
                  }}
                  onEdit={handleEditListing}
                  onDelete={handleDeleteListing}
                  onView={handleViewListing}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
