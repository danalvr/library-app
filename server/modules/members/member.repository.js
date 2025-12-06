const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.memberRepository = {
  findAll(skip, take) {
    return prisma.members.findMany({
      skip,
      take,
      orderBy: { createdAt: "asc" },
    });
  },

  findAllWithoutPagination() {
    return prisma.members.findMany({
      orderBy: { createdAt: "asc" },
    });
  },

  count() {
    return prisma.members.count();
  },

  findById(id) {
    return prisma.members.findUnique({
      where: { id },
    });
  },

  findByEmail(email) {
    return prisma.members.findUnique({
      where: { email },
    });
  },

  create(data) {
    return prisma.members.create({ data });
  },

  update(id, data) {
    return prisma.members.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.members.delete({ where: { id } });
  },
};
