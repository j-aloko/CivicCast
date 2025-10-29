"use client";

import React from "react";

import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { IconButton, Typography, Box, Tooltip } from "@mui/material";

function LikeButton({
  likeCount,
  isLiked,
  isConnected,
  isAuthenticated,
  onLike,
}) {
  const getTooltipTitle = () => {
    if (!isAuthenticated) return "Sign in to like this poll";
    if (isLiked) return "Unlike this poll";
    return "Like this poll";
  };

  const getLikeButtonIcon = () => {
    if (isLiked) return <Favorite />;
    return <FavoriteBorder />;
  };

  return (
    <Box sx={{ alignItems: "center", display: "flex" }}>
      <Tooltip title={getTooltipTitle()}>
        <span>
          <IconButton
            onClick={onLike}
            disabled={!isAuthenticated}
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

export default React.memo(LikeButton);
