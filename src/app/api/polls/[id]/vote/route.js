import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../../../lib/auth/options";
import { NotificationService } from "../../../../../lib/db/services/notification-service";
import { PollService } from "../../../../../lib/db/services/poll-service";
import { VoteService } from "../../../../../lib/db/services/vote-service";
import {
  ApiResponse,
  handleApiError,
} from "../../../../../lib/utils/api-response";
import { rateLimit } from "../../../../../lib/utils/rate-limit";

const limiter = rateLimit({ limit: 5, windowMs: 60000 });

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
        return await handleSubmitVote(req, res, pollId, session);
      case "GET":
        return await handleGetUserVote(req, res, pollId, session);
      default:
        res.setHeader("Allow", ["POST", "GET"]);
        return res
          .status(405)
          .json(ApiResponse.error(`Method ${req.method} Not Allowed`, 405));
    }
  } catch (error) {
    return handleApiError(error, res);
  }
}

async function handleSubmitVote(req, res, pollId, session) {
  const { optionId } = req.body;
  const userId = session.user.id;

  // Validate optionId
  if (!optionId || typeof optionId !== "string") {
    return res
      .status(422)
      .json(
        ApiResponse.validationError({ optionId: "Valid option ID is required" })
      );
  }

  try {
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

    return res.status(200).json(
      ApiResponse.success(
        {
          poll,
          vote,
        },
        "Vote submitted successfully"
      )
    );
  } catch (error) {
    if (
      error.message.includes("Poll not found") ||
      error.message.includes("Invalid option")
    ) {
      return res.status(404).json(ApiResponse.notFound(error.message));
    }
    if (error.message.includes("closed")) {
      return res.status(400).json(ApiResponse.error(error.message, 400));
    }
    return handleApiError(error, res);
  }
}

async function handleGetUserVote(req, res, pollId, session) {
  const userId = session.user.id;

  try {
    const vote = await VoteService.getUserVote(pollId, userId);
    return res.status(200).json(ApiResponse.success({ vote }));
  } catch (error) {
    return handleApiError(error, res);
  }
}
