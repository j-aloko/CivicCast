"use client";

import React from "react";

import {
  Poll as PollIcon,
  TrendingUp,
  Favorite,
  Add,
} from "@mui/icons-material";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Link from "next/link";

import { ROUTES } from "@/constant/constant";

const iconMap = {
  add: <Add />,
  favorite: <Favorite />,
  poll: <PollIcon />,
  trendingUp: <TrendingUp />,
};

function Dashboard({ session, stats, polls, isLoading, hasPolls }) {
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <WelcomeSection session={session} />
      <StatsSection stats={stats} />
      <Grid container spacing={4}>
        <Grid size={{ sm: 8, xs: 12 }}>
          <RecentPollsSection polls={polls} hasPolls={hasPolls} />
        </Grid>

        <Grid size={{ md: 4, xs: 12 }}>
          <QuickActionsSection />
        </Grid>
      </Grid>
    </Container>
  );
}

const WelcomeSection = React.memo(({ session }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Welcome back, {session?.user?.name}!
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Create and manage your polls, track engagement, and see real-time results.
    </Typography>
  </Box>
));

WelcomeSection.displayName = "WelcomeSection";

const StatsSection = React.memo(({ stats }) => (
  <Grid container spacing={3} sx={{ mb: 6 }}>
    {stats.map((stat) => (
      <Grid size={{ sm: 4, xs: 12 }} key={stat.label}>
        <Card>
          <CardContent>
            <Box sx={{ alignItems: "center", display: "flex", mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: `${stat.color}.light`,
                  borderRadius: 1,
                  color: `${stat.color}.main`,
                  mr: 2,
                  p: 1,
                }}
              >
                {iconMap[stat.icon]}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
));

StatsSection.displayName = "StatsSection";

const RecentPollsSection = React.memo(({ polls, hasPolls }) => (
  <>
    <Box
      sx={{
        display: "flex",
        mb: 3,
      }}
    >
      <Typography variant="h5" component="h2">
        Recent Polls
      </Typography>
    </Box>

    {!hasPolls ? <EmptyPollsState /> : <PollsGrid polls={polls} />}
  </>
));

RecentPollsSection.displayName = "RecentPollsSection";

const EmptyPollsState = React.memo(() => (
  <Card
    sx={{
      boxShadow: 1,
      height: "100%",
      p: 2,
      textDecoration: "none",
    }}
  >
    <CardContent sx={{ py: 6, textAlign: "center" }}>
      <PollIcon sx={{ color: "text.secondary", fontSize: 64, mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No polls yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create your first poll to start gathering insights
      </Typography>
      <Button
        component={Link}
        href={ROUTES.createPoll}
        variant="contained"
        startIcon={<Add />}
      >
        Create Your First Poll
      </Button>
    </CardContent>
  </Card>
));

EmptyPollsState.displayName = "EmptyPollsState";

const PollsGrid = React.memo(({ polls }) => (
  <Grid container spacing={2}>
    {polls.map((poll) => (
      <PollCard key={poll.id} poll={poll} />
    ))}
  </Grid>
));

PollsGrid.displayName = "PollsGrid";

const PollCard = React.memo(({ poll }) => (
  <Grid
    size={{ sm: 6, xs: 12 }}
    sx={{
      boxShadow: 1,
      height: "100%",
      p: 2,
      textDecoration: "none",
    }}
  >
    <Card component={Link} href={`${ROUTES.polls}/${poll.id}`}>
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {poll.question}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
          noWrap
        >
          {poll.description}
        </Typography>
        <PollChips poll={poll} />
      </CardContent>
    </Card>
  </Grid>
));

PollCard.displayName = "PollCard";

const PollChips = React.memo(({ poll }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
    <Chip
      size="small"
      label={`${poll._count.votes} votes`}
      variant="outlined"
    />
    <Chip
      size="small"
      label={`${poll._count.likes} likes`}
      variant="outlined"
    />
    {!poll.isPublic && <Chip size="small" label="Private" color="secondary" />}
  </Box>
));

PollChips.displayName = "PollChips";

const QuickActionsSection = React.memo(() => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          component={Link}
          href={ROUTES.createPoll}
          variant="outlined"
          fullWidth
          startIcon={<Add />}
        >
          Create Poll
        </Button>
        <Button
          component={Link}
          href={ROUTES.polls}
          variant="outlined"
          fullWidth
          startIcon={<PollIcon />}
        >
          Browse Polls
        </Button>
      </Box>
    </CardContent>
  </Card>
));

QuickActionsSection.displayName = "QuickActionsSection";

export default Dashboard;
