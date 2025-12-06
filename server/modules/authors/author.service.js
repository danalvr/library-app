const { authorRepository } = require("./author.repository");

exports.authorService = {
  async list({ page = 1, limit = 10, all }) {
    if (all === "true") {
      const data = await authorRepository.findAllWithoutPagination();
      return { data };
    }

    const p = Number(page);
    const l = Number(limit);

    const [total, data] = await Promise.all([
      authorRepository.count(),
      authorRepository.findAll((p - 1) * l, l),
    ]);

    return {
      data,
      pagination: {
        page: p,
        limit: l,
        total,
      },
    };
  },

  getDetail(id) {
    return authorRepository.findById(id);
  },

  create(dto) {
    return authorRepository.create(dto);
  },

  update(id, dto) {
    return authorRepository.update(id, dto);
  },

  delete(id) {
    return authorRepository.delete(id);
  },
};
