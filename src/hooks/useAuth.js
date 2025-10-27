"use client";

import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import { initializeAuth, logout } from "@/services/redux/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const initAuth = useCallback(() => {
    return dispatch(initializeAuth());
  }, [dispatch]);

  const userLogout = useCallback(() => {
    return dispatch(logout());
  }, [dispatch]);

  return {
    ...authState,
    initAuth,
    logout: userLogout,
  };
};
