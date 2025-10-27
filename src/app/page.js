import React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import FeaturesSection from "@/components/feature-section/FeaturesSection";
import HeroSection from "@/components/hero-section/HeroSection";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import StatsSection from "@/components/stats-section/StatsSection";

export default function Home() {
  return (
    <Container maxWidth="xl" disableGutters>
      <Box>
        <Stack>
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <HowItWorks />
        </Stack>
      </Box>
    </Container>
  );
}
