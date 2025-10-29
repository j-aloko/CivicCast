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

const dashboardStreams = new Set();

export function registerDashboard(controller) {
  dashboardStreams.add(controller);
  controller.signal?.addEventListener?.("abort", () => {
    dashboardStreams.delete(controller);
  });
}

export async function broadcastToDashboard() {
  if (dashboardStreams.size === 0) return;

  const { PollService } = await import("@/lib/db/services/poll-service");
  const polls = await PollService.getPolls(1, 6);

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

  try {
    [results, likeCount] = await Promise.all([
      PollService.getPollResults(pollId),
      LikeService.getLikeCount(pollId),
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

  let sent = 0;

  // Send personalized data to each client
  Array.from(set).forEach(async (ctrl) => {
    try {
      if (ctrl.desiredSize === null) return;

      const clientUserId = ctrl.userId;

      let pollData;
      let userLiked = false;
      let userVote = null;

      // If this client is the SAME USER as the one who triggered the action
      if (
        clientUserId &&
        triggeringUserId &&
        clientUserId === triggeringUserId
      ) {
        // Same user across browsers - use the triggering user's full data
        try {
          pollData = await PollService.getPoll(pollId, triggeringUserId);
          const userLikeRecord = await LikeService.getUserLike(
            pollId,
            triggeringUserId
          );
          userLiked = !!userLikeRecord;
          userVote = pollData.userVote || null;
          console.log(
            `[SSE] Sending consistent data to same user ${clientUserId} across browsers`
          );
        } catch (error) {
          console.error(
            `[SSE] Failed to get consistent data for user ${clientUserId}:`,
            error
          );
          pollData = await PollService.getPoll(pollId);
        }
      } else {
        // Different user or no user context - get their own personalized data
        try {
          pollData = await PollService.getPoll(pollId, clientUserId);
          if (clientUserId) {
            const userLikeRecord = await LikeService.getUserLike(
              pollId,
              clientUserId
            );
            userLiked = !!userLikeRecord;
            userVote = pollData.userVote || null;
          }
        } catch (error) {
          console.error(
            `[SSE] Failed to get personalized data for user ${clientUserId}:`,
            error
          );
          pollData = await PollService.getPoll(pollId);
        }
      }

      const payload = {
        data: {
          likeCount,
          poll: pollData,
          results: formattedResults,
          timestamp: new Date().toISOString(),
          totalVotes: formattedResults.totalVotes,
          userLiked,
          userVote,
        },
        success: true,
      };

      const message = `data: ${JSON.stringify(payload)}\n\n`;
      ctrl.enqueue(new TextEncoder().encode(message));
      sent++;
    } catch (error) {
      console.error(`[SSE] Error sending to client:`, error);
      unregisterStream(pollId, ctrl);
    }
  });

  console.log(
    `[SSE] Broadcast → ${sent} clients (poll: ${pollId}, triggering user: ${triggeringUserId})`
  );
}
