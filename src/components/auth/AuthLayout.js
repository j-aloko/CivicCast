"use client";

import React from "react";

import { ArrowBack } from "@mui/icons-material";
import { Box, Container, Button } from "@mui/material";
import Link from "next/link";

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          px: 3,
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Button
              component={Link}
              href="/"
              startIcon={<ArrowBack />}
              sx={{
                "&:hover": {
                  backgroundColor: "grey.100",
                },
                color: "text.primary",
                textDecoration: "none",
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
      {children}
    </Box>
  );
}

export default AuthLayout;
