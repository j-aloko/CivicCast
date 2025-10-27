"use client";

import React from "react";

import { Card, CardContent, Box, Typography } from "@mui/material";

function FeatureCard({ icon, title, description, borderColor }) {
  return (
    <Card
      sx={{
        borderColor,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        height: "100%",
        p: 3,
        textAlign: "center",
      }}
    >
      <CardContent>
        <Box sx={{ color: borderColor, mb: 2 }}>{icon}</Box>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default FeatureCard;
