"use client";

import React, { useEffect, useState } from "react";

import { HowToVote, Visibility, VisibilityOff } from "@mui/icons-material";
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
} from "@mui/material";

import { usePolls } from "@/hooks/usePolls";

import LikeButton from "./LikeButton";

function PollDisplay({ pollId }) {
  const { currentPoll, getPoll, voteOnPoll, isAuthenticated } = usePolls();
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userManuallyToggledResults, setUserManuallyToggledResults] =
    useState(false);

  useEffect(() => {
    if (pollId) {
      getPoll(pollId);
    }
  }, [pollId, getPoll]);

  useEffect(() => {
    if (currentPoll) {
      const userHasVoted = !!currentPoll.userVote;
      setHasVoted(userHasVoted);

      // Only auto-show results if poll settings allow it AND user hasn't manually toggled
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
    if (!selectedOption || !isAuthenticated) return;

    try {
      await voteOnPoll(pollId, selectedOption);
      setHasVoted(true);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleResultsToggle = (show) => {
    setShowResults(show);
    setUserManuallyToggledResults(true);
  };

  const isPollClosed =
    currentPoll?.closesAt && new Date(currentPoll.closesAt) <= new Date();
  const canVote =
    isAuthenticated &&
    !isPollClosed &&
    (!hasVoted || currentPoll.settings?.allowMultiple);

  const totalVotes =
    currentPoll?.options?.reduce((sum, opt) => sum + opt.voteCount, 0) || 0;

  if (!currentPoll) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading poll...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Poll Header */}
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
              <Typography variant="h4" component="h1" gutterBottom>
                {currentPoll.question}
              </Typography>
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

            <Box sx={{ display: "flex", gap: 1 }}>
              <LikeButton pollId={pollId} />
            </Box>
          </Box>

          {/* Poll Metadata */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Chip
              label={`${totalVotes} votes`}
              variant="outlined"
              size="small"
            />
            <Chip
              label={`${currentPoll._count.likes} likes`}
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

          {/* Created By */}
          <Typography variant="body2" color="text.secondary">
            Created by {currentPoll.creator?.name || "Unknown"} •{" "}
            {new Date(currentPoll.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Results Toggle - Improved Design */}
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

      {/* Voting Section */}
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

          {/* Results Section - Always visible if toggled on */}
          {showResults && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Live Results ({totalVotes} total votes)
              </Typography>
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

          {/* Voting Interface - Always available if user can vote */}
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
                disabled={!selectedOption}
                startIcon={<HowToVote />}
                sx={{ mt: 2 }}
              >
                {hasVoted ? "Change Vote" : "Submit Vote"}
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

      {/* Comments Section */}
      {/* currentPoll.settings?.allowComments && (
        <CommentsSection pollId={pollId} />
      ) */}
    </Box>
  );
}

export default PollDisplay;
