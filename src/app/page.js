import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import FeaturesSection from "@/components/feature-section/FeaturesSection";
import HeroSection from "@/components/hero-section/HeroSection";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import StatsSection from "@/components/stats-section/StatsSection";

export default async function Home() {
  return (
    <Box>
      <Stack>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorks />
      </Stack>
    </Box>
  );
}
