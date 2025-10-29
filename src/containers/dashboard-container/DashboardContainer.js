"use client";

import React, { useEffect, useMemo } from "react";

import Dashboard from "@/components/dashboard/Dashboard";
import { usePolls } from "@/hooks/usePolls";
import {
  subscribeToDashboard,
  unsubscribeFromDashboard,
} from "@/services/redux/slices/realtimeSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store";

function DashboardContainer({ session }) {
  const dispatch = useAppDispatch();
  const { polls, isLoading, getPolls } = usePolls();

  const isDashboardConnected = useAppSelector(
    (state) => state.realtime.dashboardConnected
  );

  useEffect(() => {
    dispatch(subscribeToDashboard());

    return () => {
      dispatch(unsubscribeFromDashboard());
    };
  }, [dispatch]);

  useEffect(() => {
    getPolls({ limit: 6, page: 1 });
  }, [getPolls]);

  const stats = useMemo(() => {
    const totalVotes = polls.reduce((sum, poll) => sum + poll._count.votes, 0);
    const totalLikes = polls.reduce((sum, poll) => sum + poll._count.likes, 0);

    return [
      {
        color: "primary",
        icon: "poll",
        label: "Total Polls",
        value: polls.length,
      },
      {
        color: "secondary",
        icon: "trendingUp",
        label: "Total Votes",
        value: totalVotes,
      },
      {
        color: "accent",
        icon: "favorite",
        label: "Total Likes",
        value: totalLikes,
      },
    ];
  }, [polls]);

  const recentPolls = useMemo(() => polls.slice(0, 6), [polls]);

  return (
    <Dashboard
      session={session}
      stats={stats}
      polls={recentPolls}
      isLoading={isLoading}
      hasPolls={polls.length > 0}
      isDashboardConnected={isDashboardConnected}
    />
  );
}

export default React.memo(DashboardContainer);
