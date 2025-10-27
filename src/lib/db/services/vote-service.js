import prisma from "../prisma";

export class VoteService {
  static async submitVote(pollId, optionId, userId) {
    // Check if poll exists and is active
    const poll = await prisma.poll.findFirst({
      include: {
        options: {
          where: { id: optionId },
        },
      },
      where: {
        OR: [{ closesAt: null }, { closesAt: { gt: new Date() } }],
        id: pollId,
        isActive: true,
      },
    });

    if (!poll) {
      throw new Error("Poll not found or closed for voting");
    }

    if (poll.options.length === 0) {
      throw new Error("Invalid option selected");
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
          data: {
            optionId,
            updatedAt: new Date(),
          },
          include: {
            option: true,
          },
          where: { id: existingVote.id },
        });
      }
    }

    // Create new vote
    return prisma.vote.create({
      data: {
        optionId,
        pollId,
        userId,
      },
      include: {
        option: true,
      },
    });
  }

  static async getUserVote(pollId, userId) {
    return prisma.vote.findUnique({
      include: {
        option: true,
      },
      where: {
        pollId_userId: { pollId, userId },
      },
    });
  }

  static async getVoteStats(pollId) {
    const votes = await prisma.vote.groupBy({
      _count: {
        optionId: true,
      },
      by: ["optionId"],
      where: { pollId },
    });

    const totalVotes = votes.reduce(
      (sum, vote) => sum + vote._count.optionId,
      0
    );

    return {
      totalVotes,
      votes,
    };
  }
}
