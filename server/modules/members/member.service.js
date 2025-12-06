const { memberRepository } = require("./member.repository");

exports.memberService = {
  async list({ page = 1, limit = 10, all }) {
    if (all === "true") {
      const data = await memberRepository.findAllWithoutPagination();
      return { data };
    }

    const p = Number(page);
    const l = Number(limit);

    const [total, data] = await Promise.all([
      memberRepository.count(),
      memberRepository.findAll((p - 1) * l, l),
    ]);

    return {
      data,
      pagination: { page: p, limit: l, total },
    };
  },

  getDetail(id) {
    return memberRepository.findById(id);
  },

  async create(dto) {
    const existing = await memberRepository.findByEmail(dto.email);
    if (existing) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      throw error;
    }

    return memberRepository.create(dto);
  },

  update(id, dto) {
    return memberRepository.update(id, dto);
  },

  delete(id) {
    return memberRepository.delete(id);
  },
};
