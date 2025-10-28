import { getServerSession } from "next-auth/next";

import authOptions from "@/lib/auth/options";
import { LikeService } from "@/lib/db/services/like-service";
import { NotificationService } from "@/lib/db/services/notification-service";
import { PollService } from "@/lib/db/services/poll-service";
import { ApiResponse, handleApiError } from "@/lib/utils/api-response";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(ApiResponse.unauthorized(), { status: 401 });
  }
  const { id: pollId } = params;
  try {
    const like = await LikeService.getUserLike(pollId, session.user.id);
    const likeCount = await LikeService.getLikeCount(pollId);

    return Response.json(
      ApiResponse.success({
        likeCount,
        liked: !!like,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(ApiResponse.unauthorized(), { status: 401 });
  }
  const { id: pollId } = params;
  const userId = session.user.id;
  try {
    const poll = await PollService.getPoll(pollId);
    if (!poll) {
      return Response.json(ApiResponse.notFound("Poll not found"), {
        status: 404,
      });
    }
    const result = await LikeService.toggleLike(pollId, userId);
    if (result.liked && poll.creatorId !== userId) {
      await NotificationService.createNotification({
        actorId: userId,
        pollId,
        type: "like",
        userId: poll.creatorId,
      });
    }
    const likeCount = await LikeService.getLikeCount(pollId);
    return Response.json(
      ApiResponse.success(
        {
          likeCount,
          liked: result.liked,
        },
        result.liked ? "Poll liked" : "Poll unliked"
      )
    );
  } catch (error) {
    return handleApiError(error);
  }
}
