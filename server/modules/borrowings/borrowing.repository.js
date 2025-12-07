const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.borrowingRepository = {
  findAll(skip, take) {
    return prisma.borrowings.findMany({
      skip,
      take,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        status: true,
        borrowDate: true,
        dueDate: true,
        returnDate: true,
        book: {
          select: { id: true, title: true },
        },
        member: {
          select: { id: true, name: true },
        },
      },
    });
  },

  count() {
    return prisma.borrowings.count();
  },

  findById(id) {
    return prisma.borrowings.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        borrowDate: true,
        dueDate: true,
        returnDate: true,
        book: {
          select: { id: true, title: true },
        },
        member: {
          select: { id: true, name: true },
        },
      },
    });
  },

  create(data) {
    return prisma.borrowings.create({ data });
  },

  update(id, data) {
    return prisma.borrowings.update({
      where: { id },
      data,
    });
  },

  remove(id) {
    return prisma.borrowings.delete({ where: { id } });
  },
};
