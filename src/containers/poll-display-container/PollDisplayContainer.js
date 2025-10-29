"use client";

import React, { useEffect, useState, useCallback } from "react";

import PollDisplay from "@/components/polls/PollDisplay";
import { usePolls } from "@/hooks/usePolls";
import {
  subscribeToPoll,
  unsubscribeFromPoll,
} from "@/services/redux/slices/realtimeSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store";

function PollDisplayContainer({ pollId }) {
  const dispatch = useAppDispatch();
  const { currentPoll, getPoll, voteOnPoll, isAuthenticated, isLoading } =
    usePolls();

  const isConnected = useAppSelector(
    (state) => state.realtime.pollConnections[pollId] || false
  );

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userManuallyToggledResults, setUserManuallyToggledResults] =
    useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (pollId) {
      dispatch(subscribeToPoll(pollId));
    }

    return () => {
      if (pollId) {
        dispatch(unsubscribeFromPoll(pollId));
      }
    };
  }, [pollId, dispatch]);

  const handleVote = useCallback(async () => {
    if (!selectedOption || !isAuthenticated || isVoting) return;
    setIsVoting(true);
    try {
      await voteOnPoll(pollId, selectedOption);
      setHasVoted(true);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  }, [selectedOption, isAuthenticated, isVoting, voteOnPoll, pollId]);

  const handleOptionSelect = useCallback((optionId) => {
    setSelectedOption(optionId);
  }, []);

  const handleResultsToggle = useCallback((show) => {
    setShowResults(show);
    setUserManuallyToggledResults(true);
  }, []);

  const handleRefreshPoll = useCallback(() => {
    getPoll(pollId);
  }, [getPoll, pollId]);

  useEffect(() => {
    if (pollId) {
      getPoll(pollId);
    }
  }, [pollId, getPoll]);

  useEffect(() => {
    if (currentPoll) {
      const userHasVoted = !!currentPoll.userVote;
      setHasVoted(userHasVoted);

      if (!userManuallyToggledResults) {
        const shouldShowResults =
          currentPoll.settings?.showResults || userHasVoted;
        setShowResults(shouldShowResults);
      }

      if (currentPoll.userVote) {
        setSelectedOption(currentPoll.userVote.optionId);
      }
    }
  }, [currentPoll, userManuallyToggledResults]);

  const isPollClosed =
    currentPoll?.closesAt && new Date(currentPoll.closesAt) <= new Date();
  const canVote =
    isAuthenticated &&
    !isPollClosed &&
    (!hasVoted || currentPoll?.settings?.allowMultiple);
  const totalVotes =
    currentPoll?.options?.reduce((sum, opt) => sum + opt.voteCount, 0) || 0;

  return (
    <PollDisplay
      pollId={pollId}
      currentPoll={currentPoll}
      isConnected={isConnected}
      isLoading={isLoading}
      isAuthenticated={isAuthenticated}
      isPollClosed={isPollClosed}
      canVote={canVote}
      hasVoted={hasVoted}
      showResults={showResults}
      selectedOption={selectedOption}
      isVoting={isVoting}
      totalVotes={totalVotes}
      onVote={handleVote}
      onOptionSelect={handleOptionSelect}
      onResultsToggle={handleResultsToggle}
      onRefreshPoll={handleRefreshPoll}
    />
  );
}

export default React.memo(PollDisplayContainer);
