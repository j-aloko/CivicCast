import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "next-auth/react";

const initialState = {
  error: null,
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
  },
});

export const signOutUser = () => async (dispatch) => {
  try {
    await signOut({ redirect: false });
    dispatch(logout());
  } catch {
    dispatch(setError("Failed to sign out"));
  }
};

export const { setUser, setLoading, setError, clearError, logout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
