import React from "react";

import { Container, Box, Typography } from "@mui/material";

import PollListContainer from "@/containers/poll-list-container/PollListContainer";

export const metadata = {
  description: "Discover and vote on interesting polls",
  title: "Browse Polls - QuickPoll",
};

function PollsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Browse Polls
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover interesting polls and share your opinion.
        </Typography>
      </Box>
      <PollListContainer />
    </Container>
  );
}

export default PollsPage;
