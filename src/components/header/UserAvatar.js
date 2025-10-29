"use client";

import React from "react";

import { Avatar } from "@mui/material";

export const UserAvatar = React.memo(({ userData, size = 32 }) => {
  if (userData?.image) {
    return (
      <Avatar
        src={userData.image}
        alt={userData.name}
        sx={{ height: size, width: size }}
      />
    );
  }

  return (
    <Avatar
      sx={{
        bgcolor: "primary.main",
        fontSize: size === 32 ? "0.875rem" : "1rem",
        fontWeight: 600,
        height: size,
        width: size,
      }}
    >
      {userData?.initials || "U"}
    </Avatar>
  );
});

UserAvatar.displayName = "UserAvatar";
