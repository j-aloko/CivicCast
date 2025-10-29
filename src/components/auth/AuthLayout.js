"use client";

import React from "react";

import { Box } from "@mui/material";

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      {children}
    </Box>
  );
}

export default React.memo(AuthLayout);
