import { colors } from "@/utils/colors";
import { CheckCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";

// Success Component
const SuccessState = ({ message, userEmail }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-500" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.dark }}>
        Email Verified Successfully!
      </h2>
      <p className="text-gray-600 mb-6">{message}</p>
      {userEmail && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Mail className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>{userEmail}</strong> has been successfully verified.
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-3">
        <Button
          onClick={() => navigate("/login")}
          className="w-full"
          style={{ backgroundColor: colors.primary }}
        >
          Continue to Login
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full"
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

export default SuccessState;
