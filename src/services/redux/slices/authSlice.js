import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  extraReducers: () => {},
  initialState,
  name: "auth",
  reducers: {},
});

export const authReducer = authSlice.reducer;
