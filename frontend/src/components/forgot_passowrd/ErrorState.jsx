import { colors } from "@/utils/colors";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { ArrowLeft, Loader2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";

// Error Component
const ErrorState = ({ message, onRetry }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle size={32} className="text-red-500" />
            </div>
          </div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: colors.dark }}
          >
            Token Verification Failed
          </h2>
          <Alert className="mb-6 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {message}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {onRetry && (
              <Button onClick={onRetry} variant="outline" className="w-full">
                <Loader2 size={16} className="mr-2" />
                Try Again
              </Button>
            )}
            <Button
              onClick={() => navigate("/forgot-password")}
              className="w-full"
              style={{ backgroundColor: colors.primary }}
            >
              Request New Reset Link
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;
