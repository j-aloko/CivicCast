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
import Link from "next/link";
import { signIn } from "next-auth/react";

import { ROUTES } from "@/constant/constant";

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOAuthSignUp = async (provider) => {
    setIsLoading(true);
    setError("");

    try {
      await signIn(provider, {
        callbackUrl: ROUTES.dashboard,
        redirect: true,
      });
    } catch {
      console.error("Sign up error:", error);
      setError(`Failed to sign up with ${provider}`);
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
            variant="h5"
            component="h1"
            align="center"
            gutterBottom
            sx={{ color: "primary.main", fontWeight: 700 }}
          >
            Create Account
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Signup to create amazing polls
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* OAuth Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={() => handleOAuthSignUp("google")}
              disabled={isLoading}
              sx={{
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                  borderColor: "#4285f4",
                  boxShadow: "0 1px 3px rgba(66, 133, 244, 0.3)",
                },
                backgroundColor: "#ffffff",
                borderColor: "#dadce0",
                color: "#3c4043",
                fontSize: "0.875rem",
                fontWeight: 500,
                py: 1.5,
                textTransform: "none",
              }}
            >
              Sign up with Google
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHubIcon />}
              onClick={() => handleOAuthSignUp("github")}
              disabled={isLoading}
              sx={{
                "&:hover": {
                  backgroundColor: "#f6f8fa",
                  borderColor: "#1f2328",
                  boxShadow: "0 1px 3px rgba(31, 35, 40, 0.3)",
                },
                backgroundColor: "#ffffff",
                borderColor: "#d0d7de",
                color: "#1f2328",
                fontSize: "0.875rem",
                fontWeight: 500,
                py: 1.5,
                textTransform: "none",
              }}
            >
              Sign up with GitHub
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Button
                component={Link}
                href={ROUTES.signin}
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  color: "primary.main",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SignUp;
