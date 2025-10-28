import { useEffect } from "react";

import { updatePollInList } from "@/services/redux/slices/pollsSlice";
import { useAppDispatch } from "@/services/redux/store";

export function useRealtimeDashboard() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const eventSource = new EventSource("/api/dashboard/live");

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.success && data.data.polls) {
          data.data.polls.forEach((poll) => {
            dispatch(
              updatePollInList({
                pollId: poll.id,
                updates: {
                  likeCount: poll._count.likes,
                  results: {
                    options: poll.options.map((o) => ({
                      id: o.id,
                      percentage: o.percentage,
                      voteCount: o.voteCount,
                    })),
                    totalVotes: poll._count.votes,
                  },
                },
              })
            );
          });
        }
      } catch (err) {
        console.error("Dashboard SSE error:", err);
      }
    };

    eventSource.onerror = () => {
      console.error("Dashboard SSE disconnected");
      eventSource.close();
      setTimeout(() => {}, 5000);
    };

    return () => eventSource.close();
  }, [dispatch]);
}
