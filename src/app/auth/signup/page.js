import React from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import SignUp from "@/components/sign-up/SignUp";

export const metadata = {
  description: "Create a new CivicCast account",
  title: "Sign Up - CivicCast",
};

function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}

export default SignUpPage;
