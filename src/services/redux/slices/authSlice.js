import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signOut } from "next-auth/react";

export const signOutUser = createAsyncThunk(
  "user/SignOut",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await signOut({ redirect: false });
      dispatch(logout());
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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

export const { setUser, setLoading, setError, clearError, logout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
