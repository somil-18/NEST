import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { colors } from "@/utils/colors";
import { X } from "lucide-react";

// Filter Panel Component using Sheet
const FilterPanel = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 p-0 [&>button]:hidden">
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <SheetHeader className="p-0">
            <div className="flex items-center justify-between">
              <SheetTitle
                className="text-2xl font-bold"
                style={{ color: colors.dark }}
              >
                Filters
              </SheetTitle>
              <SheetClose asChild>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </SheetClose>
            </div>
          </SheetHeader>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4" style={{ color: colors.dark }}>
              Price Range (
              <span className="text-sm text-gray-600">
                ₹{filters.priceRange[0].toLocaleString()} - ₹
                {filters.priceRange[1].toLocaleString()}
              </span>
              )
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.priceRange[0] || ""}
                  onChange={(e) =>
                    onFilterChange("priceRange", [
                      Number(e.target.value) || 0,
                      filters.priceRange[1],
                    ])
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.priceRange[1] || ""}
                  onChange={(e) =>
                    onFilterChange("priceRange", [
                      filters.priceRange[0],
                      Number(e.target.value) || 50000,
                    ])
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4" style={{ color: colors.dark }}>
              Rating
            </h3>
            <Select
              value={filters.minRating.toString()}
              onValueChange={(value) =>
                onFilterChange("minRating", Number(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select minimum rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Ratings</SelectItem>
                <SelectItem value="1">1+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="5">5 Stars Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4" style={{ color: colors.dark }}>
              Sort By
            </h3>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
                <SelectItem value="rating_asc">Rating: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <Button
              onClick={onClearFilters}
              variant="outline"
              className="w-full"
            >
              Clear All Filters
            </Button>
            <Button
              onClick={onClose}
              className="w-full"
              style={{ backgroundColor: colors.primary }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterPanel;
