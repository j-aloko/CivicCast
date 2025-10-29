"use client";

import React, { useState, useEffect } from "react";

import { ArrowBack } from "@mui/icons-material";
import { Box, Container, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

function AuthLayout({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    setHasHistory(window.history.length > 1);
  }, []);

  const handleGoBack = () => {
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl) {
      router.push(callbackUrl);
      return;
    }

    if (hasHistory) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const getButtonText = () => {
    if (hasHistory) {
      return "Go Back";
    }
    return "Back to Home";
  };

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
              onClick={handleGoBack}
              startIcon={<ArrowBack />}
              sx={{
                "&:hover": {
                  backgroundColor: "grey.100",
                },
                color: "text.primary",
                textDecoration: "none",
              }}
            >
              {getButtonText()}
            </Button>
          </Box>
        </Container>
      </Box>
      {children}
    </Box>
  );
}

export default React.memo(AuthLayout);
