import { getServerSession } from "next-auth/next";

import authOptions from "@/lib/auth/options";
import { LikeService } from "@/lib/db/services/like-service";
import { PollService } from "@/lib/db/services/poll-service";
import { ApiResponse, handleApiError } from "@/lib/utils/api-response";

export async function GET(req, { params }) {
  const { id: pollId } = params;
  const session = await getServerSession(authOptions);

  try {
    const userId = session?.user?.id || null;
    const poll = await PollService.getPoll(pollId, userId);
    if (!poll) {
      return new Response(
        `data: ${JSON.stringify(ApiResponse.notFound())}\n\n`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Content-Type": "text/event-stream",
          },
          status: 200,
        }
      );
    }

    const encoder = new TextEncoder();
    let intervalId;
    const stream = new ReadableStream({
      cancel() {
        if (intervalId) {
          clearInterval(intervalId);
        }
        console.log("Live stream disconnected for poll:", pollId);
      },
      async start(controller) {
        try {
          const results = await PollService.getPollResults(pollId);
          const likeCount = await LikeService.getLikeCount(pollId);

          const initialData = {
            likeCount,
            poll,
            results,
          };

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(ApiResponse.success(initialData))}\n\n`
            )
          );
          intervalId = setInterval(async () => {
            try {
              const updatedResults = await PollService.getPollResults(pollId);
              const updatedLikeCount = await LikeService.getLikeCount(pollId);

              const updateData = {
                likeCount: updatedLikeCount,
                results: updatedResults,
              };

              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify(ApiResponse.success(updateData))}\n\n`
                )
              );
            } catch (error) {
              console.error("Live update error:", error);
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify(ApiResponse.error("Failed to fetch updates"))}\n\n`
                )
              );
            }
          }, 3000);
        } catch (error) {
          console.error("Stream start error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(ApiResponse.error("Failed to initialize live updates"))}\n\n`
            )
          );
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Access-Control-Allow-Headers": "Cache-Control",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Encoding": "none",
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
