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
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  const session = await getServerSession(req, res, authOptions);

  try {
    switch (req.method) {
      case "GET":
        await handleGetPolls(req, res, session);
        break;
      case "POST":
        await handleCreatePoll(req, res, session);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res
          .status(405)
          .json(ApiResponse.error(`Method ${req.method} Not Allowed`, 405));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

async function handleGetPolls(req, res, session) {
  const { page = 1, limit = 10 } = req.query;
  const userId = session?.user?.id || null;

  const result = await PollService.getPolls(+page, +limit, userId);

  res.status(200).json(ApiResponse.success(result));
}

async function handleCreatePoll(req, res, session) {
  if (!session) {
    return res.status(401).json(ApiResponse.unauthorized());
  }

  const { question, description, options, settings, isPublic, closesAt } =
    req.body;

  const validation = validatePollData({ options, question });
  if (!validation.isValid) {
    return res.status(422).json(ApiResponse.validationError(validation.errors));
  }
  const pollData = {
    closesAt: closesAt ? new Date(closesAt) : null,
    creatorId: session.user.id,
    description: description?.trim(),
    isPublic: isPublic !== undefined ? isPublic : true,
    options: options.map((opt) => ({
      id: Math.random().toString(36).substr(2, 9),
      text: opt.text.trim(),
      ...(opt.image && { image: opt.image }),
      ...(opt.description && { description: opt.description.trim() }),
    })),
    question: question.trim(),
    settings: settings || {},
  };
  const poll = await PollService.createPoll(pollData);
  return res
    .status(201)
    .json(ApiResponse.success(poll, "Poll created successfully", 201));
}
