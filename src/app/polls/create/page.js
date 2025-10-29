import React from "react";

import { Container, Box, Typography } from "@mui/material";

import CreatePollContainer from "@/containers/create-poll-container/CreatePollContainer";

export const metadata = {
  description: "Create a new poll to gather insights",
  title: "Create Poll - QuickPoll",
};

function CreatePollPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Poll
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create engaging polls to gather real-time insights from your audience.
        </Typography>
      </Box>
      <CreatePollContainer />
    </Container>
  );
}

export default CreatePollPage;
