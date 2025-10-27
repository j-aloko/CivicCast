"use client";

import React from "react";

import { Container, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

function StatsSection() {
  const stats = [
    { label: "Polls Created", value: "10,000+" },
    { label: "Votes Cast", value: "500,000+" },
    { label: "Real-time Update Latency", value: "~3s" },
  ];

  return (
    <Box sx={{ py: { md: 6, xs: 4 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: "primary.main",
            borderRadius: 3,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            color: "white",
            px: 3,
            py: 6,
          }}
        >
          <Grid container spacing={4} textAlign="center">
            {stats.map((stat) => (
              <Grid size={{ sm: 4, xs: 12 }} key={stat.label}>
                <Typography
                  variant="h2"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    opacity: 0.9,
                  }}
                >
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default StatsSection;
