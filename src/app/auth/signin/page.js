import React from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import SignIn from "@/components/sign-in/SignIn";

export const metadata = {
  description: "Sign in to your CivicCast account",
  title: "Sign In - CivicCast",
};

function SignInPage() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}

export default SignInPage;
