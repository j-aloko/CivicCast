"use client";

import React, { useEffect } from "react";

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
import { usePolls } from "@/hooks/usePolls";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";

function Dashboard({ session }) {
  useRealtimeDashboard();
  const { polls, isLoading, getPolls } = usePolls();

  useEffect(() => {
    getPolls({ limit: 6, page: 1 });
  }, [getPolls]);

  const stats = [
    {
      color: "primary",
      icon: <PollIcon />,
      label: "Total Polls",
      value: polls.length,
    },
    {
      color: "secondary",
      icon: <TrendingUp />,
      label: "Total Votes",
      value: polls.reduce((sum, poll) => sum + poll._count.votes, 0),
    },
    {
      color: "accent",
      icon: <Favorite />,
      label: "Total Likes",
      value: polls.reduce((sum, poll) => sum + poll._count.likes, 0),
    },
  ];

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
      {/* Welcome Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {session?.user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create and manage your polls, track engagement, and see real-time
          results.
        </Typography>
      </Box>

      {/* Stats Cards */}
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
                    {stat.icon}
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

      {/* Quick Actions */}
      <Grid container spacing={4}>
        <Grid size={{ sm: 8, xs: 12 }}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h2">
              Recent Polls
            </Typography>
            <Button
              component={Link}
              href={ROUTES.createPoll}
              variant="contained"
              startIcon={<Add />}
            >
              Create New Poll
            </Button>
          </Box>

          {polls.length === 0 ? (
            <Card>
              <CardContent sx={{ py: 6, textAlign: "center" }}>
                <PollIcon
                  sx={{ color: "text.secondary", fontSize: 64, mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No polls yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
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
          ) : (
            <Grid container spacing={2}>
              {polls.slice(0, 6).map((poll) => (
                <Grid size={{ sm: 6, xs: 12 }} key={poll.id}>
                  <Card
                    component={Link}
                    href={`${ROUTES.polls}/${poll.id}`}
                    sx={{
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                      textDecoration: "none",
                      transition: "transform 0.2s",
                    }}
                  >
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
                        {!poll.isPublic && (
                          <Chip
                            size="small"
                            label="Private"
                            color="secondary"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid size={{ md: 4, xs: 12 }}>
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
