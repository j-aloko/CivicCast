import prisma from "../prisma";

export class PollService {
  static async createPoll(data) {
    return prisma.poll.create({
      data: {
        closesAt: data.closesAt,
        creatorId: data.creatorId,
        description: data.description,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        options: {
          create: data.options.map((opt, index) => ({
            description: opt.description,
            image: opt.image,
            order: index,
            text: opt.text,
          })),
        },
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
        options: {
          orderBy: { order: "asc" },
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
        options: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
          orderBy: { order: "asc" },
        },
        votes: {
          take: userId ? 1 : 0,
          where: userId ? { userId } : undefined,
        },
      },
      where: { id },
    });

    if (!poll) return null;

    const totalVotes = poll._count.votes;
    const optionsWithStats = poll.options.map((option) => ({
      ...option,
      percentage: totalVotes > 0 ? (option._count.votes / totalVotes) * 100 : 0,
      voteCount: option._count.votes,
    }));

    return {
      ...poll,
      options: optionsWithStats,
      totalVotes,
      userLiked: poll.likes.length > 0,
      userVote: poll.votes[0] || null,
    };
  }

  static async getPollResults(pollId) {
    const options = await prisma.pollOption.findMany({
      orderBy: { order: "asc" },
      select: {
        _count: { select: { votes: true } },
        description: true,
        id: true,
        image: true,
        order: true,
        text: true,
      },
      where: { pollId },
    });
    const totalVotes = options.reduce((sum, o) => sum + o._count.votes, 0);
    const formatted = options.map((opt) => ({
      description: opt.description,
      id: opt.id,
      image: opt.image,
      order: opt.order,
      percentage: totalVotes > 0 ? (opt._count.votes / totalVotes) * 100 : 0,
      text: opt.text,
      voteCount: opt._count.votes,
    }));

    return {
      options: formatted,
      totalVotes,
    };
  }

  static async getPollForBroadcast(pollId) {
    return prisma.poll.findUnique({
      select: {
        closesAt: true,
        createdAt: true,
        creatorId: true,
        description: true,
        id: true,
        isActive: true,
        isPublic: true,
        question: true,
        settings: true,
        updatedAt: true,
      },
      where: { id: pollId },
    });
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
          options: {
            include: {
              _count: {
                select: {
                  votes: true,
                },
              },
            },
            orderBy: { order: "asc" },
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

    const transformedPolls = polls.map((poll) => {
      const totalVotes = poll._count.votes;
      const optionsWithStats = poll.options.map((option) => ({
        ...option,
        percentage:
          totalVotes > 0 ? (option._count.votes / totalVotes) * 100 : 0,
        voteCount: option._count.votes,
      }));

      return {
        ...poll,
        options: optionsWithStats,
        totalVotes,
        userLiked: poll.likes.length > 0,
        userVote: poll.votes[0] || null,
      };
    });

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

  static async updatePoll(id, userId, data) {
    const poll = await prisma.poll.findFirst({
      where: { creatorId: userId, id },
    });

    if (!poll) {
      throw new Error("Poll not found or access denied");
    }

    return prisma.$transaction(async (tx) => {
      const updatedPoll = await tx.poll.update({
        data: {
          closesAt: data.closesAt,
          description: data.description,
          isPublic: data.isPublic,
          question: data.question,
          settings: data.settings,
          updatedAt: new Date(),
        },
        where: { id },
      });

      await tx.pollOption.deleteMany({
        where: { pollId: id },
      });

      await tx.pollOption.createMany({
        data: data.options.map((opt, index) => ({
          description: opt.description,
          image: opt.image,
          order: index,
          pollId: id,
          text: opt.text,
        })),
      });

      return updatedPoll;
    });
  }

  static async deletePoll(id, userId) {
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
