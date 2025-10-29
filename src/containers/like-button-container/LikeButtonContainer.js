"use client";

import React, { useState, useCallback } from "react";

import LikeButton from "@/components/polls/LikeButton";
import { usePolls } from "@/hooks/usePolls";

function LikeButtonContainer({ pollId, isConnected }) {
  const { currentPoll, likePoll, isAuthenticated } = usePolls();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = useCallback(async () => {
    if (!isAuthenticated || isLiking) return;

    setIsLiking(true);
    try {
      await likePoll(pollId);
    } catch (error) {
      console.error("Error liking poll:", error);
    } finally {
      setIsLiking(false);
    }
  }, [isAuthenticated, isLiking, likePoll, pollId]);

  if (!currentPoll || currentPoll.id !== pollId) {
    return null;
  }

  const likeCount = currentPoll._count?.likes || 0;
  const isLiked = currentPoll.userLiked;

  return (
    <LikeButton
      pollId={pollId}
      likeCount={likeCount}
      isLiked={isLiked}
      isConnected={isConnected}
      isAuthenticated={isAuthenticated}
      isLiking={isLiking}
      onLike={handleLike}
    />
  );
}

export default LikeButtonContainer;
