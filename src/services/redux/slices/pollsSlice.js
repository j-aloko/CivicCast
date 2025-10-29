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
  async ({ rejectWithValue }, params = {}) => {
    try {
      const { page = 1, limit = 10 } = params;
      const response = await fetch(`api/polls?page=${page}&limit=${limit}`);
      const data = await response.json();
      console.log(data);

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
      .addCase(createPoll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.polls.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Submit Vote
      .addCase(submitVote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitVote.fulfilled, (state, action) => {
        // Replace optimistic update with real data
        if (state.currentPoll?.id === action.payload.poll.id) {
          state.currentPoll = action.payload.poll;
        }
        state.isLoading = false;
      })
      .addCase(submitVote.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
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
      if (state.currentPoll?.id !== pollId) return;

      state.currentPoll.userLiked = liked;
      state.currentPoll._count = state.currentPoll._count ?? {};
      state.currentPoll._count.likes = liked
        ? (state.currentPoll._count.likes ?? 0) + 1
        : (state.currentPoll._count.likes ?? 0) - 1;
    },

    optimisticVote: (state, action) => {
      const { pollId, optionId } = action.payload;
      if (state.currentPoll?.id !== pollId) return;

      const poll = state.currentPoll;
      poll.userVote = { optionId };

      poll.options = poll.options.map((opt) =>
        opt.id === optionId
          ? { ...opt, voteCount: (opt.voteCount ?? 0) + 1 }
          : opt
      );

      const total = poll.options.reduce((s, o) => s + (o.voteCount ?? 0), 0);
      poll.options = poll.options.map((opt) => ({
        ...opt,
        percentage: total > 0 ? (opt.voteCount / total) * 100 : 0,
      }));

      poll._count = poll._count ?? {};
      poll._count.votes = total;
    },

    updatePollInList: (state, action) => {
      const { pollId, updates } = action.payload;
      const idx = state.polls.findIndex((p) => p.id === pollId);
      if (idx === -1) return;

      const poll = state.polls[idx];
      const { likeCount, results } = updates;

      if (likeCount !== undefined) {
        poll._count.likes = likeCount;
      }

      if (results?.options) {
        poll.options = poll.options.map((opt) => {
          const updated = results.options.find((o) => o.id === opt.id);
          if (updated) {
            return {
              ...opt,
              percentage: updated.percentage,
              voteCount: updated.voteCount,
            };
          }
          return opt;
        });
        poll._count.votes = results.totalVotes;
      }
    },
    updatePollRealtime: (state, action) => {
      const { pollId, updates } = action.payload;
      const { poll: updatedPoll } = updates;
      if (state.currentPoll?.id === pollId && updatedPoll) {
        state.currentPoll = updatedPoll;
      }
      const idx = state.polls.findIndex((p) => p.id === pollId);
      if (idx !== -1 && updatedPoll) {
        state.polls[idx] = {
          ...state.polls[idx],
          _count: updatedPoll._count,
          options: updatedPoll.options,
        };
      }
    },
  },
});

export const {
  clearCurrentPoll,
  clearError,
  updatePollRealtime,
  updatePollInList,
  optimisticVote,
  optimisticLike,
} = pollsSlice.actions;

export const pollsReducer = pollsSlice.reducer;
