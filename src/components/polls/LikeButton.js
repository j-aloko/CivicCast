"use client";

import React, { useState } from "react";

import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { IconButton, Typography, Box, Tooltip } from "@mui/material";

import { usePolls } from "@/hooks/usePolls";
import { useRealtime } from "@/hooks/useRealtime";

function LikeButton({ pollId }) {
  const { currentPoll, likePoll, isAuthenticated } = usePolls();
  const { isConnected } = useRealtime(pollId);
  const [isLiking, setIsLiking] = useState(false);

  if (!currentPoll || currentPoll.id !== pollId) {
    return null;
  }

  const handleLike = async () => {
    if (!isAuthenticated || isLiking) return;

    setIsLiking(true);
    try {
      await likePoll(pollId);
    } catch (error) {
      console.error("Error liking poll:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const getTooltipTitle = () => {
    if (!isAuthenticated) return "Sign in to like this poll";
    if (isLiked) return "Unlike this poll";
    return "Like this poll";
  };

  const getLikeButtonIcon = () => {
    if (isLiked) return <Favorite />;
    return <FavoriteBorder />;
  };

  const likeCount = currentPoll._count?.likes || 0;
  const isLiked = currentPoll.userLiked;

  return (
    <Box sx={{ alignItems: "center", display: "flex" }}>
      <Tooltip title={getTooltipTitle()}>
        <span>
          <IconButton
            onClick={handleLike}
            disabled={!isAuthenticated || isLiking}
            color={isLiked ? "error" : "default"}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.04)",
                transform: "scale(1.1)",
              },
              transition: "transform 0.2s ease-in-out",
            }}
          >
            {getLikeButtonIcon()}
          </IconButton>
        </span>
      </Tooltip>

      <Box sx={{ alignItems: "center", display: "flex", gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {likeCount}
        </Typography>
        {isConnected && likeCount > 0 && (
          <Tooltip title="Live like count">
            <Box
              sx={{
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
                animation: "pulse 2s infinite",
                backgroundColor: "success.main",
                borderRadius: "50%",
                height: 6,
                width: 6,
              }}
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

export default LikeButton;
