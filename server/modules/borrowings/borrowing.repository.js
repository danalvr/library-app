const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.borrowingRepository = {
  findAll(skip, take, searchBy, keyword) {
    const where = {};

    if (keyword && searchBy) {
      if (searchBy === "book") {
        where.book = {
          title: { contains: keyword },
        };
      }

      if (searchBy === "member") {
        where.member = {
          name: { contains: keyword },
        };
      }
      if (searchBy === "date") {
        where.borrowDate = {
          gte: new Date(keyword),
          lt: new Date(
            new Date(keyword).setDate(new Date(keyword).getDate() + 1)
          ),
        };
      }
    }

    return prisma.borrowings.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: "desc" },
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

  count(searchBy, keyword) {
    const where = {};

    if (keyword && searchBy) {
      if (searchBy === "book") {
        where.book = {
          title: { contains: keyword },
        };
      }

      if (searchBy === "member") {
        where.member = {
          name: { contains: keyword },
        };
      }
      if (searchBy === "date") {
        where.borrowDate = {
          gte: new Date(keyword),
          lt: new Date(
            new Date(keyword).setDate(new Date(keyword).getDate() + 1)
          ),
        };
      }
    }

    return prisma.borrowings.count({ where });
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
