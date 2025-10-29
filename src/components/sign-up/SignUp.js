"use client";

import React from "react";

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

import { ROUTES } from "@/constant/constant";

const OAuthButton = React.memo(({ icon, label, onClick, disabled, styles }) => (
  <Button
    variant="outlined"
    fullWidth
    startIcon={icon}
    onClick={onClick}
    disabled={disabled}
    sx={styles}
  >
    {label}
  </Button>
));

OAuthButton.displayName = "OAuthButton";

const AuthHeader = React.memo(({ title, subtitle }) => (
  <>
    <Typography
      variant="h5"
      component="h1"
      align="center"
      gutterBottom
      sx={{ color: "primary.main", fontWeight: 700 }}
    >
      {title}
    </Typography>
    <Typography
      variant="body1"
      align="center"
      color="text.secondary"
      sx={{ mb: 4 }}
    >
      {subtitle}
    </Typography>
  </>
));

AuthHeader.displayName = "AuthHeader";

const AuthFooter = React.memo(({ text, linkText, href }) => (
  <Box textAlign="center">
    <Typography variant="body2" color="text.secondary">
      {text}{" "}
      <Button
        component={Link}
        href={href}
        sx={{
          "&:hover": {
            textDecoration: "underline",
          },
          color: "primary.main",
          textDecoration: "none",
        }}
      >
        {linkText}
      </Button>
    </Typography>
  </Box>
));

AuthFooter.displayName = "AuthFooter";

function SignUp({ isLoading, error, onGoogleSignUp, onGitHubSignUp }) {
  const oauthButtonStyles = {
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
    backgroundColor: "#ffffff",
    borderColor: "#dadce0",
    color: "#3c4043",
    fontSize: "0.875rem",
    fontWeight: 500,
    py: 1.5,
    textTransform: "none",
  };

  const googleButtonStyles = {
    ...oauthButtonStyles,
    "&:hover": {
      ...oauthButtonStyles["&:hover"],
      borderColor: "#4285f4",
      boxShadow: "0 1px 3px rgba(66, 133, 244, 0.3)",
    },
  };

  const githubButtonStyles = {
    ...oauthButtonStyles,
    "&:hover": {
      ...oauthButtonStyles["&:hover"],
      borderColor: "#1f2328",
      boxShadow: "0 1px 3px rgba(31, 35, 40, 0.3)",
    },
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
          <AuthHeader
            title="Create Account"
            subtitle="Signup to create amazing polls"
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <OAuthButton
              provider="google"
              icon={<GoogleIcon />}
              label="Sign up with Google"
              onClick={onGoogleSignUp}
              disabled={isLoading}
              styles={googleButtonStyles}
            />

            <OAuthButton
              provider="github"
              icon={<GitHubIcon />}
              label="Sign up with GitHub"
              onClick={onGitHubSignUp}
              disabled={isLoading}
              styles={githubButtonStyles}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <AuthFooter
            text="Already have an account?"
            linkText="Sign in"
            href={ROUTES.signin}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default React.memo(SignUp);
