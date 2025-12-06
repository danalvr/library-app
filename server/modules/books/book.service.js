const { authorRepository } = require("../authors/author.repository");
const { bookRepository } = require("./book.repository");

exports.bookService = {
  async list({ search, page = 1, limit = 10, all }) {
    if (all === "true") {
      const data = await bookRepository.findAllWithoutPagination();
      return { data };
    }

    const p = Number(page);
    const l = Number(limit);

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { author: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      bookRepository.count(where),
      bookRepository.findAll(where, (p - 1) * l, l),
    ]);

    return {
      data,
      pagination: { page: p, limit: l, total },
    };
  },

  getDetail(id) {
    return bookRepository.findById(id);
  },

  async create(dto) {
    const author = await authorRepository.findById(dto.authorId);
    if (!author) {
      const error = new Error("Author not found");
      error.statusCode = 404;
      throw error;
    }

    return bookRepository.create(dto);
  },

  async update(id, dto) {
    const author = await authorRepository.findById(dto.authorId);
    if (!author) {
      const error = new Error("Author not found");
      error.statusCode = 404;
      throw error;
    }
    return bookRepository.update(id, dto);
  },

  delete(id) {
    return bookRepository.delete(id);
  },
};
