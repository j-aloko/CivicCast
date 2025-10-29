"use client";

import React, { useState, useCallback } from "react";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import SignUp from "@/components/sign-up/SignUp";
import { ROUTES } from "@/constant/constant";

function SignUpContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.dashboard;

  const handleOAuthSignUp = useCallback(
    async (provider) => {
      setIsLoading(true);
      setError("");

      try {
        await signIn(provider, {
          callbackUrl,
          redirect: true,
        });
      } catch (err) {
        console.error("Sign up error:", err);
        setError(`Failed to sign up with ${provider}. Please try again.`);
        setIsLoading(false);
      }
    },
    [callbackUrl]
  );

  return (
    <SignUp
      isLoading={isLoading}
      error={error}
      onGoogleSignUp={() => handleOAuthSignUp("google")}
      onGitHubSignUp={() => handleOAuthSignUp("github")}
    />
  );
}

export default SignUpContainer;
