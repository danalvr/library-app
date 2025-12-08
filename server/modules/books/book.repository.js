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

  findAllWithoutPagination() {
    return prisma.books.findMany({
      orderBy: { createdAt: "asc" },
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

  async delete(id) {
    const borrowingCount = await prisma.borrowings.count({
      where: {
        bookId: id,
      },
    });

    if (borrowingCount > 0) {
      throw new Error(
        "This member cannot be deleted because they still have borrowings record."
      );
    }
    return prisma.books.delete({ where: { id } });
  },
};
