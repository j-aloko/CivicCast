"use client";

import React, { useState, useEffect } from "react";

import { TrendingUp } from "@mui/icons-material";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";

function PollVisualization({ pollData }) {
  const [animatedPercentages, setAnimatedPercentages] = useState({});

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      const newPercentages = {};
      pollData.options.forEach((option) => {
        newPercentages[option.id] = option.percentage;
      });
      setAnimatedPercentages(newPercentages);
    }, 100);

    return () => clearTimeout(animationTimeout);
  }, [pollData.options]);

  const getColor = (colorType) => {
    switch (colorType) {
      case "accent":
        return "accent.main";
      case "secondary":
        return "secondary.main";
      case "primary":
        return "primary.light";
      default:
        return "grey.400";
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <CardContent sx={{ "&:last-child": { pb: 3 }, p: 3 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          {pollData.question}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {pollData.totalVotes.toLocaleString()} votes cast globally
        </Typography>

        <Box sx={{ mt: 3, spaceY: 2 }}>
          {pollData.options.map((option) => (
            <Box key={option.id} sx={{ mb: 2 }}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body1" fontWeight="500">
                  {option.label}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: getColor(option.color) }}
                >
                  {animatedPercentages[option.id] || 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={animatedPercentages[option.id] || 0}
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: getColor(option.color),
                    borderRadius: 4,
                    transition: "transform 0.7s ease-out",
                  },
                  backgroundColor: "grey.200",
                  borderRadius: 4,
                  height: 8,
                }}
              />
            </Box>
          ))}
        </Box>

        <Chip
          icon={<TrendingUp />}
          label="+1 Vote! Updating..."
          size="small"
          sx={{
            "@keyframes fadeInOut": {
              "0%": { opacity: 0 },
              "10%": { opacity: 1 },
              "100%": { opacity: 0 },
              "90%": { opacity: 1 },
            },
            animation: "fadeInOut 3s ease-in-out",
            backgroundColor: "accent.main",
            color: "white",
            opacity: 0,
            position: "absolute",
            right: 8,
            top: 8,
          }}
        />
      </CardContent>
    </Card>
  );
}

export default PollVisualization;
