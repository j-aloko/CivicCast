import React from "react";

import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import PropTypes from "prop-types";

import HeaderContainer from "@/containers/header-container/HeaderContainer";

import { Providers } from "./providers";
import theme from "./theme";

export const metadata = {
  description:
    "CivicCast is a dynamic platform for creating polls, casting votes, and engaging with live results. Whether you're gathering opinions, making group decisions, or sparking civic dialogue, CivicCast delivers instant updates and interactive feedback. Create, vote, and watch the pulse of your community unfold in real time.",
  title: "CivicCast | Real-Time Polling & Live Voting Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Providers>
              <Container maxWidth="xl" disableGutters>
                <HeaderContainer />
                {children}
              </Container>
            </Providers>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
