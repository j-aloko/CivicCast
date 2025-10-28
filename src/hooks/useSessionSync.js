"use client";

import { useEffect } from "react";

import { useSession } from "next-auth/react";

import { setUser, setLoading } from "@/services/redux/slices/authSlice";
import { useAppDispatch } from "@/services/redux/store";

export const useSessionSync = () => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      dispatch(setLoading(true));
    } else if (status === "authenticated" && session?.user) {
      dispatch(setUser(session.user));
    } else if (status === "unauthenticated") {
      dispatch(setUser(null));
      dispatch(setLoading(false));
    }
  }, [session, status, dispatch]);
};
