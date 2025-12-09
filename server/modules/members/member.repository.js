const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.memberRepository = {
  findAll(skip, take) {
    return prisma.members.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  findAllWithoutPagination() {
    return prisma.members.findMany({
      orderBy: { createdAt: "desc" },
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

  async delete(id) {
    const activeBorrowings = await prisma.borrowings.count({
      where: {
        memberId: id,
      },
    });

    if (activeBorrowings > 0) {
      throw new Error(
        "This member cannot be deleted because they still have borrowings record."
      );
    }

    return prisma.members.delete({ where: { id } });
  },
};
