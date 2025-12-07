const { borrowingService } = require("./borrowing.service");
const {
  borrowingCreateSchema,
  borrowingUpdateSchema,
} = require("./borrowing.validation");

exports.borrowingController = {
  async list(req, res, next) {
    try {
      const result = await borrowingService.list(req.query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async detail(req, res, next) {
    try {
      const borrowing = await borrowingService.getDetail(Number(req.params.id));
      if (!borrowing)
        return res.status(404).json({ message: "Borrowing not found" });
      res.json(borrowing);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const dto = borrowingCreateSchema.parse(req.body);
      const result = await borrowingService.create(dto);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const borrowing = await borrowingService.getDetail(Number(req.params.id));
      if (!borrowing)
        return res.status(404).json({ message: "Borrowing not found" });

      const dto = borrowingUpdateSchema.parse(req.body);
      const result = await borrowingService.update(Number(req.params.id), dto);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const borrowing = await borrowingService.getDetail(Number(req.params.id));
      if (!borrowing)
        return res.status(404).json({ message: "Borrowing not found" });

      await borrowingService.remove(Number(req.params.id));
      res.json({ message: "Borrowing has been removed!" });
    } catch (err) {
      next(err);
    }
  },
};
