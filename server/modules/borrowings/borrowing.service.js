const { borrowingRepository } = require("./borrowing.repository");
const { bookRepository } = require("../books/book.repository");
const { memberRepository } = require("../members/member.repository");

exports.borrowingService = {
  async list({ page = 1, limit = 10 }) {
    const p = Number(page);
    const l = Number(limit);

    const [total, data] = await Promise.all([
      borrowingRepository.count(),
      borrowingRepository.findAll((p - 1) * l, l),
    ]);

    const enriched = data.map(this.enrichStatus);

    return {
      data: enriched,
      pagination: {
        page: p,
        limit: l,
        total,
      },
    };
  },

  async getDetail(id) {
    const borrowing = await borrowingRepository.findById(id);
    if (!borrowing) return null;

    return this.enrichStatus(borrowing);
  },

  enrichStatus(borrowing) {
    const now = new Date();

    if (!borrowing.returnDate && now > borrowing.dueDate) {
      borrowing.status = "OVERDUE";
    }

    return borrowing;
  },

  async create(dto) {
    const book = await bookRepository.findById(dto.bookId);
    if (!book) throw new Error("Book not found");

    const member = await memberRepository.findById(dto.memberId);
    if (!member) throw new Error("Member not found");

    return borrowingRepository.create({
      ...dto,
      status: "BORROWED",
    });
  },

  async update(id, dto) {
    const book = await bookRepository.findById(dto.bookId);
    if (!book) throw new Error("Book not found");

    const member = await memberRepository.findById(dto.memberId);
    if (!member) throw new Error("Member not found");

    const existing = await borrowingRepository.findById(id);
    const now = new Date();
    const effectiveDueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : existing.dueDate;

    if (!existing.returnDate && now > effectiveDueDate) {
      dto.status = "OVERDUE";
    }

    if (dto.return === true) {
      const isOverdue = now > effectiveDueDate;
      dto.status = isOverdue ? "RETURNED LATE" : "RETURNED";
      dto.returnDate = now;
    } else {
      dto.returnDate = null;
    }

    delete dto.return;

    return borrowingRepository.update(id, dto);
  },

  async remove(id) {
    return borrowingRepository.delete(id);
  },
};
