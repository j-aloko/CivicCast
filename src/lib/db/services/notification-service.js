import prisma from "../prisma";

export class NotificationService {
  static async createNotification(data) {
    return prisma.notification.create({
      data: {
        actorId: data.actorId,
        pollId: data.pollId,
        type: data.type,
        userId: data.userId,
      },
      include: {
        actor: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
        poll: {
          select: {
            id: true,
            question: true,
          },
        },
        user: {
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

  static async getUserNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        include: {
          actor: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
          poll: {
            select: {
              id: true,
              question: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        where: { userId },
      }),
      prisma.notification.count({
        where: { userId },
      }),
    ]);

    return {
      notifications,
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    };
  }

  static async markAsRead(notificationId, userId) {
    return prisma.notification.updateMany({
      data: { read: true },
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  static async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      data: { read: true },
      where: {
        read: false,
        userId,
      },
    });
  }
}
