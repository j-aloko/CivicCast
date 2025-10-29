"use client";

import React from "react";

import {
  Poll as PollIcon,
  Favorite,
  HowToVote,
  Sort,
  Search,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Pagination,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "next/link";

import { ROUTES } from "@/constant/constant";

const PollCard = React.memo(({ poll }) => (
  <Grid size={{ lg: 4, sm: 6, xs: 12 }}>
    <Card
      component={Link}
      href={`${ROUTES.polls}/${poll.id}`}
      sx={{
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
        textDecoration: "none",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {/* Poll Question */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            display: "-webkit-box",
            lineHeight: 1.3,
            overflow: "hidden",
          }}
        >
          {poll.question}
        </Typography>

        {/* Description */}
        {poll.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              display: "-webkit-box",
              mb: 2,
              overflow: "hidden",
            }}
          >
            {poll.description}
          </Typography>
        )}

        {/* Stats */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip
            size="small"
            icon={<HowToVote />}
            label={poll._count.votes}
            variant="outlined"
          />
          <Chip
            size="small"
            icon={<Favorite />}
            label={poll._count.likes}
            variant="outlined"
          />
        </Box>

        {/* Metadata */}
        <Box
          sx={{
            borderColor: "divider",
            borderTop: 1,
            mt: "auto",
            pt: 2,
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              By {poll.creator?.name || "Unknown"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(poll.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {!poll.isPublic && (
            <Chip
              label="Private"
              color="secondary"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  </Grid>
));

PollCard.displayName = "PollCard";

const PollFilters = React.memo(({ filters, onSearchChange, onSortChange }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
    <TextField
      placeholder="Search polls..."
      value={filters.search}
      onChange={onSearchChange}
      sx={{ minWidth: 200 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "text.secondary", mr: 1 }} />
            </InputAdornment>
          ),
        },
      }}
    />

    <TextField
      select
      value={filters.sort}
      onChange={onSortChange}
      sx={{ minWidth: 150 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Sort sx={{ color: "text.secondary", mr: 1 }} />
            </InputAdornment>
          ),
        },
      }}
    >
      <MenuItem value="newest">Newest</MenuItem>
      <MenuItem value="popular">Most Popular</MenuItem>
      <MenuItem value="votes">Most Votes</MenuItem>
    </TextField>
  </Box>
));

PollFilters.displayName = "PollFilters";

const EmptyPollState = React.memo(({ hasSearch }) => (
  <Card>
    <CardContent sx={{ py: 6, textAlign: "center" }}>
      <PollIcon sx={{ color: "text.secondary", fontSize: 64, mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No polls found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {hasSearch
          ? "Try adjusting your search terms"
          : "Be the first to create a poll!"}
      </Typography>
      <Button component={Link} href={ROUTES.createPoll} variant="contained">
        Create First Poll
      </Button>
    </CardContent>
  </Card>
));

EmptyPollState.displayName = "EmptyPollState";

const PollPagination = React.memo(
  ({ pagination, currentPage, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pagination.totalPages}
          page={currentPage}
          onChange={onPageChange}
          color="primary"
        />
      </Box>
    );
  }
);

PollPagination.displayName = "PollPagination";

function PollList({
  polls,
  pagination,
  isLoading,
  filters,
  onPageChange,
  onSortChange,
  onSearchChange,
}) {
  if (isLoading && polls.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PollFilters
        filters={filters}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
      />

      {polls.length === 0 ? (
        <EmptyPollState hasSearch={!!filters.search} />
      ) : (
        <>
          <Grid container spacing={3}>
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </Grid>

          <PollPagination
            pagination={pagination}
            currentPage={filters.page}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Box>
  );
}

export default React.memo(PollList);
