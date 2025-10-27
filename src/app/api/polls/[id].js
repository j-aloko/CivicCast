import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../lib/auth/options";
import { PollService } from "../../../lib/db/services/poll-service";
import { ApiResponse, handleApiError } from "../../../lib/utils/api-response";
import { rateLimit } from "../../../lib/utils/rate-limit";
import { validatePollData } from "../../../lib/utils/validation";

const limiter = rateLimit({ limit: 10, windowMs: 60000 });

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  try {
    switch (req.method) {
      case "GET":
        await handleGetPoll(req, res, id, session);
        break;
      case "PUT":
        await handleUpdatePoll(req, res, id, session);
        break;
      case "DELETE":
        await handleDeletePoll(req, res, id, session);
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res
          .status(405)
          .json(ApiResponse.error(`Method ${req.method} Not Allowed`, 405));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

async function handleGetPoll(req, res, pollId, session) {
  const userId = session?.user?.id || null;

  // Record view
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];

  await PollService.recordPollView(pollId, userId, ipAddress, userAgent);

  const poll = await PollService.getPoll(pollId, userId);

  if (!poll) {
    return res.status(404).json(ApiResponse.notFound("Poll not found"));
  }

  return res.status(200).json(ApiResponse.success(poll));
}

async function handleUpdatePoll(req, res, pollId, session) {
  if (!session) {
    return res.status(401).json(ApiResponse.unauthorized());
  }

  const { question, description, options, settings, isPublic, closesAt } =
    req.body;

  const validation = validatePollData({ options, question });
  if (!validation.isValid) {
    return res.status(422).json(ApiResponse.validationError(validation.errors));
  }

  const updateData = {
    closesAt: closesAt ? new Date(closesAt) : null,
    description: description?.trim(),
    isPublic: isPublic !== undefined ? isPublic : true,
    options: options.map((opt) => ({
      id: opt.id || Math.random().toString(36).substr(2, 9),
      text: opt.text.trim(),
      ...(opt.image && { image: opt.image }),
      ...(opt.description && { description: opt.description.trim() }),
    })),
    question: question.trim(),
    settings: settings || {},
  };

  const poll = await PollService.updatePoll(
    pollId,
    session.user.id,
    updateData
  );

  return res
    .status(200)
    .json(ApiResponse.success(poll, "Poll updated successfully"));
}

async function handleDeletePoll(req, res, pollId, session) {
  if (!session) {
    return res.status(401).json(ApiResponse.unauthorized());
  }

  await PollService.deletePoll(pollId, session.user.id);

  return res
    .status(200)
    .json(ApiResponse.success(null, "Poll deleted successfully"));
}
