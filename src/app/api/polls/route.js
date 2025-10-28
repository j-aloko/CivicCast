import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../lib/auth/options";
import { PollService } from "../../../lib/db/services/poll-service";
import { ApiResponse, handleApiError } from "../../../lib/utils/api-response";
import { validatePollData } from "../../../lib/utils/validation";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  try {
    const result = await PollService.getPolls(+page, +limit, session?.user?.id);
    return Response.json(ApiResponse.success(result));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(ApiResponse.unauthorized(), { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, description, options, settings, isPublic, closesAt } =
      body;

    // Validate input
    const validation = validatePollData({ options, question });
    if (!validation.isValid) {
      return Response.json(ApiResponse.validationError(validation.errors), {
        status: 422,
      });
    }

    const pollData = {
      closesAt: closesAt ? new Date(closesAt) : null,
      creatorId: session.user.id,
      description: description?.trim(),
      isPublic: isPublic !== undefined ? isPublic : true,
      options: options.map((opt) => ({
        text: opt.text.trim(),
        ...(opt.description && { description: opt.description.trim() }),
        ...(opt.image && { image: opt.image }),
      })),
      question: question.trim(),
      settings: settings || {},
    };

    const poll = await PollService.createPoll(pollData);

    return Response.json(
      ApiResponse.success(poll, "Poll created successfully", 201),
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
