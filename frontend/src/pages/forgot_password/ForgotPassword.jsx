/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PasswordResetDialog from "@/components/forgot_passowrd/PasswordResetDialog";
import ErrorState from "@/components/forgot_passowrd/ErrorState";
import LoadingState from "@/components/forgot_passowrd/LoadingState";

// Simulate API call to verify token
const verifyResetToken = async (token) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token) {
        resolve({
          success: true,
          message: "Invalid reset token. Please request a new password reset.",
        });
      }
    }, 2000);
  });
};

// Main Reset Password Component
export default function ForgotPassword() {
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { token } = useParams();

  const performTokenVerification = async () => {
    if (!token) {
      setVerificationStatus("error");
      setVerificationMessage(
        "No reset token found in the URL. Please check the reset link from your email."
      );
      return;
    }
    console.log(token);

    setVerificationStatus("loading");

    try {
      const response = await verifyResetToken(token);
      setVerificationStatus("success");
      setIsOpen(true);
      setVerificationMessage(response.message);
      setUserEmail(response.email);
    } catch (error) {
      setVerificationStatus("error");
      setVerificationMessage(error.message || "Token verification failed.");
    }
  };

  useEffect(() => {
    performTokenVerification();
  }, [token]);

  // Retry handler
  const handleRetry = () => {
    performTokenVerification();
  };

  if (verificationStatus === "loading") {
    return <LoadingState />;
  }

  if (verificationStatus === "error") {
    return (
      <ErrorState
        message={verificationMessage}
        onRetry={token ? handleRetry : null}
      />
    );
  }

  return (
    <PasswordResetDialog
      isOpen={isOpen}
      token={token}
      userEmail={userEmail}
    />
  );
}
