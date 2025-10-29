"use client";

import React from "react";

import { Dashboard, ExitToApp } from "@mui/icons-material";
import { Box, Button, Drawer, ListItem, Typography } from "@mui/material";
import Link from "next/link";

import { ROUTES } from "@/constant/constant";

import { AuthButtons } from "./AuthButtons";
import { MenuItems } from "./MenuItems";
import { UserAvatar } from "./UserAvatar";
import Logo from "../logo/Logo";

export const MobileMenu = React.memo(
  ({ mobileOpen, menuItems, userData, onDrawerToggle, onSignOut }) => {
    const handleAction = (callback = null) => {
      onDrawerToggle();
      if (typeof callback === "function") {
        callback();
      }
    };

    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
          display: { md: "none", xs: "block" },
        }}
      >
        <MobileMenuContent
          menuItems={menuItems}
          userData={userData}
          onDrawerToggle={onDrawerToggle}
          onSignOut={onSignOut}
          onAction={handleAction}
        />
      </Drawer>
    );
  }
);

MobileMenu.displayName = "MobileMenu";

const MobileMenuContent = React.memo(
  ({ menuItems, userData, onAction, onSignOut }) => (
    <Box onClick={onAction}>
      <Box p={2}>
        <Logo variant="h5" />
      </Box>

      <MenuItems items={menuItems} onItemClick={onAction} />

      {userData?.isAuthenticated ? (
        <AuthenticatedContent
          userData={userData}
          onAction={onAction}
          onSignOut={onSignOut}
        />
      ) : (
        <AuthButtons isAuthenticated={false} />
      )}
    </Box>
  )
);

const AuthenticatedContent = React.memo(({ userData, onAction, onSignOut }) => (
  <>
    <ListItem>
      <UserProfileSection userData={userData} />
    </ListItem>

    <ListItem disablePadding>
      <MenuButton
        icon={<Dashboard />}
        label="Dashboard"
        href={ROUTES.dashboard}
        onClick={() => onAction()}
      />
    </ListItem>

    <ListItem disablePadding>
      <MenuButton
        icon={<ExitToApp />}
        iconColor="error.main"
        textColor="error.main"
        label="Sign Out"
        onClick={() => onAction(onSignOut)}
      />
    </ListItem>
  </>
));

const UserProfileSection = React.memo(({ userData }) => (
  <Box
    sx={{
      alignItems: "center",
      borderBottom: 1,
      borderColor: "divider",
      display: "flex",
      gap: 2,
      p: 2,
      width: "100%",
    }}
  >
    <UserAvatar userData={userData} size={40} />
    <Box sx={{ flex: 1, textAlign: "left" }}>
      <Typography variant="body2" fontWeight="600">
        {userData.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {userData.email}
      </Typography>
    </Box>
  </Box>
));

const MenuButton = React.memo(
  ({
    icon,
    label,
    href,
    onClick,
    iconColor = "primary.main",
    textColor = "text.primary",
  }) => (
    <Button
      variant="text"
      href={href}
      component={href ? Link : "button"}
      onClick={onClick}
      sx={{
        "& .MuiButton-startIcon": { color: iconColor },
        color: textColor,
        justifyContent: "flex-start",
        pl: 3,
        textTransform: "capitalize",
        width: "100%",
      }}
      startIcon={React.cloneElement(icon, { sx: { fontSize: 20 } })}
    >
      {label}
    </Button>
  )
);
