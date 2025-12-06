const { memberService } = require("./member.service");
const {
  createMemberSchema,
  updateMemberSchema,
} = require("./member.validation");

exports.memberController = {
  async list(req, res, next) {
    try {
      const result = await memberService.list(req.query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async detail(req, res, next) {
    try {
      const member = await memberService.getDetail(Number(req.params.id));
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const dto = createMemberSchema.parse(req.body);
      const newMember = await memberService.create(dto);
      res.status(201).json(newMember);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      if (!Object.keys(req.body).length) {
        return res.status(400).json({ message: "No data provided to update" });
      }

      const member = await memberService.getDetail(Number(req.params.id));
      if (!member) return res.status(404).json({ message: "Member not found" });

      const dto = updateMemberSchema.parse(req.body);
      const updated = await memberService.update(Number(req.params.id), dto);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const member = await memberService.getDetail(Number(req.params.id));
      if (!member) return res.status(404).json({ message: "Member not found" });

      await memberService.delete(Number(req.params.id));
      res.json({ message: "Member deleted" });
    } catch (err) {
      next(err);
    }
  },
};
