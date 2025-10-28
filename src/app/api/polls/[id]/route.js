import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";

import authOptions from "@/lib/auth/options";
import { PollService } from "@/lib/db/services/poll-service";
import { ApiResponse, handleApiError } from "@/lib/utils/api-response";
import { validatePollData } from "@/lib/utils/validation";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id: pollId } = await params;
  const userId = session?.user?.id || null;

  try {
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";
    await PollService.recordPollView(pollId, userId, ipAddress, userAgent);
    const poll = await PollService.getPoll(pollId, userId);
    if (!poll) {
      return Response.json(ApiResponse.notFound("Poll not found"), {
        status: 404,
      });
    }
    return Response.json(ApiResponse.success(poll));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(ApiResponse.unauthorized(), { status: 401 });
  }
  const { id: pollId } = await params;
  try {
    const body = await req.json();
    const { question, description, options, settings, isPublic, closesAt } =
      body;

    const validation = validatePollData({ options, question });
    if (!validation.isValid) {
      return Response.json(ApiResponse.validationError(validation.errors), {
        status: 422,
      });
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
    return Response.json(
      ApiResponse.success(poll, "Poll updated successfully")
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(ApiResponse.unauthorized(), { status: 401 });
  }
  const { id: pollId } = await params;
  try {
    await PollService.deletePoll(pollId, session.user.id);

    return Response.json(
      ApiResponse.success(null, "Poll deleted successfully")
    );
  } catch (error) {
    return handleApiError(error);
  }
}
