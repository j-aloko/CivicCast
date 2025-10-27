import { getServerSession } from "next-auth/next";

import { LikeService } from "@/lib/db/services/like-service";

import { authOptions } from "../../../../../lib/auth/options";
import { PollService } from "../../../../../lib/db/services/poll-service";
import {
  ApiResponse,
  handleApiError,
} from "../../../../../lib/utils/api-response";

export default async function handler(req, res) {
  const { id: pollId } = req.query;
  const session = await getServerSession(req, res, authOptions);

  try {
    if (req.method !== "GET") {
      return res
        .status(405)
        .json(ApiResponse.error(`Method ${req.method} Not Allowed`, 405));
    }

    const userId = session?.user?.id || null;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Content-Encoding", "none");

    const poll = await PollService.getPoll(pollId, userId);
    if (!poll) {
      res.write(`data: ${JSON.stringify(ApiResponse.notFound())}\n\n`);
      res.end();
      return null;
    }

    const results = await PollService.getPollResults(pollId);
    const likeCount = await LikeService.getLikeCount(pollId);

    res.write(
      `data: ${JSON.stringify(
        ApiResponse.success({
          likeCount,
          poll,
          results,
        })
      )}\n\n`
    );

    // Set up polling for updates (in production, use WebSockets)
    const interval = setInterval(async () => {
      try {
        const updatedResults = await PollService.getPollResults(pollId);
        const updatedLikeCount = await LikeService.getLikeCount(pollId);

        res.write(
          `data: ${JSON.stringify(
            ApiResponse.success({
              likeCount: updatedLikeCount,
              results: updatedResults,
            })
          )}\n\n`
        );
      } catch (error) {
        console.error("Live update error:", error);
      }
    }, 3000); // Update every 3 seconds

    // Clean up on client disconnect
    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });

    return undefined;
  } catch (error) {
    return handleApiError(error, res);
  }
}
