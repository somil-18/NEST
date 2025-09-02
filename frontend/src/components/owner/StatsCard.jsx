import { Card, CardContent } from "../ui/card";

// Enhanced Stats Card Component
const StatsCard = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden relative">
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
          color === "blue"
            ? "from-blue-400 to-blue-600"
            : color === "green"
            ? "from-green-400 to-green-600"
            : color === "purple"
            ? "from-purple-400 to-purple-600"
            : "from-yellow-400 to-yellow-600"
        }`}
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div
              className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
            >
              {icon}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:scale-105 transition-transform">
              {value}
            </div>
            <div className="text-sm font-medium text-gray-600">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
