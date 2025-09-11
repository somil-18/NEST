import { colors } from "@/utils/colors";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit3, Eye, MapPin, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

// Enhanced Listing Card Component
const ListingCard = ({ listing, onEdit, onDelete, onView }) => {
  const statusColors = {
    available: "bg-green-500 shadow-green-200",
    occupied: "bg-blue-500 shadow-blue-200",
    maintenance: "bg-yellow-500 shadow-yellow-200"
  };
  console.log(listing)

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg p-0 cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className={`absolute top-3 right-3 ${statusColors[listing.status]} text-white border-0 shadow-lg`}>
          {listing.availability_status}
        </Badge>
        <div className="absolute bottom-3 left-3 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Created: {new Date(listing.created_at).toLocaleDateString()}
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{listing.location}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                ₹{listing.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-1">/month</span>
            </div>
            {/* <div className="text-right">
              <div className="text-sm font-medium text-gray-600">
                {listing.tenants} tenant{listing.tenants !== 1 ? 's' : ''}
              </div>
            </div> */}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline" 
              size="sm" 
              onClick={() => onView(listing)}
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
            >
              <Eye size={14} className="mr-1" />
              View
            </Button>
            <div className="flex space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(listing)}
                className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all"
              >
                <Edit3 size={14} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(listing.id)}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;