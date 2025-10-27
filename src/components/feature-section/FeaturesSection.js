"use client";

import React from "react";

import { TrendingUp, Edit, Favorite, Smartphone } from "@mui/icons-material";
import { Container, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import FeatureCard from "../feature-card/FeatureCard";

function FeaturesSection() {
  const features = [
    {
      borderColor: "accent.main",
      description:
        "Watch beautifully animated percentage bars update in real-time as votes roll in from around the world.",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: "Instant Live Results",
    },
    {
      borderColor: "secondary.main",
      description:
        "Intuitive interface to launch complex, multi-option polls in just a few clicks. Ready to share immediately.",
      icon: <Edit sx={{ fontSize: 40 }} />,
      title: "Quick Poll Creation",
    },
    {
      borderColor: "primary.light",
      description:
        "Foster community engagement with built-in like/unlike functionality and live notification feeds.",
      icon: <Favorite sx={{ fontSize: 40 }} />,
      title: "Social Interaction",
    },
    {
      borderColor: "primary.main",
      description:
        "Flawless experience on any device, from desktop monitors to mobile phones. Polls look great anywhere.",
      icon: <Smartphone sx={{ fontSize: 40 }} />,
      title: "Fully Responsive",
    },
  ];

  return (
    <Box id="features" sx={{ backgroundColor: "background.paper", py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          textAlign="center"
          sx={{
            fontSize: { sm: "2.5rem", xs: "2rem" },
            fontWeight: 700,
            mb: 1,
          }}
        >
          Designed for Speed and Engagement
        </Typography>
        <Typography
          variant="h5"
          textAlign="center"
          sx={{
            color: "text.secondary",
            maxWidth: "600px",
            mb: 6,
            mx: "auto",
          }}
        >
          Features that make data collection instant, beautiful, and
          collaborative.
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid size={{ lg: 3, sm: 6, xs: 12 }} key={feature.title}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturesSection;
