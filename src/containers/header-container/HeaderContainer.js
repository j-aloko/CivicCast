"use client";

import React, { useMemo } from "react";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { Header } from "@/components/header/Header";
import { ROUTES } from "@/constant/constant";
import { signOutUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store";

export const HeaderContainer = React.memo(() => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const userData = useMemo(() => {
    if (!auth.user) return null;

    const getInitials = (fullName) => {
      if (!fullName) return "U";
      return fullName
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2);
    };

    return {
      email: auth.user.email,
      image: auth.user.image,
      initials: getInitials(auth.user.name),
      isAuthenticated: auth.isAuthenticated,
      name: auth.user.name,
    };
  }, [auth.user, auth.isAuthenticated]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOutUser()).unwrap();
      router.push(ROUTES.home);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <Header userData={userData} onSignOut={handleSignOut} />;
});

HeaderContainer.displayName = "HeaderContainer";
export default HeaderContainer;
