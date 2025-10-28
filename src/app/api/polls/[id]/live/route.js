import { getServerSession } from "next-auth/next";

import authOptions from "@/lib/auth/options";
import { LikeService } from "@/lib/db/services/like-service";
import { PollService } from "@/lib/db/services/poll-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { registerStream } from "@/lib/utils/sse-manager";

export const GET = async (req, { params }) => {
  const { id: pollId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const stream = new ReadableStream({
    start(ctrl) {
      const enc = new TextEncoder();
      ctrl.userId = userId;
      const safeEnqueue = (data) => {
        try {
          if (ctrl.desiredSize !== null) {
            ctrl.enqueue(enc.encode(data));
          }
        } catch {}
      };

      (async () => {
        try {
          const [results, likeCount, currentPoll, userLike] = await Promise.all(
            [
              PollService.getPollResults(pollId),
              LikeService.getLikeCount(pollId),
              PollService.getPoll(pollId, userId),
              userId ? LikeService.getUserLike(pollId, userId) : null,
            ]
          );

          const init = ApiResponse.success({
            likeCount,
            poll: currentPoll,
            results,
            timestamp: new Date().toISOString(),
            totalVotes: results.totalVotes,
            userLiked: !!userLike,
          });

          safeEnqueue(`data: ${JSON.stringify(init)}\n\n`);
        } catch {
          safeEnqueue(
            `data: ${JSON.stringify(ApiResponse.error("Init failed"))}\n\n`
          );
        }
      })();

      // Register controller
      registerStream(pollId, ctrl);

      const heartbeat = setInterval(() => {
        safeEnqueue(`data: {"heartbeat":true}\n\n`);
      }, 15_000);

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
};
