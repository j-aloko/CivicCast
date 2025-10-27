"use client";

import React from "react";

import { Bolt } from "@mui/icons-material";
import { Box, Typography, Button, Chip } from "@mui/material";

function HeroContent() {
  return (
    <Box>
      <Chip
        icon={<Bolt />}
        label="Instantly Global"
        sx={{
          backgroundColor: "secondary.light",
          color: "secondary.dark",
          fontWeight: 600,
          mb: 3,
        }}
      />

      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontSize: { lg: "3.75rem", sm: "3rem", xs: "2.5rem" },
          fontWeight: 800,
          lineHeight: 1.2,
          mb: 3,
        }}
      >
        <Box component="span" sx={{ color: "primary.main" }}>
          Real-Time Insights.
        </Box>{" "}
        Instant Decisions.
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: "text.secondary",
          lineHeight: 1.6,
          mb: 4,
        }}
      >
        Create professional polls in seconds, gather votes instantly, and see
        results update live across the globe. No refresh needed.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { sm: "row", xs: "column" },
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          href="#cta"
          sx={{
            "&:hover": {
              backgroundColor: "primary.light",
              boxShadow: "0 25px 30px -5px rgba(59, 130, 246, 0.4)",
            },
            backgroundColor: "primary.main",
            boxShadow: "0 20px 25px -5px rgba(30, 58, 138, 0.3)",
            fontSize: "1rem",
            fontWeight: "bold",
            px: 4,
            py: 2,
          }}
        >
          Create Your First Poll
        </Button>

        <Button
          variant="outlined"
          href="#demo"
          sx={{
            "&:hover": {
              backgroundColor: "grey.100",
              borderColor: "primary.light",
            },
            borderColor: "primary.main",
            color: "primary.main",
            fontSize: "1rem",
            fontWeight: "bold",
            px: 4,
            py: 2,
          }}
        >
          View Live Demo
        </Button>
      </Box>
    </Box>
  );
}

export default HeroContent;
