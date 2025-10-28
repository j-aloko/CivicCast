import React from "react";

import { Container } from "@mui/material";

import PollDisplay from "@/components/polls/PollDisplay";

async function PollPage({ params }) {
  const pollId = await params.id;
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PollDisplay pollId={pollId} />
    </Container>
  );
}

export default PollPage;
