import { Button } from "@/components/ui/button";
import { colors } from "@/utils/colors";
import { useNavigate } from "react-router-dom";

// Animated CTA Component
const AnimatedCTA = () => {
  const navigate = useNavigate();
  return (
    <div
      className="text-center py-16 px-6"
      style={{ backgroundColor: colors.light }}
    >
      <h2 className="text-4xl font-bold mb-4" style={{ color: colors.dark }}>
        Ready to Find Your Perfect Home?
      </h2>
      <p
        className="text-xl mb-8 max-w-2xl mx-auto"
        style={{ color: colors.muted }}
      >
        Join thousands of happy tenants who found their ideal accommodation
        through Nest
      </p>
      <Button
        className="px-8 py-4 text-lg font-semibold text-white rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse"
        style={{ backgroundColor: colors.primary }}
        onClick={() => {
          navigate('/listings');
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.accent;
          e.currentTarget.classList.remove("animate-pulse");
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary;
          e.currentTarget.classList.add("animate-pulse");
        }}
      >
        Start Your Search Today
      </Button>
    </div>
  );
};

export default AnimatedCTA;
