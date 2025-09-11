import { colors } from "@/utils/colors";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Eye, Trash2 } from "lucide-react";

// Enhanced Tenant Card Component (No Edit Button)
const TenantCard = ({ tenant, onDelete, onView }) => {
  const statusColors = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    inactive: "bg-red-500",
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg p-0">
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={tenant.avatar}
                alt={tenant.name}
                className="w-12 h-12 rounded-full border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
              />
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                  {tenant.name}
                </h3>
                <p className="text-sm text-gray-600">{tenant.email}</p>
                <p className="text-xs text-gray-500">{tenant.phone}</p>
              </div>
            </div>
            <Badge
              className={`${
                statusColors[tenant.status]
              } text-white border-0 shadow-md`}
            >
              {tenant.status}
            </Badge>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Property
              </span>
              <p className="text-sm font-medium text-gray-800 truncate">
                {tenant.propertyTitle}
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Rent
                </span>
                <p
                  className="text-lg font-bold"
                  style={{ color: colors.primary }}
                >
                  ₹{tenant.rentAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Move-in
                </span>
                <p className="text-sm font-medium text-gray-800">
                  {new Date(tenant.moveInDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(tenant)}
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
            >
              <Eye size={14} className="mr-1" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(tenant.id)}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
            >
              <Trash2 size={14} className="mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantCard;
