"use client";

import React, { useState } from "react";

import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";

import { ROUTES } from "@/constant/constant";

import Logo from "../logo/Logo";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { href: "#features", label: "Features" },
    { href: "#howitworks", label: "How It Works" },
    { href: "#demo", label: "Live Demo" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Logo theme={theme} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <Button
              href={item.href}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "primary.light",
                },
                color: "text.primary",
                width: "100%",
              }}
            >
              {item.label}
            </Button>
          </ListItem>
        ))}
        <ListItem>
          <Box display="flex" justifyContent="center" width="100%">
            <Button
              variant="contained"
              href={ROUTES.signin}
              component={Link}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.light",
                },
                backgroundColor: "primary.main",
              }}
            >
              Get Started
            </Button>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "background.paper",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ margin: "0 auto", maxWidth: "1200px", width: "100%" }}>
        <Logo theme={theme} />
        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ alignItems: "center", display: "flex", gap: 3 }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
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
            <Button
              variant="contained"
              href={ROUTES.signin}
              component={Link}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.light",
                },
                backgroundColor: "primary.main",
              }}
            >
              Get Started
            </Button>
          </Box>
        )}
      </Toolbar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          display: { md: "none", xs: "block" },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Header;
