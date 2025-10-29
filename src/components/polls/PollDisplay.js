"use client";

import React from "react";

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

import LikeButtonContainer from "@/containers/like-button-container/LikeButtonContainer";

const PollHeader = React.memo(({ currentPoll, isConnected, onRefreshPoll }) => (
  <Box
    sx={{
      alignItems: "flex-start",
      display: "flex",
      justifyContent: "space-between",
      mb: 2,
    }}
  >
    <Box sx={{ flex: 1 }}>
      <Box sx={{ alignItems: "center", display: "flex", gap: 1, mb: 1 }}>
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
              sx={{
                "& .MuiChip-icon": {
                  marginLeft: 0,
                  marginRight: "4px",
                },
                "& .MuiChip-label": {
                  paddingTop: "2.5px",
                },
                padding: "0 8px",
              }}
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
              sx={{
                "& .MuiChip-icon": {
                  marginLeft: 0,
                  marginRight: "4px",
                },
                "& .MuiChip-label": {
                  paddingTop: "2.5px",
                },
                padding: "0 8px",
              }}
            />
          </Tooltip>
        )}
      </Box>
      {currentPoll.description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {currentPoll.description}
        </Typography>
      )}
    </Box>

    <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
      <LikeButtonContainer pollId={currentPoll.id} isConnected />
      <Tooltip title="Refresh poll data">
        <IconButton onClick={onRefreshPoll} size="small">
          <Refresh />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
));

PollHeader.displayName = "PollHeader";

const PollStats = React.memo(
  ({ currentPoll, totalVotes, hasVoted, isPollClosed }) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
      <Chip label={`${totalVotes} votes`} variant="outlined" size="small" />
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
  )
);

PollStats.displayName = "PollStats";

const ResultsToggle = React.memo(({ showResults, onResultsToggle }) => (
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
            onClick={() => onResultsToggle(true)}
            variant={showResults ? "contained" : "outlined"}
            sx={{
              "&:hover": {
                backgroundColor: showResults ? "primary.dark" : "action.hover",
              },
              backgroundColor: showResults ? "primary.main" : "transparent",
              minWidth: 120,
            }}
          >
            Results
          </Button>
          <Button
            startIcon={<VisibilityOff />}
            onClick={() => onResultsToggle(false)}
            variant={!showResults ? "contained" : "outlined"}
            sx={{
              "&:hover": {
                backgroundColor: !showResults ? "primary.dark" : "action.hover",
              },
              backgroundColor: !showResults ? "primary.main" : "transparent",
              minWidth: 120,
            }}
          >
            Vote Only
          </Button>
        </ButtonGroup>
      </Box>
    </CardContent>
  </Card>
));

ResultsToggle.displayName = "ResultsToggle";

const OptionResult = React.memo(({ option, percentage, isUserVote }) => (
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
          <Chip label="Your vote" size="small" color="primary" sx={{ ml: 1 }} />
        )}
      </Box>
      <Typography variant="body1" fontWeight="bold" component="span">
        {percentage.toFixed(1)}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={percentage}
      sx={{
        "& .MuiLinearProgress-bar": {
          backgroundColor: isUserVote ? "primary.main" : "accent.main",
          borderRadius: 4,
          transition: "transform 0.5s ease-in-out",
        },
        backgroundColor: "grey.200",
        borderRadius: 4,
        height: 8,
      }}
    />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
      {option.voteCount} votes
    </Typography>
  </Box>
));

OptionResult.displayName = "OptionResult";

// Extracted Voting Interface Component
const VotingInterface = React.memo(
  ({
    currentPoll,
    canVote,
    selectedOption,
    isVoting,
    hasVoted,
    onOptionSelect,
    onVote,
  }) => {
    if (!canVote) return null;

    const getVoteButtonText = () => {
      if (isVoting) return "Voting...";
      if (hasVoted) return "Change Vote";
      return "Submit Vote";
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Cast Your Vote
        </Typography>
        {currentPoll.options.map((option) => (
          <Button
            key={option.id}
            fullWidth
            variant={selectedOption === option.id ? "contained" : "outlined"}
            onClick={() => onOptionSelect(option.id)}
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
          onClick={onVote}
          disabled={!selectedOption || isVoting}
          startIcon={isVoting ? <CircularProgress size={20} /> : <HowToVote />}
          sx={{ mt: 2 }}
        >
          {getVoteButtonText()}
        </Button>
      </Box>
    );
  }
);

VotingInterface.displayName = "VotingInterface";

// Main PollDisplay Component
function PollDisplay({
  currentPoll,
  isConnected,
  isLoading,
  isAuthenticated,
  isPollClosed,
  canVote,
  hasVoted,
  showResults,
  selectedOption,
  isVoting,
  totalVotes,
  onVote,
  onOptionSelect,
  onResultsToggle,
  onRefreshPoll,
}) {
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
              onClick={onRefreshPoll}
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
          <PollHeader
            currentPoll={currentPoll}
            isConnected={isConnected}
            onRefreshPoll={onRefreshPoll}
          />

          <PollStats
            currentPoll={currentPoll}
            totalVotes={totalVotes}
            hasVoted={hasVoted}
            isPollClosed={isPollClosed}
          />

          <Typography variant="body2" color="text.secondary">
            Created by {currentPoll.creator?.name || "Unknown"} •{" "}
            {new Date(currentPoll.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      <ResultsToggle
        showResults={showResults}
        onResultsToggle={onResultsToggle}
      />

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
              You voted on this poll.
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
                    sx={{
                      "& .MuiChip-icon": {
                        marginLeft: 0,
                        marginRight: "4px",
                      },
                      "& .MuiChip-label": {
                        paddingTop: "2.5px",
                      },
                      padding: "0 8px",
                    }}
                  />
                )}
              </Box>

              {currentPoll.options.map((option) => {
                const percentage =
                  totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                const isUserVote = currentPoll.userVote?.optionId === option.id;

                return (
                  <OptionResult
                    key={option.id}
                    option={option}
                    percentage={percentage}
                    totalVotes={totalVotes}
                    isUserVote={isUserVote}
                  />
                );
              })}
              <Divider sx={{ my: 2 }} />
            </Box>
          )}

          <VotingInterface
            currentPoll={currentPoll}
            canVote={canVote}
            selectedOption={selectedOption}
            isVoting={isVoting}
            hasVoted={hasVoted}
            onOptionSelect={onOptionSelect}
            onVote={onVote}
          />

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
                : "You voted on this poll"}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default React.memo(PollDisplay);
