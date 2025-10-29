import React from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import SignInContainer from "@/containers/signin-container/SignInContainer";

export const metadata = {
  description: "Sign in to your CivicCast account",
  title: "Sign In - CivicCast",
};

function SignInPage() {
  return (
    <AuthLayout>
      <SignInContainer />
    </AuthLayout>
  );
}

export default SignInPage;
