const activeStreams = new Map();

export function registerStream(pollId, controller) {
  if (!activeStreams.has(pollId)) activeStreams.set(pollId, new Set());
  activeStreams.get(pollId).add(controller);

  controller.signal?.addEventListener?.("abort", () => {
    unregisterStream(pollId, controller);
  });
}

export function unregisterStream(pollId, controller) {
  const set = activeStreams.get(pollId);
  if (!set) return;
  set.delete(controller);
  if (set.size === 0) activeStreams.delete(pollId);
}

const dashboardStreams = new Set(); // Add this at top

export function registerDashboard(controller) {
  dashboardStreams.add(controller);
  controller.signal?.addEventListener?.("abort", () => {
    dashboardStreams.delete(controller);
  });
}

export async function broadcastToDashboard() {
  if (dashboardStreams.size === 0) return;

  const { PollService } = await import("@/lib/db/services/poll-service");
  const polls = await PollService.getPolls(1, 6); // same as dashboard

  const payload = {
    data: { polls: polls.polls },
    success: true,
    timestamp: new Date().toISOString(),
  };

  const message = `data: ${JSON.stringify(payload)}\n\n`;
  const encoded = new TextEncoder().encode(message);

  Array.from(dashboardStreams).forEach((ctrl) => {
    try {
      if (ctrl.desiredSize !== null) ctrl.enqueue(encoded);
    } catch {
      dashboardStreams.delete(ctrl);
    }
  });
}

export async function broadcastToPoll(pollId, triggeringUserId = null) {
  const set = activeStreams.get(pollId);
  if (!set || set.size === 0) {
    console.log(`[SSE] No listeners for poll ${pollId}`);
    return;
  }

  const { PollService } = await import("@/lib/db/services/poll-service");
  const { LikeService } = await import("@/lib/db/services/like-service");

  let results;
  let likeCount;
  let poll;
  try {
    [results, likeCount, poll] = await Promise.all([
      PollService.getPollResults(pollId),
      LikeService.getLikeCount(pollId),
      PollService.getPoll(pollId),
    ]);
  } catch (err) {
    console.error("[SSE] Broadcast fetch failed:", err);
    return;
  }

  const formattedResults = {
    options: (results.options || []).map((opt) => ({
      description: opt.description,
      id: opt.id,
      image: opt.image,
      order: opt.order,
      percentage:
        results.totalVotes > 0 ? (opt.voteCount / results.totalVotes) * 100 : 0,
      text: opt.text,
      voteCount: opt.voteCount,
    })),
    totalVotes: results.totalVotes || 0,
  };

  let userLikedForTrigger;
  if (triggeringUserId) {
    const userLikeRecord = await LikeService.getUserLike(
      pollId,
      triggeringUserId
    );
    userLikedForTrigger = !!userLikeRecord;
  }

  const basePayload = {
    data: {
      likeCount,
      poll,
      results: formattedResults,
      timestamp: new Date().toISOString(),
      totalVotes: formattedResults.totalVotes,
    },
    success: true,
  };

  const message = `data: ${JSON.stringify(basePayload)}\n\n`;
  const encoded = new TextEncoder().encode(message);

  let sent = 0;

  Array.from(set).forEach((ctrl) => {
    try {
      if (ctrl.desiredSize === null) return;
      const clientUserId = ctrl.userId;
      if (clientUserId && clientUserId === triggeringUserId) {
        const personalizedPayload = {
          ...basePayload,
          data: {
            ...basePayload.data,
            userLiked: userLikedForTrigger,
          },
        };
        const personalizedMessage = `data: ${JSON.stringify(personalizedPayload)}\n\n`;
        ctrl.enqueue(new TextEncoder().encode(personalizedMessage));
      } else {
        ctrl.enqueue(encoded);
      }
      sent++;
    } catch {
      unregisterStream(pollId, ctrl);
    }
  });
  console.log(`[SSE] Broadcast → ${sent} clients (poll: ${pollId})`);
}
