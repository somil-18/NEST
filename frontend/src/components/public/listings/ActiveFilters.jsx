import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { colors } from "@/utils/colors";
import { X } from "lucide-react";

// Active Filters Display Component
const ActiveFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const hasFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 50000 ||
    filters.minRating > 0 ||
    filters.sortBy !== "default";

  if (!hasFilters) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-medium" style={{ color: colors.dark }}>
          Active Filters:
        </span>
        <Button
          onClick={onClearFilters}
          style={{ backgroundColor: colors.error, color: colors.white }}
          size="sm"
          className="text-xs"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            ₹{filters.priceRange[0].toLocaleString()} - ₹
            {filters.priceRange[1].toLocaleString()}
            <button
              onClick={() => onFilterChange("priceRange", [0, 50000])}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </Badge>
        )}

        {filters.minRating > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {filters.minRating}+ Stars
            <button
              onClick={() => onFilterChange("minRating", 0)}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </Badge>
        )}

        {filters.sortBy !== "default" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Sort:{" "}
            {filters.sortBy
              .replace("_", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
            <button
              onClick={() => onFilterChange("sortBy", "default")}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
