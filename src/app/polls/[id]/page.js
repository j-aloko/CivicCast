import React from "react";

import { Container } from "@mui/material";

import PollDisplay from "@/components/polls/PollDisplay";

async function PollPage({ params }) {
  const { id } = await params;
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PollDisplay pollId={id} />
    </Container>
  );
}

export default PollPage;
