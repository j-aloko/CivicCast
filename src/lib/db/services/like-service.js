import prisma from "../prisma";

export class LikeService {
  static async toggleLike(pollId, userId) {
    const existingLike = await prisma.like.findUnique({
      where: {
        pollId_userId: { pollId, userId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    }
    await prisma.like.create({
      data: {
        pollId,
        userId,
      },
    });
    return { liked: true };
  }

  static async getLikeCount(pollId) {
    return prisma.like.count({
      where: { pollId },
    });
  }

  static async getUserLike(pollId, userId) {
    return prisma.like.findUnique({
      where: {
        pollId_userId: { pollId, userId },
      },
    });
  }
}
