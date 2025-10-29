"use client";

import React, { useEffect, useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import PollList from "@/components/polls/PollList";
import { usePolls } from "@/hooks/usePolls";
import {
  subscribeToDashboard,
  unsubscribeFromDashboard,
} from "@/services/redux/slices/realtimeSlice";

function PollListContainer() {
  const dispatch = useDispatch();
  const { polls, pagination, isLoading, getPolls } = usePolls();

  const liveUpdates = useSelector((state) => state.realtime.liveUpdates);
  const isDashboardConnected = useSelector(
    (state) => state.realtime.dashboardConnected
  );

  const [filters, setFilters] = useState({
    limit: 12,
    page: 1,
    search: "",
    sort: "newest",
  });

  // Subscribe to dashboard updates when component mounts
  useEffect(() => {
    dispatch(subscribeToDashboard());

    return () => {
      dispatch(unsubscribeFromDashboard());
    };
  }, [dispatch]);

  const updatedPolls = React.useMemo(() => {
    if (!polls.length) return polls;

    return polls.map((poll) => {
      const liveUpdate = liveUpdates[poll.id];
      if (liveUpdate) {
        return {
          ...poll,
          _count: {
            ...poll._count,
            ...(liveUpdate.data?.poll?._count || {}),
            likes: liveUpdate.data?.likeCount ?? poll._count.likes,
          },
          options: poll.options.map((opt) => {
            const liveOption = liveUpdate.data?.results?.options?.find(
              (o) => o.id === opt.id
            );
            return liveOption ? { ...opt, ...liveOption } : opt;
          }),
        };
      }
      return poll;
    });
  }, [polls, liveUpdates]);

  const handlePageChange = useCallback((event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  }, []);

  const handleSortChange = useCallback((event) => {
    setFilters((prev) => ({ ...prev, page: 1, sort: event.target.value }));
  }, []);

  const handleSearchChange = useCallback((event) => {
    setFilters((prev) => ({ ...prev, page: 1, search: event.target.value }));
  }, []);

  useEffect(() => {
    getPolls(filters);
  }, [filters, getPolls]);

  return (
    <PollList
      polls={updatedPolls}
      pagination={pagination}
      isLoading={isLoading}
      filters={filters}
      isConnected={isDashboardConnected}
      onPageChange={handlePageChange}
      onSortChange={handleSortChange}
      onSearchChange={handleSearchChange}
    />
  );
}

export default React.memo(PollListContainer);
