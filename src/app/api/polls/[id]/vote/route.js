import { getServerSession } from "next-auth/next";

import authOptions from "@/lib/auth/options";
import { NotificationService } from "@/lib/db/services/notification-service";
import { PollService } from "@/lib/db/services/poll-service";
import { VoteService } from "@/lib/db/services/vote-service";
import { ApiResponse, handleApiError } from "@/lib/utils/api-response";
import { broadcastToDashboard, broadcastToPoll } from "@/lib/utils/sse-manager";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(ApiResponse.unauthorized(), { status: 401 });
  }
  const { id: pollId } = await params;
  const userId = session.user.id;
  try {
    const vote = await VoteService.getUserVote(pollId, userId);
    return Response.json(ApiResponse.success({ vote }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(ApiResponse.unauthorized(), { status: 401 });
  }
  const { id: pollId } = await params;
  const userId = session.user.id;
  try {
    const body = await req.json();
    const { optionId } = body;
    if (!optionId || typeof optionId !== "string") {
      return Response.json(
        ApiResponse.validationError({
          optionId: "Valid option ID is required",
        }),
        { status: 422 }
      );
    }
    const vote = await VoteService.submitVote(pollId, optionId, userId);
    const poll = await PollService.getPoll(pollId, userId);

    if (poll.creatorId !== userId) {
      await NotificationService.createNotification({
        actorId: userId,
        pollId,
        type: "vote",
        userId: poll.creatorId,
      });
    }

    await broadcastToPoll(pollId, userId);
    await broadcastToDashboard();

    return Response.json(
      ApiResponse.success(
        {
          poll,
          vote,
        },
        "Vote submitted successfully"
      ),
      { status: 200 }
    );
  } catch (error) {
    if (
      error.message.includes("Poll not found") ||
      error.message.includes("Invalid option")
    ) {
      return Response.json(ApiResponse.notFound(error.message), {
        status: 404,
      });
    }
    if (error.message.includes("closed")) {
      return Response.json(ApiResponse.error(error.message, 400), {
        status: 400,
      });
    }
    return handleApiError(error);
  }
}
