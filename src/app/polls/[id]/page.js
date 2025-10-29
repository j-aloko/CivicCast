import React from "react";

import { Container } from "@mui/material";

import PollDisplayContainer from "@/containers/poll-display-container/PollDisplayContainer";

async function PollPage({ params }) {
  const { id } = await params;
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PollDisplayContainer pollId={id} />
    </Container>
  );
}

export default PollPage;
