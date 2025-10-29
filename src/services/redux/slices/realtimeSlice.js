import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardConnected: false,
  isConnected: false,
  liveUpdates: {},
  pollConnections: {},
  socket: null,
  subscribedPolls: [],
};

const realtimeSlice = createSlice({
  initialState,
  name: "realtime",
  reducers: {
    clearLiveData: (state, action) => {
      if (action.payload) {
        delete state.liveUpdates[action.payload];
      } else {
        state.liveUpdates = {};
      }
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setDashboardConnectionStatus: (state, action) => {
      state.dashboardConnected = action.payload;
    },
    setPollConnectionStatus: (state, action) => {
      const { pollId, isConnected } = action.payload;
      state.pollConnections[pollId] = isConnected;
      state.isConnected =
        Object.values(state.pollConnections).some(
          (status) => status === true
        ) || state.dashboardConnected;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    subscribeToDashboard: () => {},
    subscribeToPoll: (state, action) => {
      const pollId = action.payload;
      if (!state.subscribedPolls.includes(pollId)) {
        state.subscribedPolls.push(pollId);
      }
    },
    unsubscribeFromDashboard: () => {},
    unsubscribeFromPoll: (state, action) => {
      const pollId = action.payload;
      state.subscribedPolls = state.subscribedPolls.filter(
        (id) => id !== pollId
      );
      delete state.pollConnections[pollId];
    },
    updateLiveData: (state, action) => {
      const { pollId, data } = action.payload;
      state.liveUpdates[pollId] = data;
    },
  },
});

export const {
  setSocket,
  setConnectionStatus,
  setDashboardConnectionStatus,
  setPollConnectionStatus,
  subscribeToDashboard,
  subscribeToPoll,
  unsubscribeFromDashboard,
  unsubscribeFromPoll,
  updateLiveData,
  clearLiveData,
} = realtimeSlice.actions;

export const realtimeReducer = realtimeSlice.reducer;
