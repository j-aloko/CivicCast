import prisma from "@/lib/db/prisma";

import { ApiResponse } from "../../../lib/utils/api-response";

export default async function handler(req, res) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json(
      ApiResponse.success({
        database: "connected",
        status: "healthy",
        timestamp: new Date().toISOString(),
      })
    );
  } catch {
    res.status(503).json(
      ApiResponse.error("Service unavailable", 503, {
        database: "disconnected",
      })
    );
  }
}
