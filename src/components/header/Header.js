"use client";

import React, { useState } from "react";

import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { ROUTES } from "@/constant/constant";

import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import Logo from "../logo/Logo";

export const Header = React.memo(({ userData, onSignOut }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const menuItems = [{ href: ROUTES.polls, label: "View Polls" }];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "background.paper",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ margin: "0 auto", maxWidth: "1200px", width: "100%" }}>
        <Logo theme={theme} variant="h5" />

        {isMobile ? (
          <MobileMenuButton onClick={handleDrawerToggle} />
        ) : (
          <Box sx={{ ml: "auto" }}>
            <DesktopMenu
              menuItems={menuItems}
              userData={userData}
              onSignOut={onSignOut}
            />
          </Box>
        )}
      </Toolbar>

      <MobileMenu
        mobileOpen={mobileOpen}
        menuItems={menuItems}
        userData={userData}
        onDrawerToggle={handleDrawerToggle}
        onSignOut={onSignOut}
      />
    </AppBar>
  );
});

const MobileMenuButton = React.memo(({ onClick }) => (
  <IconButton
    color="inherit"
    aria-label="open drawer"
    edge="start"
    onClick={onClick}
    sx={{ color: "text.primary", ml: "auto" }}
  >
    <MenuIcon />
  </IconButton>
));

Header.displayName = "Header";
