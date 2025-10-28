import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth/options";
import { registerDashboard } from "@/lib/utils/sse-manager";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const stream = new ReadableStream({
    start(controller) {
      registerDashboard(controller);
      (async () => {
        const { PollService } = await import("@/lib/db/services/poll-service");
        const polls = await PollService.getPolls(1, 6);
        const init = {
          data: { polls: polls.polls },
          success: true,
          timestamp: new Date().toISOString(),
        };
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(init)}\n\n`)
        );
      })();
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
};
