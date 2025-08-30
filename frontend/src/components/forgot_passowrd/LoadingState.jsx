import { colors } from "@/utils/colors";
import { Card, CardContent } from "../ui/card";

// Loading Component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <Card className="w-full max-w-md">
      <CardContent className="text-center py-16">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-blue-500 animate-spin"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.dark }}>
          Verifying Reset Token
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your password reset request...
        </p>
      </CardContent>
    </Card>
  </div>
);

export default LoadingState;
