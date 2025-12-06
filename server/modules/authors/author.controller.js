const { authorService } = require("./author.service");
const {
  createAuthorSchema,
  updateAuthorSchema,
} = require("./author.validation");

exports.authorController = {
  async list(req, res, next) {
    try {
      const result = await authorService.list(req.query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async detail(req, res, next) {
    try {
      const author = await authorService.getDetail(Number(req.params.id));
      if (!author) return res.status(404).json({ message: "Author not found" });

      res.json(author);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const dto = createAuthorSchema.parse(req.body);
      const author = await authorService.create(dto);
      res.status(201).json(author);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      if (!Object.keys(req.body).length) {
        return res.status(400).json({
          message: "No data provided to update",
        });
      }

      const author = await authorService.getDetail(Number(req.params.id));
      if (!author) return res.status(404).json({ message: "Author not found" });

      const dto = updateAuthorSchema.parse(req.body);
      const updated = await authorService.update(Number(req.params.id), dto);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const author = await authorService.getDetail(Number(req.params.id));
      if (!author) return res.status(404).json({ message: "Author not found" });

      await authorService.delete(Number(req.params.id));
      res.json({ message: "Author deleted" });
    } catch (err) {
      next(err);
    }
  },
};
