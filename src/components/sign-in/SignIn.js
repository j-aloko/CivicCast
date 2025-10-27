"use client";

import React, { useState } from "react";

import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  Alert,
} from "@mui/material";
import { signIn } from "next-auth/react";

import { ROUTES } from "@/constant/constant";

function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOAuthSignIn = async (provider) => {
    setIsLoading(true);
    setError("");

    try {
      await signIn(provider, {
        callbackUrl: ROUTES.home,
        redirect: true,
      });
    } catch {
      console.error("Sign in error:", error);
      setError("Failed to sign in");
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "background.default",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Card
        sx={{
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          maxWidth: 400,
          mx: 2,
          width: "100%",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ color: "primary.main", fontWeight: 700 }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Sign in to your CivicCast account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.light",
                  borderColor: "primary.main",
                },
                borderColor: "grey.300",
                color: "text.primary",
                py: 1.5,
              }}
            >
              Continue with Google
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHubIcon />}
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.light",
                  borderColor: "primary.main",
                },
                borderColor: "grey.300",
                color: "text.primary",
                py: 1.5,
              }}
            >
              Continue with GitHub
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{" "}
              <Button
                component="a"
                href="/auth/signup"
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  color: "primary.main",
                  textDecoration: "none",
                }}
              >
                Sign up
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SignIn;
