import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  currentPoll: null,
  error: null,
  isLoading: false,
  pagination: {
    hasMore: true,
    limit: 10,
    page: 1,
    total: 0,
  },
  polls: [],
  userPolls: [],
};

export const fetchPolls = createAsyncThunk(
  "polls/fetchPolls",
  async (params, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10 } = params;
      const response = await fetch(`/api/polls?page=${page}&limit=${limit}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPoll = createAsyncThunk(
  "polls/fetchPoll",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/polls/${pollId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPoll = createAsyncThunk(
  "polls/createPoll",
  async (pollData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/polls", {
        body: JSON.stringify(pollData),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitVote = createAsyncThunk(
  "polls/submitVote",
  async ({ pollId, optionId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        body: JSON.stringify({ optionId }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "polls/toggleLike",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/polls/${pollId}/like`, {
        method: "POST",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pollsSlice = createSlice({
  extraReducers: (builder) => {
    builder
      // Fetch Polls
      .addCase(fetchPolls.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.polls = action.payload.polls;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Single Poll
      .addCase(fetchPoll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPoll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPoll = action.payload;
      })
      .addCase(fetchPoll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Poll
      .addCase(createPoll.fulfilled, (state, action) => {
        state.polls.unshift(action.payload);
      })

      // Submit Vote
      .addCase(submitVote.fulfilled, (state, action) => {
        // Replace optimistic update with real data
        if (state.currentPoll?.id === action.payload.poll.id) {
          state.currentPoll = action.payload.poll;
        }
      })
      .addCase(submitVote.rejected, (state, action) => {
        state.error = action.payload;
        // TODO: Add rollback logic for optimistic update
      })

      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        // Update with real data
        if (state.currentPoll?.id === action.payload.pollId) {
          state.currentPoll.userLiked = action.payload.liked;
          state.currentPoll._count.likes = action.payload.likeCount;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
        // TODO: Add rollback logic for optimistic update
      });
  },
  initialState,
  name: "polls",
  reducers: {
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    optimisticLike: (state, action) => {
      const { pollId, liked } = action.payload;
      const poll = state.currentPoll;

      if (poll && poll.id === pollId) {
        poll.userLiked = liked;
        poll._count.likes = liked
          ? poll._count.likes + 1
          : poll._count.likes - 1;
      }
    },

    // Optimistic updates
    optimisticVote: (state, action) => {
      const { pollId, optionId } = action.payload;
      const poll = state.currentPoll;
      if (poll && poll.id === pollId) {
        poll.userVote = { id: "temp", optionId };
        poll.options = poll.options.map((opt) =>
          opt.id === optionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
        );
        const totalVotes = poll.options.reduce(
          (sum, opt) => sum + opt.voteCount,
          0
        );
        poll.options = poll.options.map((opt) => ({
          ...opt,
          percentage: totalVotes > 0 ? (opt.voteCount / totalVotes) * 100 : 0,
        }));

        poll.totalVotes = totalVotes;
        poll._count.votes = totalVotes;
      }
    },

    // Real-time updates
    updatePollRealtime: (state, action) => {
      const { pollId, updates } = action.payload;
      const pollIndex = state.polls.findIndex((poll) => poll.id === pollId);
      if (pollIndex !== -1) {
        state.polls[pollIndex] = { ...state.polls[pollIndex], ...updates };
      }
      if (state.currentPoll?.id === pollId) {
        state.currentPoll = { ...state.currentPoll, ...updates };
      }
    },
  },
});

export const {
  clearCurrentPoll,
  clearError,
  updatePollRealtime,
  optimisticVote,
  optimisticLike,
} = pollsSlice.actions;

export const pollsReducer = pollsSlice.reducer;
