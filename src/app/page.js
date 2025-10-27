import React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { getServerSession } from "next-auth/next";

import FeaturesSection from "@/components/feature-section/FeaturesSection";
import HeroSection from "@/components/hero-section/HeroSection";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import StatsSection from "@/components/stats-section/StatsSection";
import authOptions from "@/lib/auth/options";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);
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
