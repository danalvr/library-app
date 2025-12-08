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

  async delete(id) {
    const bookCount = await prisma.books.count({
      where: { authorId: id },
    });

    if (bookCount > 0) {
      throw new Error(
        "This author cannot be deleted because it is still linked to existing books."
      );
    }

    return prisma.authors.delete({ where: { id } });
  },
};
