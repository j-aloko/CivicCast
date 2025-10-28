"use client";

import React, { useEffect, useState } from "react";

import {
  HowToVote,
  Visibility,
  VisibilityOff,
  LiveTv,
  Refresh,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Alert,
  ButtonGroup,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import { usePolls } from "@/hooks/usePolls";
import { useRealtime } from "@/hooks/useRealtime";

import LikeButton from "./LikeButton";

function PollDisplay({ pollId }) {
  const { currentPoll, getPoll, voteOnPoll, isAuthenticated, isLoading } =
    usePolls();
  const { isConnected } = useRealtime(pollId);

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userManuallyToggledResults, setUserManuallyToggledResults] =
    useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (pollId) {
      getPoll(pollId);
    }
  }, [pollId, getPoll]);

  useEffect(() => {
    if (currentPoll) {
      const userHasVoted = !!currentPoll.userVote;
      setHasVoted(userHasVoted);

      if (!userManuallyToggledResults) {
        const shouldShowResults =
          currentPoll.settings?.showResults || userHasVoted;
        setShowResults(shouldShowResults);
      }

      if (currentPoll.userVote) {
        setSelectedOption(currentPoll.userVote.optionId);
      }
    }
  }, [currentPoll, userManuallyToggledResults]);

  const handleVote = async () => {
    if (!selectedOption || !isAuthenticated || isVoting) return;
    setIsVoting(true);
    try {
      await voteOnPoll(pollId, selectedOption);
      setHasVoted(true);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const getVoteButtonText = () => {
    if (isVoting) return "Voting...";
    if (hasVoted) return "Change Vote";
    return "Submit Vote";
  };

  const handleResultsToggle = (show) => {
    setShowResults(show);
    setUserManuallyToggledResults(true);
  };

  const handleRefreshPoll = () => {
    getPoll(pollId);
  };

  const isPollClosed =
    currentPoll?.closesAt && new Date(currentPoll.closesAt) <= new Date();
  const canVote =
    isAuthenticated &&
    !isPollClosed &&
    (!hasVoted || currentPoll?.settings?.allowMultiple);

  const totalVotes =
    currentPoll?.options?.reduce((sum, opt) => sum + opt.voteCount, 0) || 0;

  if (isLoading && !currentPoll) {
    return (
      <Card>
        <CardContent sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading poll...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!currentPoll) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            Poll not found or you don&apos;t have permission to view it.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {!isConnected && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRefreshPoll}
              startIcon={<Refresh />}
            >
              Refresh
            </Button>
          }
        >
          Live updates disconnected. Results may not be current.
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              alignItems: "flex-start",
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ alignItems: "center", display: "flex", gap: 1, mb: 1 }}
              >
                <Typography variant="h4" component="h1">
                  {currentPoll.question}
                </Typography>
                {isConnected && (
                  <Tooltip title="Live updates active">
                    <Chip
                      icon={<LiveTv />}
                      label="LIVE"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </Tooltip>
                )}
                {!isConnected && (
                  <Tooltip title="Live updates disconnected">
                    <Chip
                      icon={<LiveTv />}
                      label="OFFLINE"
                      color="default"
                      size="small"
                      variant="outlined"
                    />
                  </Tooltip>
                )}
              </Box>

              {currentPoll.description && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {currentPoll.description}
                </Typography>
              )}
            </Box>

            <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
              <LikeButton pollId={pollId} />
              <Tooltip title="Refresh poll data">
                <IconButton onClick={handleRefreshPoll} size="small">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Chip
              label={`${totalVotes} votes`}
              variant="outlined"
              size="small"
            />
            <Chip
              label={`${currentPoll._count?.likes || 0} likes`}
              variant="outlined"
              size="small"
            />
            {!currentPoll.isPublic && (
              <Chip label="Private" color="secondary" size="small" />
            )}
            {currentPoll.closesAt && (
              <Chip
                label={
                  isPollClosed
                    ? `Closed ${new Date(currentPoll.closesAt).toLocaleDateString()}`
                    : `Closes ${new Date(currentPoll.closesAt).toLocaleDateString()}`
                }
                color={isPollClosed ? "error" : "primary"}
                size="small"
                variant="outlined"
              />
            )}
            {hasVoted && <Chip label="Voted" color="success" size="small" />}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Created by {currentPoll.creator?.name || "Unknown"} •{" "}
            {new Date(currentPoll.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="div">
              View Options
            </Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button
                startIcon={<Visibility />}
                onClick={() => handleResultsToggle(true)}
                variant={showResults ? "contained" : "outlined"}
                sx={{
                  "&:hover": {
                    backgroundColor: showResults
                      ? "primary.dark"
                      : "action.hover",
                  },
                  backgroundColor: showResults ? "primary.main" : "transparent",
                  minWidth: 120,
                }}
              >
                Results
              </Button>
              <Button
                startIcon={<VisibilityOff />}
                onClick={() => handleResultsToggle(false)}
                variant={!showResults ? "contained" : "outlined"}
                sx={{
                  "&:hover": {
                    backgroundColor: !showResults
                      ? "primary.dark"
                      : "action.hover",
                  },
                  backgroundColor: !showResults
                    ? "primary.main"
                    : "transparent",
                  minWidth: 120,
                }}
              >
                Vote Only
              </Button>
            </ButtonGroup>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {!isAuthenticated && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please sign in to vote on this poll.
            </Alert>
          )}

          {isPollClosed && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              This poll has closed. Voting is no longer allowed.
            </Alert>
          )}

          {hasVoted && !currentPoll.settings?.allowMultiple && (
            <Alert severity="info" sx={{ mb: 2 }}>
              You have already voted on this poll.
            </Alert>
          )}

          {showResults && (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ alignItems: "center", display: "flex", gap: 1, mb: 2 }}
              >
                <Typography variant="h6">
                  Live Results ({totalVotes} total votes)
                </Typography>
                {isConnected && (
                  <Chip
                    icon={<LiveTv />}
                    label="LIVE"
                    size="small"
                    color="success"
                  />
                )}
              </Box>

              {currentPoll.options.map((option) => {
                const percentage =
                  totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                const isUserVote = currentPoll.userVote?.optionId === option.id;

                return (
                  <Box key={option.id} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ alignItems: "center", display: "flex" }}>
                        <Typography variant="body1" component="span">
                          {option.text}
                        </Typography>
                        {isUserVote && (
                          <Chip
                            label="Your vote"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        component="span"
                      >
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: isUserVote
                            ? "primary.main"
                            : "accent.main",
                          borderRadius: 4,
                          transition: "transform 0.5s ease-in-out",
                        },
                        backgroundColor: "grey.200",
                        borderRadius: 4,
                        height: 8,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {option.voteCount} votes
                    </Typography>
                  </Box>
                );
              })}
              <Divider sx={{ my: 2 }} />
            </Box>
          )}

          {canVote && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Cast Your Vote
              </Typography>
              {currentPoll.options.map((option) => (
                <Button
                  key={option.id}
                  fullWidth
                  variant={
                    selectedOption === option.id ? "contained" : "outlined"
                  }
                  onClick={() => setSelectedOption(option.id)}
                  disabled={isVoting}
                  sx={{
                    justifyContent: "flex-start",
                    mb: 1,
                    py: 1.5,
                    textAlign: "left",
                  }}
                >
                  {option.text}
                </Button>
              ))}

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleVote}
                disabled={!selectedOption || isVoting}
                startIcon={
                  isVoting ? <CircularProgress size={20} /> : <HowToVote />
                }
                sx={{ mt: 2 }}
              >
                {getVoteButtonText()}
              </Button>
            </Box>
          )}

          {/* Message when user cannot vote */}
          {!canVote && isAuthenticated && !isPollClosed && hasVoted && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ py: 2 }}
            >
              {currentPoll.settings?.allowMultiple
                ? "Select an option above to vote again"
                : "You have already voted on this poll"}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default PollDisplay;
