"use client";

import { useCallback } from "react";

import {
  fetchPolls,
  fetchPoll,
  createPoll,
  submitVote,
  toggleLike,
  optimisticVote,
  optimisticLike,
} from "@/services/redux/slices/pollsSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store";

export const usePolls = () => {
  const dispatch = useAppDispatch();
  const pollsState = useAppSelector((state) => state.polls);
  const authState = useAppSelector((state) => state.auth);

  const getPolls = useCallback(
    (params) => {
      return dispatch(fetchPolls(params));
    },
    [dispatch]
  );

  const getPoll = useCallback(
    (pollId) => {
      return dispatch(fetchPoll(pollId));
    },
    [dispatch]
  );

  const createNewPoll = useCallback(
    (pollData) => {
      return dispatch(createPoll(pollData));
    },
    [dispatch]
  );

  const voteOnPoll = useCallback(
    (pollId, optionId) => {
      dispatch(optimisticVote({ optionId, pollId }));
      return dispatch(submitVote({ optionId, pollId }));
    },
    [dispatch]
  );

  const likePoll = useCallback(
    (pollId) => {
      const { currentPoll } = pollsState;
      if (currentPoll && currentPoll.id === pollId) {
        dispatch(optimisticLike({ liked: !currentPoll.userLiked, pollId }));
        return dispatch(toggleLike(pollId));
      }
      return Promise.reject(
        new Error("Cannot like poll: poll not found or not current")
      );
    },
    [dispatch, pollsState]
  );

  return {
    ...pollsState,
    createNewPoll,
    getPoll,
    getPolls,
    isAuthenticated: authState.isAuthenticated,
    likePoll,
    voteOnPoll,
  };
};
