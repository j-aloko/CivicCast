"use client";

import React from "react";

import { Edit, Share, Analytics, Assessment } from "@mui/icons-material";
import {
  Container,
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

function HowItWorks() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const steps = [
    {
      description:
        "Launch your poll with up to 10 options in our intuitive editor. Set closing times, privacy, and visual themes.",
      icon: <Edit />,
      step: 1,
      title: "Create & Customize",
    },
    {
      description:
        "Generate a unique shareable link or embed code. Distribute your poll via email, social media, or your website.",
      icon: <Share />,
      step: 2,
      title: "Share Securely",
    },
    {
      description:
        "See every vote arrive in milliseconds. The results graph updates automatically and in high-definition. No manual refresh needed.",
      icon: <Analytics />,
      step: 3,
      title: "Watch It Live",
    },
    {
      description:
        "Access detailed reports on voter engagement, time-based results, and demographic breakdowns for deep insights.",
      icon: <Assessment />,
      step: 4,
      title: "Analyze Metrics",
    },
  ];

  return (
    <Box id="howitworks" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          textAlign="center"
          sx={{
            fontSize: { sm: "2.5rem", xs: "2rem" },
            fontWeight: 700,
            mb: 6,
          }}
        >
          Getting Started is Simple
        </Typography>

        <Box sx={{ position: "relative" }}>
          {isDesktop && (
            <Box
              sx={{
                backgroundColor: "grey.300",
                bottom: 0,
                display: { md: "block", xs: "none" },
                left: "50%",
                position: "absolute",
                top: 0,
                transform: "translateX(-50%)",
                width: "2px",
              }}
            />
          )}

          <Grid container spacing={4}>
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <Grid
                  size={{ md: 6, xs: 12 }}
                  key={step.step}
                  sx={{
                    alignItems: { md: "flex-start", xs: "center" },
                    display: "flex",
                    flexDirection: {
                      md: isEven ? "row" : "row-reverse",
                      xs: "column",
                    },
                    gap: { md: !isEven ? 4 : 0, xs: 0 },
                    textAlign: { md: "left", xs: "center" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "center",
                      mb: { md: 0, xs: 2 },
                      minHeight: { md: 80, xs: "auto" },
                      order: { md: isEven ? 2 : 1, xs: 1 },
                      pl: { md: isEven ? 3 : 0, xs: 0 },
                      pr: { md: isEven ? 0 : 3, xs: 0 },
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="600"
                      color="primary.main"
                      gutterBottom
                      sx={{
                        lineHeight: 1.3,
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      backgroundColor: "accent.main",
                      border: "4px solid white",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      color: "white",
                      flexShrink: 0,
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      height: 64,
                      mb: { md: 0, xs: 2 },
                      mx: { md: 0, xs: "auto" },
                      order: { md: isEven ? 1 : 2, xs: 2 },
                      width: 64,
                    }}
                  >
                    {step.icon}
                  </Avatar>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default HowItWorks;
