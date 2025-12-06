const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.authorRepository = {
  findAll(skip, take) {
    return prisma.authors.findMany({
      skip,
      take,
      orderBy: { createdAt: "asc" },
    });
  },

  findAllWithoutPagination() {
    return prisma.authors.findMany({
      orderBy: { createdAt: "asc" },
    });
  },

  count() {
    return prisma.authors.count();
  },

  findById(id) {
    return prisma.authors.findUnique({
      where: { id },
    });
  },

  create(data) {
    return prisma.authors.create({ data });
  },

  update(id, data) {
    return prisma.authors.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.authors.delete({ where: { id } });
  },
};
