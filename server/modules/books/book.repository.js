const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.bookRepository = {
  findAll(where, skip, take) {
    return prisma.books.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        category: true,
        publishingYear: true,
        description: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  count(where) {
    return prisma.books.count({ where });
  },

  findById(id) {
    return prisma.books.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        category: true,
        publishingYear: true,
        description: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  create(data) {
    return prisma.books.create({ data });
  },

  update(id, data) {
    return prisma.books.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.books.delete({ where: { id } });
  },
};
