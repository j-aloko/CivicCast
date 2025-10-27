import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../../lib/auth/options";
import { NotificationService } from "../../../../lib/db/services/notification-service";
import { PollService } from "../../../../lib/db/services/poll-service";
import { VoteService } from "../../../../lib/db/services/vote-service";
import {
  ApiResponse,
  handleApiError,
} from "../../../../lib/utils/api-response";
import { rateLimit } from "../../../../lib/utils/rate-limit";
import { validateVoteData } from "../../../../lib/utils/validation";

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
        return res
          .setHeader("Allow", ["POST", "GET"])
          .status(405)
          .json(ApiResponse.error(`Method ${req.method} Not Allowed`, 405));
    }
  } catch (error) {
    return handleApiError(error, res);
  }
}

async function handleSubmitVote(req, res, pollId, session) {
  const { option } = req.body;
  const userId = session.user.id;

  // Get poll for validation
  const poll = await PollService.getPoll(pollId);
  if (!poll) {
    return res.status(404).json(ApiResponse.notFound("Poll not found"));
  }

  // Validate vote data
  const validation = validateVoteData({ option }, poll);
  if (!validation.isValid) {
    return res.status(422).json(ApiResponse.validationError(validation.errors));
  }

  // Submit vote
  const vote = await VoteService.submitVote(pollId, userId, option);

  // Create notification for poll creator (if not voting on own poll)
  if (poll.creatorId !== userId) {
    await NotificationService.createNotification({
      actorId: userId,
      pollId,
      type: "vote",
      userId: poll.creatorId,
    });
  }

  const results = await PollService.getPollResults(pollId);
  return res.status(200).json(
    ApiResponse.success(
      {
        results,
        vote,
      },
      "Vote submitted successfully"
    )
  );
}

async function handleGetUserVote(req, res, pollId, session) {
  const userId = session.user.id;

  const vote = await VoteService.getUserVote(pollId, userId);

  res.status(200).json(ApiResponse.success({ vote }));
}
