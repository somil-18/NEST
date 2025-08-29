import { Button } from "@/components/ui/button";
import { colors } from "@/utils/colors";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Enhanced Pagination Component (keeping your existing code)
const ListingPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2"
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      {getPageNumbers().map((page, index) => (
        <Button
          key={index}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className="px-3 py-2 min-w-[40px]"
          style={{
            backgroundColor:
              currentPage === page ? colors.primary : "transparent",
            borderColor: colors.border,
            color: currentPage === page ? "white" : colors.dark,
          }}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2"
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default ListingPagination;
