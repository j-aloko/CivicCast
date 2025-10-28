"use client";

import React, { useEffect, useState } from "react";

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
import { usePolls } from "@/hooks/usePolls";

function PollList() {
  const { polls, pagination, isLoading, getPolls } = usePolls();
  const [filters, setFilters] = useState({
    limit: 12,
    page: 1,
    search: "",
    sort: "newest",
  });

  useEffect(() => {
    getPolls(filters);
  }, [filters, getPolls]);

  const handlePageChange = (event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const handleSortChange = (event) => {
    setFilters((prev) => ({ ...prev, page: 1, sort: event.target.value }));
  };

  const handleSearchChange = (event) => {
    setFilters((prev) => ({ ...prev, page: 1, search: event.target.value }));
  };

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
      {/* Filters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <TextField
          placeholder="Search polls..."
          value={filters.search}
          onChange={handleSearchChange}
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
          onChange={handleSortChange}
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

      {/* Polls Grid */}
      {polls.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <PollIcon sx={{ color: "text.secondary", fontSize: 64, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No polls found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filters.search
                ? "Try adjusting your search terms"
                : "Be the first to create a poll!"}
            </Typography>
            <Button
              component={Link}
              href={ROUTES.createPoll}
              variant="contained"
            >
              Create First Poll
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {polls.map((poll) => (
              <Grid size={{ lg: 4, sm: 6, xs: 12 }} key={poll.id}>
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
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
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
            ))}
          </Grid>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={filters.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default PollList;
