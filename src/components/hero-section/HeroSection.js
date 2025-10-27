"use client";

import React from "react";

import { Container, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import HeroContent from "../hero-content/HeroContent";
import PollVisualization from "../poll-visualization/PollVisualization";

function HeroSection() {
  const pollData = {
    options: [
      { color: "accent", id: "1", label: "Fully Remote", percentage: 55 },
      { color: "secondary", id: "2", label: "Hybrid Model", percentage: 30 },
      { color: "default", id: "3", label: "Office-first", percentage: 15 },
    ],
    question: "What is the future of work?",
    totalVotes: 24501,
  };

  return (
    <Box sx={{ overflow: "hidden", py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ md: 6, xs: 12 }}>
            <HeroContent />
          </Grid>
          <Grid size={{ md: 6, xs: 12 }}>
            <PollVisualization pollData={pollData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HeroSection;
