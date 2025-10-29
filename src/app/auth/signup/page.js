import React from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import SignUpContainer from "@/containers/signup-container/SignUpContainer";

export const metadata = {
  description: "Create a new CivicCast account",
  title: "Sign Up - CivicCast",
};

function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpContainer />
    </AuthLayout>
  );
}

export default SignUpPage;
