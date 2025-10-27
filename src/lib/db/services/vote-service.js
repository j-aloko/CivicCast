import prisma from "../prisma";

export class VoteService {
  static async submitVote(pollId, userId, option) {
    // Check if poll exists and is active
    const poll = await prisma.poll.findFirst({
      where: {
        OR: [{ closesAt: null }, { closesAt: { gt: new Date() } }],
        id: pollId,
        isActive: true,
      },
    });

    if (!poll) {
      throw new Error("Poll not found or closed for voting");
    }

    // Check if user has already voted (unless multiple votes allowed)
    const settings = poll.settings || {};
    if (!settings.allowMultipleVotes) {
      const existingVote = await prisma.vote.findUnique({
        where: {
          pollId_userId: { pollId, userId },
        },
      });

      if (existingVote) {
        // Update existing vote
        return prisma.vote.update({
          data: { option, updatedAt: new Date() },
          where: { id: existingVote.id },
        });
      }
    }

    // Create new vote
    return prisma.vote.create({
      data: {
        option,
        pollId,
        userId,
      },
    });
  }

  static async getUserVote(pollId, userId) {
    return prisma.vote.findUnique({
      where: {
        pollId_userId: { pollId, userId },
      },
    });
  }

  static async getVoteStats(pollId) {
    return prisma.vote.groupBy({
      _count: {
        option: true,
      },
      by: ["option"],
      where: { pollId },
    });
  }
}
