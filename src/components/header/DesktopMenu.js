"use client";

import React, { useState } from "react";

import { Dashboard, ExitToApp } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constant/constant";

import { UserAvatar } from "./UserAvatar";

export const DesktopMenu = React.memo(({ menuItems, userData, onSignOut }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileClick = () => {
    handleMenuClose();
    router.push(ROUTES.dashboard);
  };

  const handleSignOutClick = () => {
    handleMenuClose();
    onSignOut();
  };

  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 3 }}>
      {/* Navigation Items */}
      {menuItems.map((item) => (
        <Button
          key={item.label}
          component={Link}
          href={item.href}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
              color: "primary.light",
            },
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {item.label}
        </Button>
      ))}

      {/* User Menu */}
      {userData?.isAuthenticated ? (
        <Box sx={{ alignItems: "center", display: "flex" }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ "&:hover": { backgroundColor: "action.hover" }, p: 1 }}
          >
            <UserAvatar userData={userData} size={32} />
          </IconButton>

          <UserDropdownMenu
            anchorEl={anchorEl}
            userData={userData}
            onClose={handleMenuClose}
            onProfileClick={handleProfileClick}
            onSignOutClick={handleSignOutClick}
          />
        </Box>
      ) : (
        <Button
          variant="contained"
          href={ROUTES.signin}
          component={Link}
          sx={{
            "&:hover": { backgroundColor: "primary.light" },
            backgroundColor: "primary.main",
          }}
        >
          Get Started
        </Button>
      )}
    </Box>
  );
});

DesktopMenu.displayName = "DesktopMenu";

const UserDropdownMenu = React.memo(
  ({ anchorEl, userData, onClose, onProfileClick, onSignOutClick }) => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{ paper: { sx: { minWidth: 200, mt: 1.5 } } }}
    >
      <MenuItem onClick={onProfileClick}>
        <Box sx={{ alignItems: "center", display: "flex", gap: 2 }}>
          <UserAvatar userData={userData} size={32} />
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              {userData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData.email}
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose}>
        <Button
          variant="text"
          href={ROUTES.dashboard}
          component={Link}
          sx={{
            "& .MuiButton-startIcon": {
              color: "primary.main",
            },
            color: "text.primary",
            justifyContent: "flex-start",
            pl: 3,
            textTransform: "capitalize",
            width: "100%",
          }}
          startIcon={<Dashboard sx={{ fontSize: 20 }} />}
        >
          Dashboard
        </Button>
      </MenuItem>
      <MenuItem onClick={onSignOutClick}>
        <Button
          variant="text"
          sx={{
            "& .MuiButton-startIcon": {
              color: "error.main",
            },
            color: "error.main",
            justifyContent: "flex-start",
            pl: 3,
            textTransform: "capitalize",
            width: "100%",
          }}
          startIcon={<ExitToApp sx={{ fontSize: 20 }} />}
        >
          Sign Out
        </Button>
      </MenuItem>
    </Menu>
  )
);

UserDropdownMenu.displayName = "UserDropdownMenu";
