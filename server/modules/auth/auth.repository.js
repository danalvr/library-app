const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.authRepository = {
  findByEmail(email) {
    return prisma.users.findUnique({ where: { email } });
  },

  create(data) {
    return prisma.users.create({
      data,
      select: {
        email: true,
        createdAt: true,
      },
    });
  },
};
