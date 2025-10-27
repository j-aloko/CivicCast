import prisma from "../prisma";

export class PollService {
  static async createPoll(data) {
    return prisma.poll.create({
      data: {
        closesAt: data.closesAt,
        creatorId: data.creatorId,
        description: data.description,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        options: data.options,
        question: data.question,
        settings: data.settings || {
          allowComments: true,
          allowLikes: true,
          allowMultipleVotes: false,
          hideResultsUntilClosed: false,
          randomizeOptions: false,
          requireLogin: true,
        },
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
            views: true,
            votes: true,
          },
        },
        creator: {
          select: {
            email: true,
            id: true,
            image: true,
            name: true,
          },
        },
      },
    });
  }

  static async getPoll(id, userId = null) {
    const poll = await prisma.poll.findUnique({
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
            views: true,
            votes: true,
          },
        },
        creator: {
          select: {
            email: true,
            id: true,
            image: true,
            name: true,
          },
        },
        likes: {
          take: userId ? 1 : 0,
          where: userId ? { userId } : undefined,
        },
        votes: {
          take: userId ? 1 : 0,
          where: userId ? { userId } : undefined,
        },
      },
      where: { id },
    });

    if (!poll) return null;

    // Transform for frontend
    return {
      ...poll,
      userLiked: poll.likes.length > 0,
      userVote: poll.votes[0]?.option ?? null,
    };
  }

  static async getPolls(page = 1, limit = 10, userId = null) {
    const skip = (page - 1) * limit;

    const [polls, total] = await Promise.all([
      prisma.poll.findMany({
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
              views: true,
              votes: true,
            },
          },
          creator: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
            },
          },
          likes: {
            take: userId ? 1 : 0,
            where: userId ? { userId } : undefined,
          },
          votes: {
            take: userId ? 1 : 0,
            where: userId ? { userId } : undefined,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        where: { isActive: true, isPublic: true },
      }),
      prisma.poll.count({
        where: { isActive: true, isPublic: true },
      }),
    ]);

    const transformedPolls = polls.map((poll) => ({
      ...poll,
      userLiked: poll.likes.length > 0,
      userVote: poll.votes[0]?.option ?? null,
    }));

    return {
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
      polls: transformedPolls,
    };
  }

  static async getUserPolls(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [polls, total] = await Promise.all([
      prisma.poll.findMany({
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
              views: true,
              votes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        where: { creatorId: userId },
      }),
      prisma.poll.count({
        where: { creatorId: userId },
      }),
    ]);

    return {
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
      polls,
    };
  }

  static async updatePoll(id, userId, data) {
    // Verify ownership
    const poll = await prisma.poll.findFirst({
      where: { creatorId: userId, id },
    });

    if (!poll) {
      throw new Error("Poll not found or access denied");
    }

    return prisma.poll.update({
      data: {
        closesAt: data.closesAt,
        description: data.description,
        isPublic: data.isPublic,
        options: data.options,
        question: data.question,
        settings: data.settings,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
            views: true,
            votes: true,
          },
        },
        creator: {
          select: {
            email: true,
            id: true,
            image: true,
            name: true,
          },
        },
      },
      where: { id },
    });
  }

  static async deletePoll(id, userId) {
    // Verify ownership
    const poll = await prisma.poll.findFirst({
      where: { creatorId: userId, id },
    });

    if (!poll) {
      throw new Error("Poll not found or access denied");
    }

    return prisma.poll.delete({
      where: { id },
    });
  }

  static async getPollResults(pollId) {
    const votes = await prisma.vote.groupBy({
      _count: {
        option: true,
      },
      by: ["option"],
      where: { pollId },
    });

    const totalVotes = votes.reduce((sum, vote) => sum + vote._count.option, 0);

    return {
      results: votes.map((vote) => ({
        count: vote._count.option,
        option: vote.option,
        percentage:
          totalVotes > 0 ? (vote._count.option / totalVotes) * 100 : 0,
      })),
      totalVotes,
    };
  }

  static async recordPollView(pollId, userId, ipAddress, userAgent) {
    return prisma.pollView.create({
      data: {
        ipAddress,
        pollId,
        userAgent,
        userId: userId || null,
      },
    });
  }
}
