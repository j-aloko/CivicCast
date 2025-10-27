import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  liveUpdates: {},
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
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    subscribeToPoll: (state, action) => {
      if (!state.subscribedPolls.includes(action.payload)) {
        state.subscribedPolls.push(action.payload);
      }
    },
    unsubscribeFromPoll: (state, action) => {
      state.subscribedPolls = state.subscribedPolls.filter(
        (id) => id !== action.payload
      );
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
  subscribeToPoll,
  unsubscribeFromPoll,
  updateLiveData,
  clearLiveData,
} = realtimeSlice.actions;

export const realtimeReducer = realtimeSlice.reducer;
