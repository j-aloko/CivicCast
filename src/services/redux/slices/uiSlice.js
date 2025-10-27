import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentView: "home",
  isLoading: false,
  modals: {
    createPoll: false,
    login: false,
    results: false,
  },
  notifications: [],
};

const uiSlice = createSlice({
  initialState,
  name: "ui",
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  setLoading,
  setCurrentView,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
