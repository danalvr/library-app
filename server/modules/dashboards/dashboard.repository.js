const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.dashboardRepository = {
  countBooks() {
    return prisma.books.count();
  },
  countActiveMembers() {
    return prisma.members.count();
  },
  countBorrowings() {
    return prisma.borrowings.count();
  },
  countOverdueBorrowings() {
    return prisma.borrowings.count({
      where: { status: "OVERDUE" },
    });
  },
  recentBorrowings() {
    return prisma.borrowings.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        borrowDate: true,
        dueDate: true,
        book: { select: { id: true, title: true } },
        member: { select: { id: true, name: true } },
      },
    });
  },
};
