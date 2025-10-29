"use client";

import React from "react";

import { Button, List, ListItem } from "@mui/material";
import Link from "next/link";

export const MenuItems = React.memo(({ items, onItemClick }) => {
  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.label} disablePadding>
          <Button
            href={item.href}
            component={Link}
            onClick={onItemClick}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
                color: "primary.light",
              },
              color: "text.primary",
              justifyContent: "flex-start",
              pl: 3,
              textTransform: "capitalize",
              width: "100%",
            }}
          >
            {item.label}
          </Button>
        </ListItem>
      ))}
    </List>
  );
});

MenuItems.displayName = "MenuItems";
