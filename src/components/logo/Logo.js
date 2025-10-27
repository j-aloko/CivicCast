import React from "react";

import { Typography, Box } from "@mui/material";

function Logo({ theme }) {
  return (
    <Typography
      variant="h4"
      component="a"
      href="#"
      sx={{
        alignItems: "center",
        color: "primary.main",
        display: "flex",
        flexGrow: 1,
        fontWeight: 800,
        textDecoration: "none",
      }}
    >
      <Box
        component="svg"
        sx={{ fill: "currentColor", height: 24, mr: 1, width: 24 }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2A10 10 0 1 0 12 22A10 10 0 1 0 12 2ZM12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4ZM10 13H14V17H10V13ZM12 7A1.5 1.5 0 0 1 12 10A1.5 1.5 0 0 1 12 7Z" />
      </Box>
      Civic<span style={{ color: theme.palette.secondary.main }}>Cast</span>
    </Typography>
  );
}

export default Logo;
