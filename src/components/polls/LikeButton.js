"use client";

import React from "react";

import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { IconButton, Typography, Box } from "@mui/material";

import { usePolls } from "@/hooks/usePolls";

function LikeButton({ pollId }) {
  const { currentPoll, likePoll, isAuthenticated } = usePolls();

  if (!currentPoll || currentPoll.id !== pollId) {
    return null;
  }

  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      await likePoll(pollId);
    } catch (error) {
      console.error("Error liking poll:", error);
    }
  };

  return (
    <Box sx={{ alignItems: "center", display: "flex" }}>
      <IconButton
        onClick={handleLike}
        disabled={!isAuthenticated}
        color={currentPoll.userLiked ? "error" : "default"}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(244, 67, 54, 0.04)",
          },
        }}
      >
        {currentPoll.userLiked ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {currentPoll._count.likes}
      </Typography>
    </Box>
  );
}

export default LikeButton;
