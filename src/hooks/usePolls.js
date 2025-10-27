"use client";

import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchPolls,
  fetchPoll,
  createPoll,
  submitVote,
  toggleLike,
  optimisticVote,
  optimisticLike,
} from "@/services/redux/slices/pollsSlice";

export const usePolls = () => {
  const dispatch = useDispatch();
  const pollsState = useSelector((state) => state.polls);
  const authState = useSelector((state) => state.auth);

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
