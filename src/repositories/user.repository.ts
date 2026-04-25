import { prisma } from "../config/prisma";
import { Prisma, User } from "../generated/prisma/client";

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  findByIdentifier(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  },

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  findAll(skip = 0, take = 50) {
    return prisma.$transaction([
      prisma.user.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
      prisma.user.count(),
    ]);
  },

  deleteById(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
