import { colors } from "@/utils/colors";
import { ArrowLeft, RotateCcw, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";

// Error Component
const ErrorState = ({ message, onRetry, token }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle size={32} className="text-red-500" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.dark }}>
        Verification Failed
      </h2>
      <Alert className="mb-6 bg-red-50 border-red-200">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">{message}</AlertDescription>
      </Alert>

      <div className="space-y-3">
        {token && (
          <Button onClick={onRetry} variant="outline" className="w-full">
            <RotateCcw size={16} className="mr-2" />
            Try Again
          </Button>
        )}
        <Button
          onClick={() => navigate("/register")}
          className="w-full"
          style={{ backgroundColor: colors.primary }}
        >
          Request New Verification Email
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="w-full"
        >
          <ArrowLeft size={16} className="mr-2" />
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
