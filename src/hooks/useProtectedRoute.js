"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const useProtectedRoute = (redirectTo = "/auth/signin") => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
    }
  }, [session, status, router, redirectTo]);

  return { isLoading: status === "loading", session };
};

// Hook for protecting auth routes (signin/signup)
export const useAuthRoute = (redirectTo = "/dashboard") => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  return { isLoading: status === "loading", session };
};
