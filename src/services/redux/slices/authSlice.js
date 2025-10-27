import { createSlice } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

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

export const initializeAuth = () => async (dispatch) => {
  try {
    const session = await getSession();
    dispatch(setUser(session?.user || null));
  } catch {
    dispatch(setError("Failed to initialize authentication"));
  }
};

export const { setUser, setLoading, setError, clearError, logout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
