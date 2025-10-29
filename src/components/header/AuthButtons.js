"use client";

import React from "react";

import { Button, ListItem } from "@mui/material";
import Link from "next/link";

import { ROUTES } from "@/constant/constant";

export const AuthButtons = React.memo(({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <ListItem>
        <Button
          variant="contained"
          href={ROUTES.signin}
          component={Link}
          sx={{
            "&:hover": { backgroundColor: "primary.light" },
            backgroundColor: "primary.main",
            justifyContent: "flex-start",
          }}
        >
          Get Started
        </Button>
      </ListItem>
    );
  }

  return null;
});

AuthButtons.displayName = "AuthButtons";
