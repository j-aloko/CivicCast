import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../../lib/auth/options";
import { LikeService } from "../../../../lib/db/services/like-service";
import { NotificationService } from "../../../../lib/db/services/notification-service";
import { PollService } from "../../../../lib/db/services/poll-service";
import {
  ApiResponse,
  handleApiError,
} from "../../../../lib/utils/api-response";
import { rateLimit } from "../../../../lib/utils/rate-limit";

const limiter = rateLimit({ limit: 10, windowMs: 60000 });

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

  const { id: pollId } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json(ApiResponse.unauthorized());
  }

  try {
    switch (req.method) {
      case "POST":
        return await handleToggleLike(req, res, pollId, session);
      case "GET":
        return await handleGetLikeStatus(req, res, pollId, session);
      default:
        return res
          .setHeader("Allow", ["POST", "GET"])
          .status(405)
          .json(ApiResponse.error(`Method ${req.method} Not Allowed`, 405));
    }
  } catch (error) {
    return handleApiError(error, res);
  }
}

async function handleToggleLike(req, res, pollId, session) {
  const userId = session.user.id;

  // Check if poll exists
  const poll = await PollService.getPoll(pollId);
  if (!poll) {
    return res.status(404).json(ApiResponse.notFound("Poll not found"));
  }

  const result = await LikeService.toggleLike(pollId, userId);

  // Create notification for poll creator (if not liking own poll)
  if (result.liked && poll.creatorId !== userId) {
    await NotificationService.createNotification({
      actorId: userId,
      pollId,
      type: "like",
      userId: poll.creatorId,
    });
  }

  const likeCount = await LikeService.getLikeCount(pollId);

  return res.status(200).json(
    ApiResponse.success(
      {
        likeCount,
        liked: result.liked,
      },
      result.liked ? "Poll liked" : "Poll unliked"
    )
  );
}

async function handleGetLikeStatus(req, res, pollId, session) {
  const userId = session.user.id;

  const like = await LikeService.getUserLike(pollId, userId);
  const likeCount = await LikeService.getLikeCount(pollId);

  res.status(200).json(
    ApiResponse.success({
      likeCount,
      liked: !!like,
    })
  );
}
