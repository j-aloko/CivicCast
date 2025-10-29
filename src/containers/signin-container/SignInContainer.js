"use client";

import React, { useState, useCallback } from "react";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import SignIn from "@/components/sign-in/SignIn";
import { ROUTES } from "@/constant/constant";

function SignInContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.dashboard;

  const handleOAuthSignIn = useCallback(
    async (provider) => {
      setIsLoading(true);
      setError("");

      try {
        await signIn(provider, {
          callbackUrl,
          redirect: true,
        });
      } catch (err) {
        console.error("Sign in error:", err);
        setError("Failed to sign in. Please try again.");
        setIsLoading(false);
      }
    },
    [callbackUrl]
  );

  return (
    <SignIn
      isLoading={isLoading}
      error={error}
      onGoogleSignIn={() => handleOAuthSignIn("google")}
      onGitHubSignIn={() => handleOAuthSignIn("github")}
    />
  );
}

export default SignInContainer;
