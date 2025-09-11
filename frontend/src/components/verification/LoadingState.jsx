import { colors } from "@/utils/colors";
import { Loader2 } from "lucide-react";

// Loading Component
const LoadingState = () => (
  <div className="text-center py-8">
    <div className="flex justify-center mb-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
    </div>
    <h2 className="text-2xl font-bold mb-4" style={{ color: colors.dark }}>
      Verifying Your Email
    </h2>
    <p className="text-gray-600 mb-4">
      Please wait while we verify your email address...
    </p>
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
      <Loader2 size={16} className="animate-spin" />
      <span>This may take a few seconds</span>
    </div>
  </div>
);

export default LoadingState;
