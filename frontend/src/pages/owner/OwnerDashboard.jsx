import React, { useState } from "react";
import { Plus, Home, Users, DollarSign, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/owner/StatsCard";
import ListingCard from "@/components/owner/ListingCard";
import TenantCard from "@/components/owner/TenantCard";
import { colors } from "@/utils/colors";
import { useNavigate } from "react-router-dom";
import ChangePassword from "@/components/owner/ChangePassword";

// Sample data
const sampleListings = [
  {
    id: 1,
    title: "Luxury Studio Apartment",
    location: "Bandra West, Mumbai",
    price: 15000,
    status: "available",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    tenants: 0,
    dateCreated: "2024-01-15",
  },
  {
    id: 2,
    title: "Spacious 2BHK Flat",
    location: "Koramangala, Bangalore",
    price: 18000,
    status: "occupied",
    image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400",
    tenants: 1,
    dateCreated: "2023-12-10",
  },
  {
    id: 3,
    title: "Premium PG Room",
    location: "Sector 62, Noida",
    price: 12000,
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    tenants: 0,
    dateCreated: "2024-02-20",
  },
];

const sampleTenants = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    propertyId: 2,
    propertyTitle: "Spacious 2BHK Flat",
    moveInDate: "2024-01-20",
    rentAmount: 18000,
    status: "active",
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 9876543211",
    propertyId: 1,
    propertyTitle: "Luxury Studio Apartment",
    moveInDate: "2024-02-01",
    rentAmount: 15000,
    status: "pending",
    avatar:
      "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff",
  },
];

// Main Dashboard Component
export default function OwnerDashboard() {
  const [listings, setListings] = useState(sampleListings);
  const [tenants, setTenants] = useState(sampleTenants);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  // Dashboard Stats
  const stats = {
    totalListings: listings.length,
    availableListings: listings.filter((l) => l.status === "available").length,
    occupiedListings: listings.filter((l) => l.status === "occupied").length,
    totalTenants: tenants.length,
    monthlyRevenue: tenants
      .filter((t) => t.status === "active")
      .reduce((sum, t) => sum + t.rentAmount, 0),
  };

  // Listing Management Functions
  const handleAddListing = () => {
    navigate("/owner/add-listing");
  };

  const handleEditListing = (listing) => {
    alert(`Edit Listing: ${listing.title} - Form to be implemented`);
  };

  const handleDeleteListing = (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setListings(listings.filter((l) => l.id !== listingId));
      setTenants(tenants.filter((t) => t.propertyId !== listingId));
    }
  };

  const handleViewListing = (listing) => {
    alert(`View Listing: ${listing.title} - Detail view to be implemented`);
  };

  // Tenant Management Functions
  const handleAddTenant = () => {
    alert("Add New Tenant - Form to be implemented");
  };

  const handleDeleteTenant = (tenantId) => {
    if (window.confirm("Are you sure you want to remove this tenant?")) {
      setTenants(tenants.filter((t) => t.id !== tenantId));
    }
  };

  const handleViewTenant = (tenant) => {
    alert(`View Tenant: ${tenant.name} - Detail view to be implemented`);
  };

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
                Manage your properties and tenants with ease
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
          <StatsCard
            icon={<Home size={24} />}
            value={stats.totalListings}
            label="Total Properties"
            color="blue"
          />
          <StatsCard
            icon={<div className="text-2xl font-bold">✓</div>}
            value={stats.availableListings}
            label="Available"
            color="green"
          />
          <StatsCard
            icon={<div className="text-2xl font-bold">🏠</div>}
            value={stats.occupiedListings}
            label="Occupied"
            color="blue"
          />
          <StatsCard
            icon={<Users size={24} />}
            value={stats.totalTenants}
            label="Active Tenants"
            color="purple"
          />
          <StatsCard
            icon={<DollarSign size={24} />}
            value={`₹${stats.monthlyRevenue.toLocaleString()}`}
            label="Monthly Revenue"
            color="green"
          />
        </div>

        {/* Enhanced Listings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Property Listings ({listings.length})
              </h2>
              <p className="text-gray-600">
                Manage and monitor your property portfolio
              </p>
            </div>
            <Button
              onClick={handleAddListing}
              className="text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: colors.primary }}
            >
              <Plus size={18} className="mr-2" />
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
                  listing={listing}
                  onEdit={handleEditListing}
                  onDelete={handleDeleteListing}
                  onView={handleViewListing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Tenants Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Tenant Management ({tenants.length})
              </h2>
              <p className="text-gray-600">Monitor and manage your tenants</p>
            </div>
          </div>

          {tenants.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-16 text-center">
                <Users size={64} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-3 text-gray-700">
                  No tenants yet
                </h3>
                <p className="text-gray-500 mb-6 text-lg">
                  Tenants will appear here once they book your properties
                </p>
                <Button
                  onClick={handleAddTenant}
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-purple-400 hover:text-purple-600"
                >
                  <Users size={20} className="mr-2" />
                  Add Tenant Manually
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tenants.map((tenant) => (
                <TenantCard
                  key={tenant.id}
                  tenant={tenant}
                  onDelete={handleDeleteTenant}
                  onView={handleViewTenant}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
