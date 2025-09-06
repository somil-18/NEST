/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/utils/colors";
import LoadingState from "@/components/verification/LoadingState";
import ErrorState from "@/components/verification/ErrorState";
import SuccessState from "@/components/verification/SuccessState";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Main Email Verification Component
export default function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
  const [verificationMessage, setVerificationMessage] = useState("");
  const [userData, setUserData] = useState(null);

  const { token } = useParams();

  const performVerification = async () => {
    if (!token) {
      setVerificationStatus("error");
      setVerificationMessage(
        "No verification token found in the URL. Please check the verification link from your email."
      );
      return;
    }

    setVerificationStatus("loading");
    setVerificationMessage("");

    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {});
      console.log(response);

      setVerificationStatus("success");
      setVerificationMessage(response.data.message);
      setUserData(response.data.user);

      // Optional: Store verification status in localStorage or context
      localStorage.setItem("emailVerified", "true");
    } catch (error) {
      setVerificationStatus("error");
      setVerificationMessage(
        error.message || "An unexpected error occurred during verification."
      );
      console.error("Email verification failed:", error);
    }
  };

  useEffect(() => {
    performVerification();
  }, [token]);

  const handleRetry = () => {
    performVerification();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lightPrimary }}
                >
                  <Mail size={20} style={{ color: colors.primary }} />
                </div>
                <div>
                  <h1
                    className="text-lg font-semibold"
                    style={{ color: colors.dark }}
                  >
                    Email Verification
                  </h1>
                  <p className="text-sm text-gray-500">
                    Nest Account Verification
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6">
              {verificationStatus === "loading" && <LoadingState />}

              {verificationStatus === "success" && (
                <SuccessState
                  message={verificationMessage}
                  userEmail={userData?.email}
                />
              )}

              {verificationStatus === "error" && (
                <ErrorState
                  message={verificationMessage}
                  onRetry={handleRetry}
                  token={token}
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t text-center">
              <p className="text-xs text-gray-500">
                Having trouble?{" "}
                <Link
                  to="/contact"
                  className="underline hover:text-blue-600"
                  style={{ color: colors.primary }}
                >
                  Contact our support team
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
